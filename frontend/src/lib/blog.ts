import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "./session";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:4000"
).replace(/\/$/, "");

const BLOG_BASE = `${API_URL}/api/blog`;

export type BlogCategory = { id: string; name: string; slug: string };

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image_path: string | null;
  author_name: string;
  author_avatar_path: string | null;
  tags: string[];
  like_count: number;
  published_at: string | null;
  created_at: string;
  blog_categories: BlogCategory | null;
};

export type BlogComment = {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
};

// Featured image / avatar fields store a Supabase Storage path, not a
// full URL. The "blog-images" bucket is public, so we can turn a path
// into a viewable URL client-side with the anon key.
export function resolveImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function fetchCategories(): Promise<BlogCategory[]> {
  try {
    const res = await fetch(`${BLOG_BASE}/categories`);
    const data = await res.json();
    return data.items ?? [];
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

export async function fetchPosts(params?: {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}): Promise<BlogPost[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.tag) query.set("tag", params.tag);
    if (params?.search) query.set("search", params.search);
    if (params?.featured) query.set("featured", "true");

    const res = await fetch(`${BLOG_BASE}/posts?${query.toString()}`);
    const data = await res.json();
    return data.items ?? [];
  } catch (error) {
    console.error("Failed to load posts:", error);
    return [];
  }
}

export async function fetchPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BLOG_BASE}/posts/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.item ?? null;
  } catch (error) {
    console.error("Failed to load post:", error);
    return null;
  }
}

export async function uploadBlogImage(
  file: File
): Promise<{ path: string; publicUrl: string } | null> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const res = await fetch(`${BLOG_BASE}/upload-image`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Image upload failed.");
  return { path: data.path, publicUrl: data.publicUrl };
}

export async function submitPost(input: {
  title: string;
  content: string;
  author_name: string;
  author_avatar_path?: string;
  featured_image_path?: string;
  category_id?: string;
  tags?: string[];
}) {
  const res = await fetch(`${BLOG_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to submit post.");
  return data.item;
}

export async function toggleLike(
  postId: string
): Promise<{ liked: boolean; like_count: number }> {
  const res = await fetch(`${BLOG_BASE}/posts/${postId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: getSessionId() }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update like.");
  return { liked: data.liked, like_count: data.like_count };
}

export async function fetchComments(postId: string): Promise<BlogComment[]> {
  try {
    const res = await fetch(`${BLOG_BASE}/posts/${postId}/comments`);
    const data = await res.json();
    return data.items ?? [];
  } catch (error) {
    console.error("Failed to load comments:", error);
    return [];
  }
}

export async function submitComment(
  postId: string,
  input: { author_name: string; content: string }
) {
  const res = await fetch(`${BLOG_BASE}/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, session_id: getSessionId() }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to submit comment.");
  return data.item;
}