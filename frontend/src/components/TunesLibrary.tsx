import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, X, Play, Pause, Download, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
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
  const [loading, setLoading] = useState(true);
  const [codeFor, setCodeFor] = useState<AudioTrack | null>(null);
  const [demoFor, setDemoFor] = useState<AudioTrack | null>(null);
  const [demoContact, setDemoContact] = useState("");
  const [demoStatus, setDemoStatus] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const tracksData = await fetchTracks();

        console.log("Fetched audio tracks:", tracksData);

        setTracks(tracksData);

        try {
          const ratingsData = await fetchRatings();

          console.log("Fetched ratings:", ratingsData);

          setRatings(ratingsData);
        } catch (ratingError) {
          console.warn("Ratings unavailable:", ratingError);
          setRatings({});
        }
      } catch (error) {
        console.error("Failed to load audio tracks:", error);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (user) fetchMyRatings(user.id).then(setMyRatings);
    else setMyRatings({});
  }, [user]);

  const samples = useMemo(() => {
    return [...tracks].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  }, [tracks]);

  async function ensureUrl(track: AudioTrack) {
    console.log("========== AUDIO PLAYBACK DEBUG ==========");
    console.log("Track:", track.title);
    console.log("Track ID:", track.id);
    console.log("Storage path:", track.storage_path);

    const { data, error } = await supabase.storage
      .from("audio-tracks")
      .createSignedUrl(track.storage_path, 3600);

    console.log("Signed URL response:", data);
    console.log("Signed URL error:", error);

    if (error || !data?.signedUrl) {
      console.error(
        "Unable to generate signed audio URL:",
        error?.message
      );

      return null;
    }

    console.log("Signed URL generated successfully");

    setAudioUrls((prev) => ({
      ...prev,
      [track.id]: data.signedUrl,
    }));

    return data.signedUrl;
  }

  async function handlePlay(track: AudioTrack) {
    console.log("Attempting to play:", track.title);

    const url = await ensureUrl(track);

    if (!url) {
      console.error("Cannot play audio because no URL was generated.");
      return;
    }

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
            Hear Samples
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-10 w-10 grid place-items-center rounded-full glass"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-muted-foreground">
          Browse every uploaded sample in one place. New uploads appear here automatically.
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground py-16">Loading samples…</p>
        ) : samples.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            No samples uploaded yet. Check back soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {samples.map((t) => {
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
                    <audio
                      src={audioUrls[t.id]}
                      controls
                      autoPlay
                      preload="metadata"
                      className="w-full"
                      onLoadStart={() => {
                        console.log(
                          "Audio loading started:",
                          t.title
                        );
                      }}
                      onCanPlay={() => {
                        console.log(
                          "Audio can play:",
                          t.title
                        );
                      }}
                      onPlay={() => {
                        console.log(
                          "Audio playback started:",
                          t.title
                        );
                      }}
                      onPause={() => {
                        console.log(
                          "Audio paused:",
                          t.title
                        );
                      }}
                      onEnded={() => {
                        console.log(
                          "Audio finished:",
                          t.title
                        );

                        setPlayingId(null);
                      }}
                      onError={(event) => {
                        const audio = event.currentTarget;

                        console.error(
                          "========== AUDIO PLAYBACK ERROR =========="
                        );
                        console.error("Track:", t.title);
                        console.error("URL:", audio.src);
                        console.error("Audio error:", audio.error);
                        console.error(
                          "Error code:",
                          audio.error?.code
                        );
                        console.error(
                          "Error message:",
                          audio.error?.message
                        );
                        console.error(
                          "==========================================="
                        );

                        setPlayingId(null);
                      }}
                    />
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
                    <div className="flex flex-wrap items-center gap-2">
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
                      <button
                        onClick={() => {
                          setDemoFor(t);
                          setDemoContact("");
                          setDemoStatus(null);
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full glass text-xs font-semibold hover:border-gold/40 transition"
                      >
                        Request demo
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

      {demoFor && (
        <div
          className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-md grid place-items-center p-4"
          onClick={() => setDemoFor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full p-6 rounded-2xl glass shadow-gold border border-gold/30"
          >
            <button
              onClick={() => setDemoFor(null)}
              aria-label="Close"
              className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full hover:bg-secondary/40 transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="text-[10px] uppercase tracking-widest text-gold mb-2">Request Demo</div>
            <h3 className="font-display font-bold text-xl mb-1">{demoFor.title}</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Tell us the best way to reach you and our team will follow up with a demo for this audio.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!demoContact.trim()) {
                  setDemoStatus("Please enter your contact details.");
                  return;
                }
                setDemoStatus(`Thanks! We'll reach out to ${demoContact} shortly.`);
                setDemoContact("");
              }}
              className="space-y-4"
            >
              <label className="block text-sm text-muted-foreground">
                Contact email or phone
                <input
                  value={demoContact}
                  onChange={(e) => setDemoContact(e.target.value)}
                  placeholder="you@example.com or +254700000000"
                  className="mt-2 w-full px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
                />
              </label>
              {demoStatus && <p className="text-sm text-gold">{demoStatus}</p>}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
              >
                Send request
              </button>
            </form>
            <button
              onClick={() => setDemoFor(null)}
              className="mt-4 w-full py-3 rounded-xl glass hover:border-gold/40 transition font-semibold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
