import { useEffect, useState } from "react";
import {
  Music,
  Play,
  Star,
  Mail,
  Clock,
  MessageCircle,
  CheckCheck,
  Newspaper,
  Globe,
  Flag,
  ArrowRight,
  MessageSquareHeart,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "/api";

type Stats = {
  totalTunes: number;
  totalPlays: number;
  totalRatings: number;

  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  respondedRequests: number;

  totalPosts: number;
  publishedPosts: number;
  pendingPosts: number;
  flaggedPosts: number;
  publicSubmissions: number;
  pendingComments: number;

  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  flaggedReviews: number;
};

const emptyStats: Stats = {
  totalTunes: 0,
  totalPlays: 0,
  totalRatings: 0,
  totalRequests: 0,
  pendingRequests: 0,
  inProgressRequests: 0,
  respondedRequests: 0,
  totalPosts: 0,
  publishedPosts: 0,
  pendingPosts: 0,
  flaggedPosts: 0,
  publicSubmissions: 0,
  pendingComments: 0,
  totalReviews: 0,
  pendingReviews: 0,
  approvedReviews: 0,
  flaggedReviews: 0,
};

export default function Overview({
  onNavigate,
}: {
  onNavigate: (tab: "audio" | "contacts" | "blog" | "reviews") => void;
}) {
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    setLoading(true);
    try {
      const [audioRes, requestsRes, postsRes, commentsRes, reviewsRes] = await Promise.all([
        fetch(`${API_URL}/admin/audio`).then((r) => r.json()).catch(() => ({ items: [] })),
        fetch(`${API_URL}/admin/demo-requests`).then((r) => r.json()).catch(() => ({ items: [] })),
        fetch(`${API_URL}/admin/blog/posts`).then((r) => r.json()).catch(() => ({ items: [] })),
        fetch(`${API_URL}/admin/blog/comments`).then((r) => r.json()).catch(() => ({ items: [] })),
        fetch(`${API_URL}/admin/reviews`).then((r) => r.json()).catch(() => ({ items: [] })),
      ]);

      const tracks = audioRes.items ?? [];
      const requests = requestsRes.items ?? [];
      const posts = postsRes.items ?? [];
      const comments = commentsRes.items ?? [];
      const reviews = reviewsRes.items ?? [];

      setStats({
        totalTunes: tracks.length,
        totalPlays: tracks.reduce((t: number, x: any) => t + Number(x.play_count || 0), 0),
        totalRatings: tracks.reduce((t: number, x: any) => t + Number(x.rating_count || 0), 0),

        totalRequests: requests.length,
        pendingRequests: requests.filter((r: any) => r.status === "pending").length,
        inProgressRequests: requests.filter((r: any) => r.status === "in_progress").length,
        respondedRequests: requests.filter((r: any) => r.status === "responded").length,

        totalPosts: posts.length,
        publishedPosts: posts.filter((p: any) => p.status === "published").length,
        pendingPosts: posts.filter((p: any) => p.status === "pending").length,
        flaggedPosts: posts.filter((p: any) => p.flagged).length,
        publicSubmissions: posts.filter((p: any) => p.is_public_submission).length,
        pendingComments: comments.filter((c: any) => c.status === "pending").length,

        totalReviews: reviews.length,
        pendingReviews: reviews.filter((r: any) => r.status === "pending").length,
        approvedReviews: reviews.filter((r: any) => r.status === "approved").length,
        flaggedReviews: reviews.filter((r: any) => r.status === "flagged").length,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
        Loading overview...
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 28 }}>
      {/* AUDIO GROUP */}
      <GroupSection
        title="Audio Library"
        icon={<Music size={18} />}
        onGo={() => onNavigate("audio")}
      >
        <StatCard icon={<Music size={20} />} label="Total Tunes" value={stats.totalTunes} />
        <StatCard icon={<Play size={20} />} label="Total Plays" value={stats.totalPlays} />
        <StatCard icon={<Star size={20} />} label="Total Ratings" value={stats.totalRatings} />
      </GroupSection>

      {/* CONTACTS GROUP */}
      <GroupSection
        title="Contact & Demo Requests"
        icon={<Mail size={18} />}
        onGo={() => onNavigate("contacts")}
      >
        <StatCard icon={<Mail size={20} />} label="Total Requests" value={stats.totalRequests} />
        <StatCard icon={<Clock size={20} />} label="Pending" value={stats.pendingRequests} />
        <StatCard icon={<MessageCircle size={20} />} label="In Progress" value={stats.inProgressRequests} />
        <StatCard icon={<CheckCheck size={20} />} label="Responded" value={stats.respondedRequests} />
      </GroupSection>

      {/* BLOG GROUP */}
      <GroupSection
        title="Blog"
        icon={<Newspaper size={18} />}
        onGo={() => onNavigate("blog")}
      >
        <StatCard icon={<Newspaper size={20} />} label="Total Posts" value={stats.totalPosts} />
        <StatCard icon={<CheckCheck size={20} />} label="Published" value={stats.publishedPosts} />
        <StatCard icon={<Clock size={20} />} label="Pending Review" value={stats.pendingPosts} />
        <StatCard icon={<Flag size={20} />} label="Flagged" value={stats.flaggedPosts} />
        <StatCard icon={<Globe size={20} />} label="From Public Users" value={stats.publicSubmissions} />
        <StatCard icon={<MessageCircle size={20} />} label="Pending Comments" value={stats.pendingComments} />
      </GroupSection>

      {/* REVIEWS GROUP */}
      <GroupSection
        title="Reviews & Feedback"
        icon={<MessageSquareHeart size={18} />}
        onGo={() => onNavigate("reviews")}
      >
        <StatCard icon={<MessageSquareHeart size={20} />} label="Total Reviews" value={stats.totalReviews} />
        <StatCard icon={<Clock size={20} />} label="Pending" value={stats.pendingReviews} />
        <StatCard icon={<CheckCheck size={20} />} label="Approved" value={stats.approvedReviews} />
        <StatCard icon={<Flag size={20} />} label="Flagged" value={stats.flaggedReviews} />
      </GroupSection>
    </div>
  );
}

function GroupSection({
  title,
  icon,
  onGo,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  onGo: () => void;
  children: React.ReactNode;
}) {
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
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon}
          <h2 style={{ margin: 0, fontSize: 19 }}>{title}</h2>
        </div>

        <button
          onClick={onGo}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#020617",
            color: "#fbbf24",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          View details <ArrowRight size={13} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div
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
          alignItems: "center",
          gap: 8,
          color: "#f59e0b",
          marginBottom: 10,
        }}
      >
        {icon}
        <span style={{ color: "#94a3b8", fontSize: 12 }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{value.toLocaleString()}</div>
    </div>
  );
}
