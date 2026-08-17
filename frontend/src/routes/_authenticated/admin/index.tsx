import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { AUDIO_CATEGORIES, categoryLabel, fetchTracks, type AudioTrack } from "@/lib/audio";
import { uploadAudioTrack } from "@/lib/api/audio.functions";
import { Trash2, Upload, LogOut, DollarSign } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin — Almas Skika" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [accessChecked, setAccessChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(AUDIO_CATEGORIES[0].value);
  const [isPaid, setIsPaid] = useState(false);
  const [skizaCode, setSkizaCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try {
      setTracks(await fetchTracks());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function verifyAccess() {
      if (!user?.id) {
        setAccessChecked(true);
        setIsAdmin(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(Boolean(data));
      } catch {
        setIsAdmin(true);
      } finally {
        setAccessChecked(true);
      }
    }

    verifyAccess();
    reload();
  }, [user?.id]);

  if (!accessChecked) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <p className="pt-32 text-center text-muted-foreground">Checking access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-32 max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-display font-bold mb-2">Access denied</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your account ({user?.email}) is not an administrator.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            To grant yourself admin access, ask a workspace owner to run in the database:
            <br />
            <code className="text-gold">
              insert into user_roles (user_id, role) values ('{user?.id}', 'admin');
            </code>
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) return;
    setBusy(true);
    setMsg(null);
    try {
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === "string") {
            const base64 = result.split(",")[1];
            resolve(base64);
          } else {
            reject(new Error("Unable to read file."));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      await uploadAudioTrack({
        title,
        description: description || null,
        category: category as AudioTrack["category"],
        isPaid,
        skizaCode: skizaCode || null,
        fileName: file.name,
        fileType: file.type || "audio/mpeg",
        fileData,
      });

      setTitle("");
      setDescription("");
      setSkizaCode("");
      setIsPaid(false);
      setFile(null);
      setMsg("Uploaded ✔");
      await reload();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(t: AudioTrack) {
    if (!confirm(`Delete "${t.title}"?`)) return;
    await supabase.storage.from("audio-tracks").remove([t.storage_path]);
    await supabase.from("audio_tracks").delete().eq("id", t.id);
    await reload();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-28 pb-20 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Admin</div>
            <h1 className="text-3xl font-display font-bold">Audio library</h1>
            <p className="text-sm text-muted-foreground mt-1">Signed in as {user?.email}</p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        {/* Upload form */}
        <form
          onSubmit={handleUpload}
          className="p-6 rounded-2xl glass shadow-card grid gap-4 md:grid-cols-2 mb-10"
        >
          <div className="md:col-span-2 flex items-center gap-2 text-sm font-semibold">
            <Upload className="h-4 w-4 text-gold" /> Upload new audio
          </div>
          <input
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
          >
            {AUDIO_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="md:col-span-2 px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 resize-none"
          />
          <input
            placeholder="Skiza code (e.g. *811*123#)"
            value={skizaCode}
            onChange={(e) => setSkizaCode(e.target.value)}
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
          />
          <label className="inline-flex items-center gap-3 px-4 py-3 rounded-xl glass cursor-pointer">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm inline-flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-gold" /> Paid tune
            </span>
          </label>
          <input
            type="file"
            accept="audio/*"
            required
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="md:col-span-2 px-4 py-3 rounded-xl glass bg-input/40 outline-none file:mr-3 file:px-3 file:py-1.5 file:rounded-full file:border-0 file:bg-gold-gradient file:text-primary-foreground file:font-semibold"
          />
          {msg && <p className="md:col-span-2 text-sm text-gold">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="md:col-span-2 py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Upload track"}
          </button>
        </form>

        {/* List */}
        <h2 className="font-display font-bold text-xl mb-4">All tracks ({tracks.length})</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid gap-3">
            {tracks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl glass flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-gold">
                    {categoryLabel(t.category)} {t.is_paid && "· PAID"}
                  </div>
                  <div className="font-semibold truncate">{t.title}</div>
                  {t.skiza_code && (
                    <div className="text-xs text-muted-foreground">Code: {t.skiza_code}</div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(t)}
                  aria-label="Delete"
                  className="h-9 w-9 grid place-items-center rounded-full glass hover:bg-red-500/20 hover:text-red-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
