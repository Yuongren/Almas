export { resolveImageUrl, uploadBlogImage as uploadReviewAvatar } from "./blog";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:4000"
).replace(/\/$/, "");

const REVIEWS_BASE = `${API_URL}/api/reviews`;

export type Review = {
  id: string;
  author_name: string;
  author_avatar_path: string | null;
  rating: number | null;
  content: string;
  created_at: string;
};

export async function fetchReviews(): Promise<Review[]> {
  try {
    const res = await fetch(REVIEWS_BASE);
    const data = await res.json();
    return data.items ?? [];
  } catch (error) {
    console.error("Failed to load reviews:", error);
    return [];
  }
}

export async function submitReview(input: {
  author_name: string;
  content: string;
  rating?: number;
  author_avatar_path?: string;
}) {
  const res = await fetch(REVIEWS_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      // Ratings are stored as whole numbers — round any half-star
      // selection before it ever reaches the server.
      rating: input.rating !== undefined ? Math.round(input.rating) : undefined,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to submit review.");
  return data.item;
}