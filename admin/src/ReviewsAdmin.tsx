import { useEffect, useState } from "react";
import { Star, CheckCircle2, Flag, Trash2, MessageSquareHeart } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "/api";

type ReviewStatus = "pending" | "approved" | "flagged";

type Review = {
  id: string;
  author_name: string;
  author_avatar_url: string | null;
  rating: number | null;
  content: string;
  status: ReviewStatus;
  created_at: string;
};

const STATUS_STYLES: Record<ReviewStatus, { bg: string; fg: string }> = {
  pending: { bg: "#3f2d0a", fg: "#fbbf24" },
  approved: { bg: "#123524", fg: "#34d399" },
  flagged: { bg: "#450a0a", fg: "#fca5a5" },
};

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all");

  async function loadReviews() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/reviews`);
      const data = await res.json();
      setReviews(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function updateStatus(review: Review, status: ReviewStatus) {
    try {
      const res = await fetch(`${API_URL}/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update review.");
      setReviews((current) =>
        current.map((r) => (r.id === review.id ? { ...r, status } : r))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update review.");
    }
  }

  async function deleteReview(review: Review) {
    if (!window.confirm(`Delete this review from "${review.author_name}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/admin/reviews/${review.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review.");
      setReviews((current) => current.filter((r) => r.id !== review.id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete review.");
    }
  }

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <section
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 18,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MessageSquareHeart size={18} />
          <h2 style={{ margin: 0, fontSize: 22, display: "flex", alignItems: "center" }}>
            Reviews & Feedback
            {pendingCount > 0 && (
              <span
                style={{
                  marginLeft: 10,
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  background: "#3f2d0a",
                  color: "#fbbf24",
                }}
              >
                {pendingCount} pending
              </span>
            )}
          </h2>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "pending", "approved", "flagged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: filter === f ? "1px solid #f59e0b" : "1px solid #334155",
                background: filter === f ? "#1e293b" : "#0f172a",
                color: filter === f ? "#fbbf24" : "#94a3b8",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <EmptyState text="Loading reviews..." />
      ) : filtered.length === 0 ? (
        <EmptyState text="No reviews here yet." />
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((review) => {
            const style = STATUS_STYLES[review.status];
            return (
              <div
                key={review.id}
                style={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: 14,
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ minWidth: 0, display: "flex", gap: 12 }}>
                    {review.author_avatar_url ? (
                      <img
                        src={review.author_avatar_url}
                        alt={review.author_name}
                        style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#1e293b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {review.author_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <strong>{review.author_name}</strong>
                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background: style.bg,
                          color: style.fg,
                          textTransform: "capitalize",
                        }}
                      >
                        {review.status}
                      </span>
                      {review.rating && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#f59e0b", fontSize: 12 }}>
                          <Star size={12} style={{ fill: "#f59e0b" }} /> {review.rating}/5
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "8px 0", color: "#cbd5e1", fontSize: 14 }}>{review.content}</p>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>
                      {new Date(review.created_at).toLocaleString()}
                    </p>
                  </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  {review.status !== "approved" && (
                    <button
                      onClick={() => updateStatus(review, "approved")}
                      style={{ ...ghostButtonStyle, borderColor: "#34d399", color: "#34d399" }}
                    >
                      <CheckCircle2 size={13} /> Approve
                    </button>
                  )}
                  {review.status !== "flagged" && (
                    <button
                      onClick={() => updateStatus(review, "flagged")}
                      style={{ ...ghostButtonStyle, borderColor: "#f87171", color: "#f87171" }}
                    >
                      <Flag size={13} /> Flag
                    </button>
                  )}
                  <button onClick={() => deleteReview(review)} style={dangerButtonStyle}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 32,
        textAlign: "center",
        color: "#94a3b8",
        background: "#020617",
        borderRadius: 12,
      }}
    >
      {text}
    </div>
  );
}

const ghostButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#cbd5e1",
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid #7f1d1d",
  background: "#450a0a",
  color: "#fca5a5",
  cursor: "pointer",
};
