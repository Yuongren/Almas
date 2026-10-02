import { useEffect, useState } from "react";
import { Upload, Trash2, Music, Play, Star, Loader2 } from "lucide-react";

type AudioTrack = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  storage_path: string;
  is_paid: boolean;
  skiza_code: string | null;
  play_count: number;
  rating_avg: number | null;
  rating_count: number;
  created_at: string;
};

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function AudioAdmin() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("campaign_tunes");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [skizaCode, setSkizaCode] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadTracks() {
    setLoadingTracks(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/admin/audio`);
      const text = await response.text();
      const payload = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(payload.error || `Failed to load audio library (${response.status})`);
      }

      const items = Array.isArray(payload) ? payload : payload.items || payload.tracks || [];
      setTracks(items);
    } catch (error) {
      console.error("Failed to load tracks:", error);
      setTracks([]);
      setMessage(error instanceof Error ? error.message : "Unable to load audio library.");
    } finally {
      setLoadingTracks(false);
    }
  }

  useEffect(() => {
    loadTracks();
  }, []);

  const totalTunes = tracks.length;
  const totalPlays = tracks.reduce((total, track) => total + Number(track.play_count || 0), 0);
  const paidTunes = tracks.filter((t) => t.is_paid).length;
  const freeTunes = tracks.filter((t) => !t.is_paid).length;
  const totalRatings = tracks.reduce((total, track) => total + Number(track.rating_count || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!file || !title.trim()) {
      setMessage("Please choose a file and enter a title.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description);
      formData.append("category", category);
      formData.append("isPaid", String(isPaid));
      formData.append("skizaCode", skizaCode);
      formData.append("file", file, file.name);

      const response = await fetch(`${API_URL}/admin/audio/upload`, {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      const payload = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(payload.error || "Upload failed.");
      }

      setMessage("Audio uploaded successfully.");
      setTitle("");
      setDescription("");
      setSkizaCode("");
      setIsPaid(false);
      setFile(null);

      const fileInput = document.getElementById("audio-file") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";

      await loadTracks();
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(track: AudioTrack) {
    const confirmed = window.confirm(
      `Delete "${track.title}"?\n\nThis will permanently remove the audio file and its database record.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(track.id);

      const response = await fetch(`${API_URL}/admin/audio/${track.id}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Delete failed.");
      }

      setTracks((current) => current.filter((item) => item.id !== track.id));
      setMessage(`"${track.title}" deleted successfully.`);
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 28 }}>
      {/* STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard icon={<Music size={22} />} label="Total Tunes" value={totalTunes} />
        <StatCard icon={<Play size={22} />} label="Total Plays" value={totalPlays} />
        <StatCard icon={<Music size={22} />} label="Paid Tunes" value={paidTunes} />
        <StatCard icon={<Music size={22} />} label="Free Tunes" value={freeTunes} />
        <StatCard icon={<Star size={22} />} label="Total Ratings" value={totalRatings} />
      </div>

      {/* UPLOAD FORM */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <Upload size={20} />
          <h2 style={{ margin: 0, fontSize: 20 }}>Upload New Audio</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            style={inputStyle}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option value="campaign_tunes">Campaign Tunes</option>
            <option value="church_audio">Church Audio</option>
            <option value="native_languages">Native Languages</option>
            <option value="business_greetings">Business Greetings</option>
            <option value="hold_music">Hold Music</option>
            <option value="voice_overs">Voice Overs</option>
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            style={inputStyle}
          />

          <input
            value={skizaCode}
            onChange={(e) => setSkizaCode(e.target.value)}
            placeholder="Skiza code"
            style={inputStyle}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
            Paid tune
          </label>

          <input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          {uploading && file && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: "#020617",
                border: "1px solid #334155",
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Uploading <strong>{file.name}</strong>
              <br />
              Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              <br />
              Please keep this page open until the upload completes.
            </div>
          )}

          <button type="submit" disabled={uploading} style={primaryButtonStyle}>
            {uploading ? "Uploading..." : "Upload Audio"}
          </button>

          {message && <p style={{ color: "#fbbf24", margin: 0 }}>{message}</p>}
        </form>
      </section>

      {/* AUDIO LIBRARY */}
      <section>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>Audio Library</h2>
          <p style={{ color: "#94a3b8", marginTop: 5 }}>
            {tracks.length} tune{tracks.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>

        {loadingTracks ? (
          <EmptyState text="Loading audio library..." />
        ) : tracks.length === 0 ? (
          <EmptyState text="No audio uploaded yet." />
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {tracks.map((track) => (
              <div
                key={track.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 20,
                  alignItems: "center",
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 16,
                  padding: 18,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: "#f59e0b",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: 5,
                    }}
                  >
                    {track.category}
                  </div>

                  <h3 style={{ margin: 0, fontSize: 17 }}>{track.title}</h3>

                  {track.description && (
                    <p style={{ color: "#94a3b8", margin: "6px 0 0", fontSize: 13 }}>
                      {track.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                      marginTop: 12,
                      color: "#cbd5e1",
                      fontSize: 13,
                    }}
                  >
                    <span>▶ {Number(track.play_count || 0)} plays</span>

                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={13} style={{ color: "#f59e0b" }} />
                      {track.rating_count > 0
                        ? `${track.rating_avg?.toFixed(1)} (${track.rating_count} rating${
                            track.rating_count === 1 ? "" : "s"
                          })`
                        : "No ratings yet"}
                    </span>

                    <span>{track.is_paid ? "Paid" : "Free"}</span>

                    {track.skiza_code && <span>Skiza: {track.skiza_code}</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(track)}
                  disabled={deletingId === track.id}
                  style={dangerButtonStyle}
                >
                  {deletingId === track.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#f59e0b", marginBottom: 12 }}>
        {icon}
        <span style={{ color: "#94a3b8", fontSize: 13 }}>{label}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800 }}>{value.toLocaleString()}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
        background: "#0f172a",
        borderRadius: 16,
        color: "#94a3b8",
      }}
    >
      {text}
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 18,
  padding: 24,
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 20,
};

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "13px 18px",
  borderRadius: 10,
  border: "none",
  background: "#f59e0b",
  color: "#111827",
  fontWeight: 700,
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  padding: "9px 13px",
  borderRadius: 9,
  border: "1px solid #7f1d1d",
  background: "#450a0a",
  color: "#fca5a5",
  cursor: "pointer",
};
