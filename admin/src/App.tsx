import { useEffect, useMemo, useState } from "react";
import {
  Upload,
  Trash2,
  Music,
  Play,
  RefreshCw,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

type AudioTrack = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  storage_path: string;
  is_paid: boolean;
  skiza_code: string | null;
  play_count: number;
  created_at: string;
};

type DemoRequest = {
  id: string;
  name: string;
  contact: string;
  organisation: string | null;
  request: string;
  created_at: string;
};

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function App() {
  // =====================================================
  // UPLOAD STATE
  // =====================================================

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("campaign_tunes");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [skizaCode, setSkizaCode] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // =====================================================
  // AUDIO STATE
  // =====================================================

  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =====================================================
  // CONTACT / DEMO REQUEST STATE
  // =====================================================

  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // =====================================================
  // LOAD AUDIO TRACKS
  // =====================================================

  async function loadTracks() {
    setLoadingTracks(true);
    setMessage("");

    try {
      console.log("Loading audio library...");

      const response = await fetch(
        `${API_URL}/admin/audio`
      );

      console.log(
        "GET /admin/audio status:",
        response.status
      );

      const text = await response.text();

      console.log(
        "GET /admin/audio response:",
        text
      );

      let payload: any = {};

      try {
        payload = text
          ? JSON.parse(text)
          : {};
      } catch (error) {
        console.error(
          "Failed to parse backend response:",
          error
        );

        throw new Error(
          "Backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          payload.error ||
            `Failed to load audio library (${response.status})`
        );
      }

      const items = Array.isArray(payload)
        ? payload
        : payload.items ||
          payload.tracks ||
          [];

      console.log(
        "Audio tracks received:",
        items
      );

      setTracks(items);
    } catch (error) {
      console.error(
        "Failed to load tracks:",
        error
      );

      setTracks([]);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load audio library."
      );
    } finally {
      setLoadingTracks(false);
    }
  }

  // =====================================================
  // LOAD CONTACT / DEMO REQUESTS
  // =====================================================

  async function loadDemoRequests() {
    try {
      setLoadingRequests(true);

      console.log(
        "Loading contact/demo requests..."
      );

      const response = await fetch(
        `${API_URL}/admin/demo-requests`
      );

      console.log(
        "GET /admin/demo-requests status:",
        response.status
      );

      const data = await response.json();

      console.log(
        "Contact/demo requests:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load contact requests."
        );
      }

      setDemoRequests(
        Array.isArray(data)
          ? data
          : data.items ?? []
      );
    } catch (error) {
      console.error(
        "Failed to load contact requests:",
        error
      );

      setDemoRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadTracks();
    loadDemoRequests();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalTunes = tracks.length;

  const totalPlays = useMemo(
    () =>
      tracks.reduce(
        (total, track) =>
          total +
          Number(track.play_count || 0),
        0
      ),
    [tracks]
  );

  const paidTunes = tracks.filter(
    (track) => track.is_paid
  ).length;

  const freeTunes = tracks.filter(
    (track) => !track.is_paid
  ).length;

  // =====================================================
  // UPLOAD AUDIO
  // =====================================================

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setMessage("");

    if (!file || !title.trim()) {
      setMessage(
        "Please choose a file and enter a title."
      );

      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "isPaid",
        String(isPaid)
      );

      formData.append(
        "skizaCode",
        skizaCode
      );

      formData.append(
        "file",
        file,
        file.name
      );

      console.log(
        "Uploading audio:",
        file.name
      );

      const response = await fetch(
        `${API_URL}/admin/audio/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text();

      console.log("Upload response:", text);

      const payload = text ? JSON.parse(text) : {};

      console.log(
        "Upload response:",
        payload
      );

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Upload failed."
        );
      }

      setMessage(
        "Audio uploaded successfully."
      );

      // Reset form
      setTitle("");
      setDescription("");
      setSkizaCode("");
      setIsPaid(false);
      setFile(null);

      const fileInput =
        document.getElementById(
          "audio-file"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      // Refresh audio library
      await loadTracks();
    } catch (error) {
      console.error(
        "Upload failed:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  // =====================================================
  // DELETE AUDIO
  // =====================================================

  async function handleDelete(
    track: AudioTrack
  ) {
    const confirmed =
      window.confirm(
        `Delete "${track.title}"?\n\nThis will permanently remove the audio file and its database record.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(track.id);

      const response =
        await fetch(
          `${API_URL}/admin/audio/${track.id}`,
          {
            method: "DELETE",
          }
        );

      const payload =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Delete failed."
        );
      }

      setTracks(
        (current) =>
          current.filter(
            (item) =>
              item.id !== track.id
          )
      );

      setMessage(
        `"${track.title}" deleted successfully.`
      );
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Delete failed."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07111f",
        color: "#f8f8f8",
        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 34,
                margin: 0,
              }}
            >
              Almas Admin
            </h1>

            <p
              style={{
                color: "#94a3b8",
                marginTop: 8,
              }}
            >
              Manage your audio library and
              contact requests.
            </p>
          </div>

          <button
            onClick={() => {
              loadTracks();
              loadDemoRequests();
            }}
            disabled={
              loadingTracks ||
              loadingRequests
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 10,
              border:
                "1px solid #334155",
              background: "#0f172a",
              color: "#fff",
              cursor:
                loadingTracks ||
                loadingRequests
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loadingTracks ||
                loadingRequests
                  ? 0.7
                  : 1,
            }}
          >
            <RefreshCw
              size={16}
              className={
                loadingTracks ||
                loadingRequests
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <StatCard
            icon={<Music size={22} />}
            label="Total Tunes"
            value={totalTunes}
          />

          <StatCard
            icon={<Play size={22} />}
            label="Total Plays"
            value={totalPlays}
          />

          <StatCard
            icon={
              <CheckCircle size={22} />
            }
            label="Paid Tunes"
            value={paidTunes}
          />

          <StatCard
            icon={<Music size={22} />}
            label="Free Tunes"
            value={freeTunes}
          />

          <StatCard
            icon={<Mail size={22} />}
            label="Contact Requests"
            value={demoRequests.length}
          />
        </div>

        {/* =====================================================
            UPLOAD NEW AUDIO
        ===================================================== */}

        <section
          style={{
            background: "#0f172a",
            border:
              "1px solid #1e293b",
            borderRadius: 18,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <Upload size={20} />

            <h2
              style={{
                margin: 0,
                fontSize: 20,
              }}
            >
              Upload New Audio
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: 16,
            }}
          >
            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Title"
              required
              style={inputStyle}
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option value="campaign_tunes">
                Campaign Tunes
              </option>

              <option value="church_audio">
                Church Audio
              </option>

              <option value="native_languages">
                Native Languages
              </option>

              <option value="business_greetings">
                Business Greetings
              </option>

              <option value="hold_music">
                Hold Music
              </option>

              <option value="voice_overs">
                Voice Overs
              </option>
            </select>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Description"
              rows={3}
              style={inputStyle}
            />

            <input
              value={skizaCode}
              onChange={(e) =>
                setSkizaCode(
                  e.target.value
                )
              }
              placeholder="Skiza code"
              style={inputStyle}
            />

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) =>
                  setIsPaid(
                    e.target.checked
                  )
                }
              />

              Paid tune
            </label>

            <input
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] ??
                    null
                )
              }
            />

            {/* UPLOAD PROGRESS */}

            {uploading && file && (
              <div
                style={{
                  padding:
                    "12px 14px",
                  borderRadius: 10,
                  background:
                    "#020617",
                  border:
                    "1px solid #334155",
                  color: "#94a3b8",
                  fontSize: 13,
                }}
              >
                Uploading{" "}
                <strong>
                  {file.name}
                </strong>

                <br />

                Size:{" "}
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB

                <br />

                Please keep this
                page open until the
                upload completes.
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              style={{
                padding:
                  "13px 18px",
                borderRadius: 10,
                border: "none",
                background:
                  "#f59e0b",
                color: "#111827",
                fontWeight: 700,
                cursor: uploading
                  ? "not-allowed"
                  : "pointer",
                opacity: uploading
                  ? 0.7
                  : 1,
              }}
            >
              {uploading
                ? "Uploading..."
                : "Upload Audio"}
            </button>

            {message && (
              <p
                style={{
                  color: "#fbbf24",
                  margin: 0,
                }}
              >
                {message}
              </p>
            )}
          </form>
        </section>

        {/* =====================================================
            CONTACT & DEMO REQUESTS
        ===================================================== */}

        <section
          style={{
            background: "#0f172a",
            border:
              "1px solid #1e293b",
            borderRadius: 18,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 20,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                }}
              >
                Contact & Demo Requests
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                Requests submitted from
                the public website.
              </p>
            </div>

            <div
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                background:
                  "#020617",
                border:
                  "1px solid #334155",
              }}
            >
              <span
                style={{
                  color: "#94a3b8",
                  fontSize: 12,
                  marginRight: 8,
                }}
              >
                Total
              </span>

              <strong>
                {demoRequests.length}
              </strong>
            </div>
          </div>

          {loadingRequests ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              Loading contact
              requests...
            </div>
          ) : demoRequests.length ===
            0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                background:
                  "#020617",
                borderRadius: 12,
                color: "#94a3b8",
              }}
            >
              <p
                style={{
                  color: "#f8f8f8",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                No contact requests
                yet.
              </p>

              <p
                style={{
                  marginTop: 6,
                }}
              >
                Requests submitted
                from the website
                will appear here.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              {demoRequests.map(
                (item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: 20,
                      borderRadius: 14,
                      background:
                        "#020617",
                      border:
                        "1px solid #1e293b",
                    }}
                  >
                    {/* REQUEST HEADER */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: 20,
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color:
                              "#94a3b8",
                            fontSize: 11,
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              "0.1em",
                          }}
                        >
                          Name
                        </div>

                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            marginTop: 4,
                          }}
                        >
                          {item.name}
                        </div>
                      </div>

                      <div
                        style={{
                          color:
                            "#94a3b8",
                          fontSize: 12,
                        }}
                      >
                        {item.created_at
                          ? new Date(
                              item.created_at
                            ).toLocaleString()
                          : "Date unavailable"}
                      </div>
                    </div>

                    {/* CONTACT DETAILS */}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 16,
                        marginTop: 18,
                      }}
                    >
                      <ContactDetail
                        icon={
                          <Phone
                            size={15}
                          />
                        }
                        label="Contact"
                        value={
                          item.contact
                        }
                      />

                      {item.organisation && (
                        <ContactDetail
                          icon={
                            <Building2
                              size={15}
                            />
                          }
                          label="Organisation"
                          value={
                            item.organisation
                          }
                        />
                      )}
                    </div>

                    {/* REQUEST */}

                    <div
                      style={{
                        marginTop: 18,
                        paddingTop: 16,
                        borderTop:
                          "1px solid #1e293b",
                      }}
                    >
                      <div
                        style={{
                          color:
                            "#94a3b8",
                          fontSize: 11,
                          textTransform:
                            "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Request
                      </div>

                      <div
                        style={{
                          color:
                            "#cbd5e1",
                          lineHeight: 1.6,
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {item.request}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            AUDIO LIBRARY
        ===================================================== */}

        <section>
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                }}
              >
                Audio Library
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  marginTop: 5,
                }}
              >
                {tracks.length} tune
                {tracks.length !== 1
                  ? "s"
                  : ""}{" "}
                uploaded
              </p>
            </div>
          </div>

          {loadingTracks ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#94a3b8",
                background:
                  "#0f172a",
                borderRadius: 16,
              }}
            >
              Loading audio
              library...
            </div>
          ) : tracks.length ===
            0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                background:
                  "#0f172a",
                borderRadius: 16,
                color: "#94a3b8",
              }}
            >
              No audio uploaded
              yet.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {tracks.map(
                (track) => (
                  <div
                    key={track.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr auto",
                      gap: 20,
                      alignItems:
                        "center",
                      background:
                        "#0f172a",
                      border:
                        "1px solid #1e293b",
                      borderRadius: 16,
                      padding: 18,
                    }}
                  >
                    {/* TRACK INFO */}

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          color:
                            "#f59e0b",
                          fontSize: 11,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.12em",
                          marginBottom: 5,
                        }}
                      >
                        {track.category}
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          fontSize: 17,
                        }}
                      >
                        {track.title}
                      </h3>

                      {track.description && (
                        <p
                          style={{
                            color:
                              "#94a3b8",
                            margin:
                              "6px 0 0",
                            fontSize: 13,
                          }}
                        >
                          {
                            track.description
                          }
                        </p>
                      )}

                      <div
                        style={{
                          display:
                            "flex",
                          gap: 16,
                          flexWrap:
                            "wrap",
                          marginTop: 12,
                          color:
                            "#cbd5e1",
                          fontSize: 13,
                        }}
                      >
                        <span>
                          ▶{" "}
                          {Number(
                            track.play_count ||
                              0
                          )}{" "}
                          plays
                        </span>

                        <span>
                          {track.is_paid
                            ? "Paid"
                            : "Free"}
                        </span>

                        {track.skiza_code && (
                          <span>
                            Skiza:{" "}
                            {
                              track.skiza_code
                            }
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDelete(
                          track
                        )
                      }
                      disabled={
                        deletingId ===
                        track.id
                      }
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: 7,
                        padding:
                          "9px 13px",
                        borderRadius: 9,
                        border:
                          "1px solid #7f1d1d",
                        background:
                          "#450a0a",
                        color:
                          "#fca5a5",
                        cursor:
                          deletingId ===
                          track.id
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          deletingId ===
                          track.id
                            ? 0.7
                            : 1,
                      }}
                    >
                      {deletingId ===
                      track.id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2
                          size={16}
                        />
                      )}

                      Delete
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

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
        background: "#0f172a",
        border:
          "1px solid #1e293b",
        borderRadius: 16,
        padding: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#f59e0b",
          marginBottom: 12,
        }}
      >
        {icon}

        <span
          style={{
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          {label}
        </span>
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
        }}
      >
        {value.toLocaleString()}
      </div>
    </div>
  );
}

// =====================================================
// CONTACT DETAIL
// =====================================================

function ContactDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "#94a3b8",
          fontSize: 11,
          textTransform: "uppercase",
        }}
      >
        {icon}

        {label}
      </div>

      <div
        style={{
          marginTop: 6,
          color: "#f8f8f8",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// =====================================================
// INPUT STYLE
// =====================================================

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};