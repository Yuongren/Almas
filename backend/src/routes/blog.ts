import { randomUUID } from "node:crypto";
import {
  createWriteStream,
  existsSync,
} from "node:fs";
import {
  mkdir,
  readFile,
  unlink,
} from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { FastifyPluginAsync } from "fastify";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, "../../uploads");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "", {
  auth: { persistSession: false, autoRefreshToken: false },
});

const VALID_POST_STATUSES = ["draft", "pending", "published", "archived"];
const VALID_COMMENT_STATUSES = ["pending", "approved", "flagged"];

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "post"
  );
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let suffix = 1;

  // Keep trying until we find a slug that isn't taken.
  while (true) {
    const { data } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;

    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

// Streams a single-file multipart upload to Supabase Storage and
// returns its public URL. Used for both featured images and author
// avatars, since both live in the same public "blog-images" bucket.
async function handleImageUpload(
  request: any,
  fieldName = "file"
): Promise<{ path: string; publicUrl: string } | null> {
  await mkdir(uploadDir, { recursive: true });

  let localFilePath: string | null = null;
  let mimetype = "image/jpeg";

  try {
    for await (const part of request.parts()) {
      if (part.type === "file" && part.fieldname === fieldName) {
        const cleanedFileName = (part.filename || "image.jpg").replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );
        const safeName = `${Date.now()}-${randomUUID()}-${cleanedFileName}`;
        localFilePath = path.join(uploadDir, safeName);
        mimetype = part.mimetype || "image/jpeg";

        await pipeline(part.file, createWriteStream(localFilePath));
      } else if (part.type === "file") {
        part.file.resume();
      }
    }

    if (!localFilePath || !existsSync(localFilePath)) {
      return null;
    }

    const fileBuffer = await readFile(localFilePath);
    const storageName = path.basename(localFilePath);

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(storageName, fileBuffer, {
        contentType: mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error || !data) {
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(data.path);

    return { path: data.path, publicUrl: publicUrlData.publicUrl };
  } finally {
    if (localFilePath && existsSync(localFilePath)) {
      await unlink(localFilePath).catch(() => {});
    }
  }
}

export const blogRoutes: FastifyPluginAsync = async (fastify) => {
  /*
   * =====================================================
   * PUBLIC: CATEGORIES
   * =====================================================
   */

  fastify.get("/blog/categories", async (_request, reply) => {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      return reply.code(500).send({ error: error.message });
    }

    return reply.send({ success: true, items: data ?? [] });
  });

  /*
   * =====================================================
   * PUBLIC: LIST PUBLISHED POSTS
   * Supports ?category=slug, ?tag=name, ?search=text, ?featured=true
   * =====================================================
   */

  fastify.get("/blog/posts", async (request, reply) => {
    try {
      const { category, tag, search, featured } = request.query as {
        category?: string;
        tag?: string;
        search?: string;
        featured?: string;
      };

      let query = supabase
        .from("blog_posts")
        .select(
          `
            id, title, slug, content, featured_image_path, author_name,
            author_avatar_path, tags, like_count, published_at, created_at,
            blog_categories ( id, name, slug )
          `
        )
        .eq("status", "published")
        .eq("flagged", false)
        .order("published_at", { ascending: false });

      if (category) {
        const { data: categoryRow } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", category)
          .maybeSingle();

        if (categoryRow) {
          query = query.eq("category_id", categoryRow.id);
        }
      }

      if (tag) {
        query = query.contains("tags", [tag]);
      }

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,content.ilike.%${search}%`
        );
      }

      if (featured === "true") {
        query = query.limit(3);
      }

      const { data, error } = await query;

      if (error) {
        fastify.log.error(error, "Failed to load blog posts");
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true, items: data ?? [] });
    } catch (error) {
      fastify.log.error(error, "Blog list failed");
      return reply.code(500).send({ error: "Unable to load blog posts." });
    }
  });

  /*
   * =====================================================
   * PUBLIC: SINGLE POST BY SLUG
   * =====================================================
   */

  fastify.get("/blog/posts/:slug", async (request, reply) => {
    try {
      const { slug } = request.params as { slug: string };

      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
            id, title, slug, content, featured_image_path, author_name,
            author_avatar_path, tags, like_count, published_at, created_at,
            blog_categories ( id, name, slug )
          `
        )
        .eq("slug", slug)
        .eq("status", "published")
        .eq("flagged", false)
        .maybeSingle();

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      if (!data) {
        return reply.code(404).send({ error: "Post not found." });
      }

      return reply.send({ success: true, item: data });
    } catch (error) {
      fastify.log.error(error, "Blog post fetch failed");
      return reply.code(500).send({ error: "Unable to load post." });
    }
  });

  /*
   * =====================================================
   * PUBLIC: UPLOAD AN IMAGE (used for the writer's avatar
   * on a public submission)
   * =====================================================
   */

  fastify.post("/blog/upload-image", async (request, reply) => {
    try {
      const result = await handleImageUpload(request, "file");

      if (!result) {
        return reply.code(400).send({ error: "No image uploaded." });
      }

      return reply.send({ success: true, ...result });
    } catch (error) {
      fastify.log.error(error, "Public blog image upload failed");
      return reply.code(500).send({ error: "Unable to upload image." });
    }
  });

  /*
   * =====================================================
   * PUBLIC: SUBMIT A POST (goes in as "pending")
   * =====================================================
   */

  fastify.post("/blog/posts", async (request, reply) => {
    try {
      const {
        title,
        content,
        author_name,
        author_avatar_path,
        featured_image_path,
        category_id,
        tags,
      } = request.body as {
        title: string;
        content: string;
        author_name: string;
        author_avatar_path?: string;
        featured_image_path?: string;
        category_id?: string;
        tags?: string[];
      };

      if (!title?.trim() || !content?.trim() || !author_name?.trim()) {
        return reply.code(400).send({
          error: "Title, content and author name are required.",
        });
      }

      const slug = await generateUniqueSlug(title);

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: title.trim(),
          slug,
          content: content.trim(),
          author_name: author_name.trim(),
          author_avatar_path: author_avatar_path || null,
          featured_image_path: featured_image_path || null,
          category_id: category_id || null,
          tags: tags ?? [],
          status: "pending",
          is_public_submission: true,
        })
        .select()
        .single();

      if (error) {
        fastify.log.error(error, "Failed to save public blog submission");
        return reply.code(500).send({ error: error.message });
      }

      return reply.code(201).send({ success: true, item: data });
    } catch (error) {
      fastify.log.error(error, "Blog submission failed");
      return reply.code(500).send({ error: "Unable to submit post." });
    }
  });

  /*
   * =====================================================
   * PUBLIC: LIKE / UNLIKE A POST (session-based, no login)
   * =====================================================
   */

  fastify.post("/blog/posts/:id/like", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { session_id } = request.body as { session_id: string };

      if (!session_id) {
        return reply.code(400).send({ error: "session_id is required." });
      }

      const { data: existing } = await supabase
        .from("blog_post_likes")
        .select("id")
        .eq("post_id", id)
        .eq("session_id", session_id)
        .maybeSingle();

      if (existing) {
        // Already liked -> unlike
        await supabase.from("blog_post_likes").delete().eq("id", existing.id);
        await supabase.rpc("decrement_post_likes", { p_post_id: id }).catch(() => {});

        const { data: updated } = await supabase
          .from("blog_posts")
          .select("like_count")
          .eq("id", id)
          .maybeSingle();

        return reply.send({
          success: true,
          liked: false,
          like_count: updated?.like_count ?? 0,
        });
      }

      await supabase.from("blog_post_likes").insert({
        post_id: id,
        session_id,
      });

      const { data: track } = await supabase
        .from("blog_posts")
        .select("like_count")
        .eq("id", id)
        .maybeSingle();

      const newCount = (track?.like_count ?? 0) + 1;

      await supabase
        .from("blog_posts")
        .update({ like_count: newCount })
        .eq("id", id);

      return reply.send({ success: true, liked: true, like_count: newCount });
    } catch (error) {
      fastify.log.error(error, "Like toggle failed");
      return reply.code(500).send({ error: "Unable to update like." });
    }
  });

  /*
   * =====================================================
   * PUBLIC: COMMENTS — list approved, submit new (pending)
   * =====================================================
   */

  fastify.get("/blog/posts/:id/comments", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const { data, error } = await supabase
        .from("blog_comments")
        .select("id, author_name, content, created_at")
        .eq("post_id", id)
        .eq("status", "approved")
        .order("created_at", { ascending: true });

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true, items: data ?? [] });
    } catch (error) {
      fastify.log.error(error, "Comment list failed");
      return reply.code(500).send({ error: "Unable to load comments." });
    }
  });

  fastify.post("/blog/posts/:id/comments", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { author_name, content, session_id } = request.body as {
        author_name: string;
        content: string;
        session_id?: string;
      };

      if (!author_name?.trim() || !content?.trim()) {
        return reply.code(400).send({
          error: "Name and comment content are required.",
        });
      }

      const { data, error } = await supabase
        .from("blog_comments")
        .insert({
          post_id: id,
          author_name: author_name.trim(),
          content: content.trim(),
          session_id: session_id || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.code(201).send({ success: true, item: data });
    } catch (error) {
      fastify.log.error(error, "Comment submission failed");
      return reply.code(500).send({ error: "Unable to submit comment." });
    }
  });

  /*
   * =====================================================
   * ADMIN: LIST ALL POSTS (any status)
   * =====================================================
   */

  fastify.get("/admin/blog/posts", async (_request, reply) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
            id, title, slug, content, featured_image_path, author_name,
            author_avatar_path, category_id, tags, status, is_public_submission,
            flagged, scheduled_at, published_at, like_count, created_at, updated_at,
            blog_categories ( id, name, slug )
          `
        )
        .order("created_at", { ascending: false });

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true, items: data ?? [] });
    } catch (error) {
      fastify.log.error(error, "Admin blog list failed");
      return reply.code(500).send({ error: "Unable to load posts." });
    }
  });

  /*
   * =====================================================
   * ADMIN: CREATE A POST (admin-authored)
   * =====================================================
   */

  fastify.post("/admin/blog/posts", async (request, reply) => {
    try {
      const {
        title,
        content,
        author_name,
        author_avatar_path,
        featured_image_path,
        category_id,
        tags,
        status,
        scheduled_at,
      } = request.body as {
        title: string;
        content: string;
        author_name: string;
        author_avatar_path?: string;
        featured_image_path?: string;
        category_id?: string;
        tags?: string[];
        status?: string;
        scheduled_at?: string;
      };

      if (!title?.trim() || !content?.trim() || !author_name?.trim()) {
        return reply.code(400).send({
          error: "Title, content and author name are required.",
        });
      }

      const resolvedStatus =
        status && VALID_POST_STATUSES.includes(status) ? status : "draft";

      const slug = await generateUniqueSlug(title);

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: title.trim(),
          slug,
          content: content.trim(),
          author_name: author_name.trim(),
          author_avatar_path: author_avatar_path || null,
          featured_image_path: featured_image_path || null,
          category_id: category_id || null,
          tags: tags ?? [],
          status: resolvedStatus,
          is_public_submission: false,
          scheduled_at: scheduled_at || null,
          published_at: resolvedStatus === "published" ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.code(201).send({ success: true, item: data });
    } catch (error) {
      fastify.log.error(error, "Admin post creation failed");
      return reply.code(500).send({ error: "Unable to create post." });
    }
  });

  /*
   * =====================================================
   * ADMIN: UPDATE A POST
   * (edit content, change status, approve/flag, publish/unpublish, archive)
   * =====================================================
   */

  fastify.patch("/admin/blog/posts/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as Record<string, unknown>;

      const updates: Record<string, unknown> = {};

      if (typeof body.title === "string") updates.title = body.title.trim();
      if (typeof body.content === "string") updates.content = body.content.trim();
      if (typeof body.author_name === "string") updates.author_name = body.author_name.trim();
      if (typeof body.author_avatar_path === "string") updates.author_avatar_path = body.author_avatar_path;
      if (typeof body.featured_image_path === "string") updates.featured_image_path = body.featured_image_path;
      if (body.category_id !== undefined) updates.category_id = body.category_id || null;
      if (Array.isArray(body.tags)) updates.tags = body.tags;
      if (typeof body.flagged === "boolean") updates.flagged = body.flagged;
      if (typeof body.scheduled_at === "string" || body.scheduled_at === null) {
        updates.scheduled_at = body.scheduled_at;
      }

      if (typeof body.status === "string") {
        if (!VALID_POST_STATUSES.includes(body.status)) {
          return reply.code(400).send({
            error: `Status must be one of: ${VALID_POST_STATUSES.join(", ")}`,
          });
        }
        updates.status = body.status;

        if (body.status === "published") {
          updates.published_at = new Date().toISOString();
        }
      }

      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true, item: data });
    } catch (error) {
      fastify.log.error(error, "Admin post update failed");
      return reply.code(500).send({ error: "Unable to update post." });
    }
  });

  /*
   * =====================================================
   * ADMIN: DELETE A POST
   * =====================================================
   */

  fastify.delete("/admin/blog/posts/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const { error } = await supabase.from("blog_posts").delete().eq("id", id);

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true });
    } catch (error) {
      fastify.log.error(error, "Admin post delete failed");
      return reply.code(500).send({ error: "Unable to delete post." });
    }
  });

  /*
   * =====================================================
   * ADMIN: UPLOAD FEATURED IMAGE OR AUTHOR AVATAR
   * Field name in the multipart form determines which:
   * "featured_image" or "avatar"
   * =====================================================
   */

  fastify.post("/admin/blog/upload-image", async (request, reply) => {
    try {
      const result = await handleImageUpload(request, "file");

      if (!result) {
        return reply.code(400).send({ error: "No image uploaded." });
      }

      return reply.send({ success: true, ...result });
    } catch (error) {
      fastify.log.error(error, "Blog image upload failed");
      return reply.code(500).send({ error: "Unable to upload image." });
    }
  });

  /*
   * =====================================================
   * ADMIN: CATEGORIES — create / delete
   * =====================================================
   */

  fastify.post("/admin/blog/categories", async (request, reply) => {
    try {
      const { name } = request.body as { name: string };

      if (!name?.trim()) {
        return reply.code(400).send({ error: "Category name is required." });
      }

      const slug = slugify(name);

      const { data, error } = await supabase
        .from("blog_categories")
        .insert({ name: name.trim(), slug })
        .select()
        .single();

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.code(201).send({ success: true, item: data });
    } catch (error) {
      fastify.log.error(error, "Category creation failed");
      return reply.code(500).send({ error: "Unable to create category." });
    }
  });

  fastify.delete("/admin/blog/categories/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const { error } = await supabase.from("blog_categories").delete().eq("id", id);

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true });
    } catch (error) {
      fastify.log.error(error, "Category delete failed");
      return reply.code(500).send({ error: "Unable to delete category." });
    }
  });

  /*
   * =====================================================
   * ADMIN: COMMENTS — list all, approve/flag, delete
   * =====================================================
   */

  fastify.get("/admin/blog/comments", async (_request, reply) => {
    try {
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*, blog_posts ( id, title, slug )")
        .order("created_at", { ascending: false });

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true, items: data ?? [] });
    } catch (error) {
      fastify.log.error(error, "Admin comment list failed");
      return reply.code(500).send({ error: "Unable to load comments." });
    }
  });

  fastify.patch("/admin/blog/comments/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };

      if (!VALID_COMMENT_STATUSES.includes(status)) {
        return reply.code(400).send({
          error: `Status must be one of: ${VALID_COMMENT_STATUSES.join(", ")}`,
        });
      }

      const { data, error } = await supabase
        .from("blog_comments")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true, item: data });
    } catch (error) {
      fastify.log.error(error, "Admin comment update failed");
      return reply.code(500).send({ error: "Unable to update comment." });
    }
  });

  fastify.delete("/admin/blog/comments/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const { error } = await supabase.from("blog_comments").delete().eq("id", id);

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true });
    } catch (error) {
      fastify.log.error(error, "Admin comment delete failed");
      return reply.code(500).send({ error: "Unable to delete comment." });
    }
  });
};