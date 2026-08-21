import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-Dnm9rgfp.mjs";
import { f as fetchTracks, a as fetchRatings, b as fetchMyRatings, c as categoryLabel, r as rateTrack } from "./audio-BjlvbQrT.mjs";
import { u as useAuth } from "./useAuth-PyDB7P0L.mjs";
import { s as submitDemoRequest } from "./example.functions-DzSdFh8R.mjs";
import { e as ArrowLeft, X, D as DollarSign, P as Pause, f as Play, g as Download, h as Star, i as StarHalf } from "../_libs/lucide-react.mjs";
function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 18
}) {
  const [hover, setHover] = reactExports.useState(0);
  const shown = hover || value;
  function getPointerValue(e, n) {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientX - rect.left < rect.width / 2 ? n - 0.5 : n;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex gap-0.5", "aria-label": `Rating ${shown} of 5`, children: [1, 2, 3, 4, 5].map((n) => {
    const isFull = shown >= n;
    const isHalf = !isFull && shown >= n - 0.5;
    const Icon = isFull ? Star : isHalf ? StarHalf : Star;
    const iconClass = isFull ? "fill-gold text-gold" : isHalf ? "text-gold" : "text-muted-foreground/40";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        disabled: readOnly,
        onMouseMove: (e) => !readOnly && setHover(getPointerValue(e, n)),
        onMouseLeave: () => !readOnly && setHover(0),
        onClick: (e) => !readOnly && onChange?.(getPointerValue(e, n)),
        className: readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition",
        "aria-label": `Rate ${n - 0.5} or ${n} stars`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { style: { width: size, height: size }, className: iconClass })
      },
      n
    );
  }) });
}
function TunesLibrary({ onClose }) {
  const { user } = useAuth();
  const [tracks, setTracks] = reactExports.useState([]);
  const [ratings, setRatings] = reactExports.useState({});
  const [myRatings, setMyRatings] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [codeFor, setCodeFor] = reactExports.useState(null);
  const [demoFor, setDemoFor] = reactExports.useState(null);
  const [demoContact, setDemoContact] = reactExports.useState("");
  const [demoStatus, setDemoStatus] = reactExports.useState(null);
  const [demoBusy, setDemoBusy] = reactExports.useState(false);
  const [playingId, setPlayingId] = reactExports.useState(null);
  const [audioUrls, setAudioUrls] = reactExports.useState({});
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
    if (user) fetchMyRatings(user.id).then(setMyRatings);
    else setMyRatings({});
  }, [user]);
  const samples = reactExports.useMemo(() => {
    return [...tracks].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  }, [tracks]);
  async function ensureUrl(track) {
    console.log("========== AUDIO PLAYBACK DEBUG ==========");
    console.log("Track:", track.title);
    console.log("Track ID:", track.id);
    console.log("Storage path:", track.storage_path);
    const { data, error } = await supabase.storage.from("audio-tracks").createSignedUrl(track.storage_path, 3600);
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
      [track.id]: data.signedUrl
    }));
    return data.signedUrl;
  }
  async function handlePlay(track) {
    console.log("Attempting to play:", track.title);
    const url = await ensureUrl(track);
    if (!url) {
      console.error("Cannot play audio because no URL was generated.");
      return;
    }
    setPlayingId(track.id);
  }
  async function handleRate(track, v) {
    if (!user) {
      alert("Please sign in to rate tracks. Visit /auth");
      return;
    }
    await rateTrack(track.id, v, user.id);
    setMyRatings((p) => ({ ...p, [track.id]: v }));
    const r = await fetchRatings();
    setRatings(r);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: onClose,
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:border-gold/40 transition text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
              " Back"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg md:text-2xl text-gold-gradient", children: "Hear Samples" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            "aria-label": "Close",
            className: "h-10 w-10 grid place-items-center rounded-full glass",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-muted-foreground", children: "Browse every uploaded sample in one place. New uploads appear here automatically." }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-16", children: "Loading samples…" }) : samples.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-16", children: "No samples uploaded yet. Check back soon." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: samples.map((t) => {
        const r = ratings[t.id];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-5 rounded-2xl glass shadow-card flex flex-col gap-3 hover:border-gold/40 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-gold mb-1", children: categoryLabel(t.category) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold truncate", children: t.title })
                ] }),
                t.is_paid ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold",
                    title: "Paid tune",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3 w-3" }),
                      " Paid"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 px-2 py-1 rounded-full bg-neon/20 text-neon text-xs font-semibold", children: "Free" })
              ] }),
              t.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: t.description }),
              playingId === t.id && audioUrls[t.id] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "audio",
                {
                  src: audioUrls[t.id],
                  controls: true,
                  autoPlay: true,
                  preload: "metadata",
                  className: "w-full",
                  onLoadStart: () => {
                    console.log(
                      "Audio loading started:",
                      t.title
                    );
                  },
                  onCanPlay: () => {
                    console.log(
                      "Audio can play:",
                      t.title
                    );
                  },
                  onPlay: () => {
                    console.log(
                      "Audio playback started:",
                      t.title
                    );
                  },
                  onPause: () => {
                    console.log(
                      "Audio paused:",
                      t.title
                    );
                  },
                  onEnded: () => {
                    console.log(
                      "Audio finished:",
                      t.title
                    );
                    setPlayingId(null);
                  },
                  onError: (event) => {
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
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-border/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StarRating,
                    {
                      value: myRatings[t.id] ?? Math.round(r?.avg ?? 0),
                      onChange: (v) => handleRate(t, v),
                      size: 16
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: r ? `${r.avg.toFixed(1)} · ${r.count} rating${r.count > 1 ? "s" : ""}` : "No ratings yet" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => playingId === t.id ? setPlayingId(null) : handlePlay(t),
                      className: "h-9 w-9 grid place-items-center rounded-full glass hover:border-gold/40 transition",
                      "aria-label": playingId === t.id ? "Pause" : "Play sample",
                      children: playingId === t.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => setCodeFor(t),
                      className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-primary-foreground text-xs font-semibold shadow-gold hover:scale-[1.02] transition",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                        " Get"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        setDemoFor(t);
                        setDemoContact("");
                        setDemoStatus(null);
                      },
                      className: "inline-flex items-center justify-center px-4 py-2 rounded-full glass text-xs font-semibold hover:border-gold/40 transition",
                      children: "Request demo"
                    }
                  )
                ] })
              ] })
            ]
          },
          t.id
        );
      }) })
    ] }),
    codeFor && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-[70] bg-background/80 backdrop-blur-md grid place-items-center p-4",
        onClick: () => setCodeFor(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => e.stopPropagation(),
            className: "relative max-w-sm w-full p-6 rounded-2xl glass shadow-gold border border-gold/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setCodeFor(null),
                  "aria-label": "Close",
                  className: "absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full hover:bg-secondary/40 transition",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-gold mb-2", children: "Skiza Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl mb-1", children: codeFor.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-5", children: "Dial the code below on your phone to get this tune." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-xl bg-hero border border-gold/40 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-bold text-gold-gradient tracking-wider", children: codeFor.skiza_code || "Contact us" }) }),
              codeFor.is_paid && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-muted-foreground inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3 w-3 text-gold" }),
                " Standard network subscription rates apply."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setCodeFor(null),
                  className: "mt-5 w-full py-3 rounded-xl glass hover:border-gold/40 transition font-semibold text-sm",
                  children: "Close"
                }
              )
            ]
          }
        )
      }
    ),
    demoFor && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-[70] bg-background/80 backdrop-blur-md grid place-items-center p-4",
        onClick: () => setDemoFor(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => e.stopPropagation(),
            className: "relative max-w-sm w-full p-6 rounded-2xl glass shadow-gold border border-gold/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setDemoFor(null),
                  "aria-label": "Close",
                  className: "absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full hover:bg-secondary/40 transition",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-gold mb-2", children: "Request Demo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl mb-1", children: demoFor.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Tell us the best way to reach you and our team will follow up with a demo for this audio." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "form",
                {
                  onSubmit: (e) => {
                    e.preventDefault();
                    if (!demoContact.trim()) {
                      setDemoStatus("Please enter your contact details.");
                      return;
                    }
                    setDemoBusy(true);
                    submitDemoRequest({
                      name: "Audio library demo request",
                      contact: demoContact,
                      request: `Demo requested for ${demoFor.title}.`
                    }).then(() => {
                      setDemoStatus(`Thanks! We'll reach out to ${demoContact} shortly.`);
                      setDemoContact("");
                    }).catch(() => setDemoStatus("Unable to submit your request.")).finally(() => setDemoBusy(false));
                  },
                  className: "space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm text-muted-foreground", children: [
                      "Contact email or phone",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          value: demoContact,
                          onChange: (e) => setDemoContact(e.target.value),
                          placeholder: "you@example.com or +254700000000",
                          className: "mt-2 w-full px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
                        }
                      )
                    ] }),
                    demoStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gold", children: demoStatus }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "submit",
                        disabled: demoBusy,
                        className: "w-full py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition",
                        children: demoBusy ? "Sending…" : "Send request"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setDemoFor(null),
                  className: "mt-4 w-full py-3 rounded-xl glass hover:border-gold/40 transition font-semibold text-sm",
                  children: "Close"
                }
              )
            ]
          }
        )
      }
    )
  ] });
}
export {
  TunesLibrary as T
};
