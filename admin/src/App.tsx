import { useState } from "react";
import {
  RefreshCw,
  LayoutDashboard,
  Music,
  Mail,
  Newspaper,
  MessageSquareHeart,
} from "lucide-react";
import Overview from "./Overview";
import AudioAdmin from "./AudioAdmin";
import ContactsAdmin from "./ContactsAdmin";
import BlogAdmin from "./BlogAdmin";
import ReviewsAdmin from "./ReviewsAdmin";

type Tab = "overview" | "audio" | "contacts" | "blog" | "reviews";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { id: "audio", label: "Audio", icon: <Music size={16} /> },
  { id: "contacts", label: "Contacts", icon: <Mail size={16} /> },
  { id: "blog", label: "Blog", icon: <Newspaper size={16} /> },
  { id: "reviews", label: "Reviews", icon: <MessageSquareHeart size={16} /> },
];

const TAB_SUBTITLES: Record<Tab, string> = {
  overview: "A summary of everything happening across your site.",
  audio: "Manage your audio library and uploads.",
  contacts: "Review and respond to contact and demo requests.",
  blog: "Write, review and moderate blog content.",
  reviews: "Approve, flag or remove feedback submitted by visitors.",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07111f",
        color: "#f8f8f8",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: 34, margin: 0 }}>Almas Admin</h1>
            <p style={{ color: "#94a3b8", marginTop: 8 }}>{TAB_SUBTITLES[activeTab]}</p>
          </div>

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 32,
            borderBottom: "1px solid #1e293b",
            paddingBottom: 4,
            flexWrap: "wrap",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: "10px 10px 0 0",
                border: "none",
                borderBottom:
                  activeTab === tab.id ? "2px solid #f59e0b" : "2px solid transparent",
                background: "transparent",
                color: activeTab === tab.id ? "#f59e0b" : "#94a3b8",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ACTIVE TAB CONTENT */}
        <div key={`${activeTab}-${refreshKey}`}>
          {activeTab === "overview" && <Overview onNavigate={setActiveTab} />}
          {activeTab === "audio" && <AudioAdmin />}
          {activeTab === "contacts" && <ContactsAdmin />}
          {activeTab === "blog" && <BlogAdmin />}
          {activeTab === "reviews" && <ReviewsAdmin />}
        </div>
      </div>
    </div>
  );
}
