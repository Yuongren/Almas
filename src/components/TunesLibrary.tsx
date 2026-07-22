import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, X, Play, Pause, Download, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AUDIO_CATEGORIES,
  categoryLabel,
  fetchMyRatings,
  fetchRatings,
  fetchTracks,
  rateTrack,
  type AudioTrack,
  type RatingSummary,
} from "@/lib/audio";
import { useAuth } from "@/hooks/useAuth";
import { StarRating } from "./StarRating";

export function TunesLibrary({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [ratings, setRatings] = useState<Record<string, RatingSummary>>({});
  const [myRatings, setMyRatings] = useState<Record<string, number>>({});
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [codeFor, setCodeFor] = useState<AudioTrack | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const [t, r] = await Promise.all([fetchTracks(), fetchRatings()]);
        setTracks(t);
        setRatings(r);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (user) fetchMyRatings(user.id).then(setMyRatings);
    else setMyRatings({});
  }, [user]);

  const filtered = useMemo(() => {
    return tracks.filter((t) => {
      const matchCat = cat === "all" || t.category === cat;
      const s = q.trim().toLowerCase();
      const matchQ =
        !s ||
        t.title.toLowerCase().includes(s) ||
        (t.description ?? "").toLowerCase().includes(s) ||
        categoryLabel(t.category).toLowerCase().includes(s);
      return matchCat && matchQ;
    });
  }, [tracks, cat, q]);

  async function ensureUrl(track: AudioTrack) {
    if (audioUrls[track.id]) return audioUrls[track.id];
    const { data, error } = await supabase.storage
      .from("audio-tracks")
      .createSignedUrl(track.storage_path, 3600);
    if (error || !data) return null;
    setAudioUrls((prev) => ({ ...prev, [track.id]: data.signedUrl }));
    return data.signedUrl;
  }

  async function handlePlay(track: AudioTrack) {
    const url = await ensureUrl(track);
    if (!url) return;
    setPlayingId(track.id);
  }

  async function handleRate(track: AudioTrack, v: number) {
    if (!user) {
      alert("Please sign in to rate tracks. Visit /auth");
      return;
    }
    await rateTrack(track.id, v, user.id);
    setMyRatings((p) => ({ ...p, [track.id]: v }));
    const r = await fetchRatings();
    setRatings(r);
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:border-gold/40 transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h2 className="font-display font-bold text-lg md:text-2xl text-gold-gradient">
            Tune Library
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-10 w-10 grid place-items-center rounded-full glass"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="grid gap-3 md:grid-cols-[1fr_auto] mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tunes by name, description or category"
              className="w-full pl-11 pr-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition"
          >
            <option value="all">All categories</option>
            {AUDIO_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground py-16">Loading tunes…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            {tracks.length === 0
              ? "No tunes uploaded yet. Check back soon."
              : "No tunes match your search."}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => {
              const r = ratings[t.id];
              return (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl glass shadow-card flex flex-col gap-3 hover:border-gold/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-widest text-gold mb-1">
                        {categoryLabel(t.category)}
                      </div>
                      <h3 className="font-display font-semibold truncate">{t.title}</h3>
                    </div>
                    {t.is_paid ? (
                      <span
                        className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold"
                        title="Paid tune"
                      >
                        <DollarSign className="h-3 w-3" /> Paid
                      </span>
                    ) : (
                      <span className="shrink-0 px-2 py-1 rounded-full bg-neon/20 text-neon text-xs font-semibold">
                        Free
                      </span>
                    )}
                  </div>

                  {t.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                  )}

                  {/* Player */}
                  {playingId === t.id && audioUrls[t.id] && (
                    <audio src={audioUrls[t.id]} controls autoPlay className="w-full" />
                  )}

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                    <div className="flex flex-col gap-1">
                      <StarRating
                        value={myRatings[t.id] ?? Math.round(r?.avg ?? 0)}
                        onChange={(v) => handleRate(t, v)}
                        size={16}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {r ? `${r.avg.toFixed(1)} · ${r.count} rating${r.count > 1 ? "s" : ""}` : "No ratings yet"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => (playingId === t.id ? setPlayingId(null) : handlePlay(t))}
                        className="h-9 w-9 grid place-items-center rounded-full glass hover:border-gold/40 transition"
                        aria-label={playingId === t.id ? "Pause" : "Play sample"}
                      >
                        {playingId === t.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setCodeFor(t)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-primary-foreground text-xs font-semibold shadow-gold hover:scale-[1.02] transition"
                      >
                        <Download className="h-3.5 w-3.5" /> Get
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Get code modal */}
      {codeFor && (
        <div
          className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-md grid place-items-center p-4"
          onClick={() => setCodeFor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full p-6 rounded-2xl glass shadow-gold border border-gold/30"
          >
            <button
              onClick={() => setCodeFor(null)}
              aria-label="Close"
              className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full hover:bg-secondary/40 transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="text-[10px] uppercase tracking-widest text-gold mb-2">Skiza Code</div>
            <h3 className="font-display font-bold text-xl mb-1">{codeFor.title}</h3>
            <p className="text-xs text-muted-foreground mb-5">
              Dial the code below on your phone to get this tune.
            </p>
            <div className="p-4 rounded-xl bg-hero border border-gold/40 text-center">
              <div className="font-display text-3xl font-bold text-gold-gradient tracking-wider">
                {codeFor.skiza_code || "Contact us"}
              </div>
            </div>
            {codeFor.is_paid && (
              <p className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-gold" /> Standard network subscription rates apply.
              </p>
            )}
            <button
              onClick={() => setCodeFor(null)}
              className="mt-5 w-full py-3 rounded-xl glass hover:border-gold/40 transition font-semibold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
