import { FastifyPluginAsync } from "fastify";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "", {
  auth: { persistSession: false, autoRefreshToken: false },
});

const VALID_STATUSES = ["pending", "approved", "flagged"];

export const reviewRoutes: FastifyPluginAsync = async (fastify) => {
  /*
   * =====================================================
   * PUBLIC: SUBMIT A REVIEW (goes in as "pending")
   * =====================================================
   */
  fastify.post("/reviews", async (request, reply) => {
    try {
      const { author_name, rating, content, author_avatar_path } = request.body as {
        author_name: string;
        rating?: number;
        content: string;
        author_avatar_path?: string;
      };

      if (!author_name?.trim() || !content?.trim()) {
        return reply.code(400).send({
          error: "Your name and a review are required.",
        });
      }

      const safeRating =
        rating !== undefined && rating !== null ? Math.round(rating) : null;

      if (safeRating !== null && (safeRating < 1 || safeRating > 5)) {
        return reply.code(400).send({ error: "Rating must be between 1 and 5." });
      }

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          author_name: author_name.trim(),
          content: content.trim(),
          rating: safeRating,
          author_avatar_path: author_avatar_path || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        fastify.log.error(error, "Failed to save review");
        return reply.code(500).send({ error: error.message });
      }

      return reply.code(201).send({ success: true, item: data });
    } catch (error) {
      fastify.log.error(error, "Review submission failed");
      return reply.code(500).send({ error: "Unable to submit review." });
    }
  });

  /*
   * =====================================================
   * PUBLIC: LIST APPROVED REVIEWS
   * =====================================================
   */
  fastify.get("/reviews", async (_request, reply) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, author_name, author_avatar_path, rating, content, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true, items: data ?? [] });
    } catch (error) {
      fastify.log.error(error, "Review list failed");
      return reply.code(500).send({ error: "Unable to load reviews." });
    }
  });

  /*
   * =====================================================
   * ADMIN: LIST ALL REVIEWS
   * =====================================================
   */
  fastify.get("/admin/reviews", async (_request, reply) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      const items = (data ?? []).map((review) => ({
        ...review,
        author_avatar_url: review.author_avatar_path
          ? supabase.storage.from("blog-images").getPublicUrl(review.author_avatar_path).data.publicUrl
          : null,
      }));

      return reply.send({ success: true, items });
    } catch (error) {
      fastify.log.error(error, "Admin review list failed");
      return reply.code(500).send({ error: "Unable to load reviews." });
    }
  });

  /*
   * =====================================================
   * ADMIN: UPDATE STATUS (approve / flag / pending)
   * =====================================================
   */
  fastify.patch("/admin/reviews/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };

      if (!VALID_STATUSES.includes(status)) {
        return reply.code(400).send({
          error: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
        });
      }

      const { data, error } = await supabase
        .from("reviews")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true, item: data });
    } catch (error) {
      fastify.log.error(error, "Admin review update failed");
      return reply.code(500).send({ error: "Unable to update review." });
    }
  });

  /*
   * =====================================================
   * ADMIN: DELETE A REVIEW
   * =====================================================
   */
  fastify.delete("/admin/reviews/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) {
        return reply.code(500).send({ error: error.message });
      }

      return reply.send({ success: true });
    } catch (error) {
      fastify.log.error(error, "Admin review delete failed");
      return reply.code(500).send({ error: "Unable to delete review." });
    }
  });
};