import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AudioWave } from "@/components/AudioWave";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TunesLibrary } from "@/components/TunesLibrary";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { supabase } from "@/integrations/supabase/client";
import heroWaves from "@/assets/hero-waves.jpg";
import studioMic from "@/assets/studio-mic.jpg";
import {
  ArrowRight, Sparkles, Headphones, Play, Pause, BookOpen, Heart,
  Check, ShieldCheck, Languages, Radio,
} from "lucide-react";
import { fetchTracks, type AudioTrack } from "@/lib/audio";
import { fetchPosts, resolveImageUrl, type BlogPost } from "@/lib/blog";
import {
  glanceStats, products, capabilities, audiences, principles, contactInfo,
} from "@/lib/siteContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Almas Skika — Your Voice. Your Brand." },
      { name: "description", content: "We turn phone interactions into branded audio experiences. Caller tunes, business greetings, IVR/PABX prompts and multilingual voice content for Kenyan businesses." },
      { property: "og:title", content: "Almas Skika — Your Voice. Your Brand." },
      { property: "og:description", content: "Audio branding and telecom voice communication for businesses, churches and campaigns in Kenya." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const principleIcons = [Languages, ShieldCheck, Radio];

function Index() {
  const [libraryOpen, setLibraryOpen] = useState(false);

  // ---- Latest Tunes (live from the audio library) ----
  const [latestTracks, setLatestTracks] = useState<AudioTrack[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTracks()
      .then((data) => setLatestTracks(data.slice(0, 3)))
      .catch(() => setLatestTracks([]));
  }, []);

  async function handlePlayTrack(track: AudioTrack) {
    if (playingId === track.id) {
      setPlayingId(null);
      return;
    }

    let url = audioUrls[track.id];
    if (!url) {
      const { data, error } = await supabase.storage
        .from("audio-tracks")
        .createSignedUrl(track.storage_path, 3600);

      if (error || !data?.signedUrl) return;

      url = data.signedUrl;
      setAudioUrls((prev) => ({ ...prev, [track.id]: url! }));
    }

    setPlayingId(track.id);
  }

  // ---- From the Blog (live from published posts) ----
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchPosts()
      .then((data) => setLatestPosts(data.slice(0, 3)))
      .catch(() => setLatestPosts([]));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      {/* HERO */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 bg-hero overflow-hidden bg-grain">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <img
          src={heroWaves}
          alt=""
          width={1536} height={1536}
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
        />
        <div className="ambient-blob absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="ambient-blob absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-5 animate-[float_6s_ease-in-out_infinite]">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Audio branding & telecom voice solutions · Kenya
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight glow-text">
            Your Voice. <br />
            <span className="text-shimmer">Your Brand.</span>
          </h1>

          <p className="mt-5 text-lg md:text-xl font-display text-foreground/90">
            We turn phone interactions into branded audio experiences.
          </p>
          <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
            Caller tunes, business greetings, IVR/PABX prompts and multilingual voice content —
            scripted, voiced and produced for Kenyan businesses.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="btn-sheen group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
            >
              Reach out to us <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Link>
            <button
              onClick={() => setLibraryOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass font-semibold hover:bg-secondary/50 transition"
            >
              <Headphones className="h-4 w-4" /> Hear samples
            </button>
          </div>

          <div className="mt-10">
            <AudioWave bars={40} className="max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* AT A GLANCE */}
      <section className="border-y border-border/50 py-5 bg-card/30">
        <Reveal className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {glanceStats.map((s) => (
            <div key={s.v}>
              <div className="text-xl md:text-2xl font-display font-bold text-gold-gradient">{s.k}</div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* THE QUESTION */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">The question that matters</div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              What do your customers hear while they wait for you to answer?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Silence. A generic ring. Or a message that welcomes them, explains your service and
              sounds unmistakably like you. That waiting time is brand time — we make it count.
            </p>
            <Link
              to="/features"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all"
            >
              See what we make <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal delay={100} className="grid sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-border/60 bg-card/40">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Without a branded experience</div>
              <AudioWave bars={16} className="h-10 w-full opacity-30" />
              <p className="mt-4 text-sm text-muted-foreground">
                Silence or a generic ring-back. Callers wait, wonder and forget.
              </p>
            </div>
            <div className="p-6 rounded-2xl glass border-gold/40 shadow-gold">
              <div className="text-[11px] uppercase tracking-widest text-gold mb-3">With Almas Skika</div>
              <AudioWave bars={16} variant="gold" className="h-10 w-full" />
              <p className="mt-4 text-sm">
                A branded greeting, service message or promotion — in the language your customers speak.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-14 md:py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="What we craft"
            title="Start with a tune. Grow into a voice."
            description="A simple product ladder: begin with a caller tune, then add multilingual audio, business voice packages and IVR/PABX prompts as your needs grow."
            action={
              <Link to="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all">
                View pricing <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 70}>
                <div className="card-interactive group h-full p-6 rounded-2xl glass shadow-card flex flex-col">
                  <div className="h-11 w-11 rounded-xl bg-gold-gradient grid place-items-center shadow-gold mb-4 group-hover:scale-110 transition">
                    <p.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
                  <div className="mt-4 pt-4 border-t border-border/50 text-xs font-semibold uppercase tracking-wider text-gold">
                    {p.from}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Indicative launch prices — final quotes depend on voice talent, languages, revisions, music licensing and integration.
          </p>
        </div>
      </section>

      {/* HOW WE DO IT */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="How we do it"
            title={<>Four skills, <span className="text-gold-gradient">one accountable team.</span></>}
            description="We combine scripting, voice-over, production and delivery — so you deal with one studio instead of stitching together several suppliers."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <div className="relative h-full p-6 rounded-2xl border border-border/60 bg-card/40 hover:border-gold/40 transition">
                  <div className="font-display text-4xl font-bold text-gold-gradient opacity-80">0{i + 1}</div>
                  <c.icon className="h-5 w-5 text-gold mt-3" />
                  <div className="mt-2 font-semibold">{c.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{c.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY — positioning */}
      <section className="py-14 md:py-20 bg-mesh relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-neon/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <Reveal className="relative">
            <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
            <img
              src={studioMic}
              alt="Studio microphone"
              width={1024} height={1024}
              loading="lazy"
              className="relative rounded-3xl shadow-card border border-border/60 w-full max-h-[440px] object-cover"
            />
            <div className="absolute -bottom-5 -right-3 glass rounded-2xl p-4 shadow-gold animate-[float_6s_ease-in-out_infinite]">
              <AudioWave bars={14} variant="gold" className="h-12 w-32" />
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 text-center">Now recording</div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Why Almas Skika</div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Between a creative agency <br />
              <span className="text-gold-gradient">and a telecom provider.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              We own the message, the voice, the language and the sound — and partner for technical
              activation, so your brand stays in one pair of hands.
            </p>

            <ul className="mt-6 space-y-4">
              {principles.map((f, i) => {
                const Icon = principleIcons[i];
                return (
                  <li key={f.title} className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl glass grid place-items-center text-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{f.title}</div>
                      <div className="text-sm text-muted-foreground">{f.desc}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* LATEST TUNES — live from the audio library */}
      {latestTracks.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader
              eyebrow="Fresh off the mix"
              title="Latest tunes."
              description="Press play and hear the difference a branded sound makes."
              action={
                <button
                  onClick={() => setLibraryOpen(true)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all"
                >
                  Browse full library <ArrowRight className="h-4 w-4" />
                </button>
              }
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestTracks.map((track, i) => (
                <Reveal key={track.id} delay={i * 70}>
                  <div className="card-interactive p-6 rounded-2xl glass shadow-card h-full flex flex-col">
                    <div className="text-[10px] uppercase tracking-widest text-gold mb-2">
                      {track.category.replace(/_/g, " ")}
                    </div>
                    <h3 className="font-display font-semibold text-base flex-1">{track.title}</h3>
                    {track.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{track.description}</p>
                    )}

                    {playingId === track.id && audioUrls[track.id] && (
                      <audio
                        src={audioUrls[track.id]}
                        controls
                        autoPlay
                        preload="metadata"
                        className="w-full mt-4"
                        onEnded={() => setPlayingId(null)}
                        onError={() => setPlayingId(null)}
                      />
                    )}

                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full glass hover:border-gold/40 transition text-sm font-semibold w-fit"
                    >
                      {playingId === track.id ? (
                        <><Pause className="h-3.5 w-3.5" /> Pause</>
                      ) : (
                        <><Play className="h-3.5 w-3.5" /> Play sample</>
                      )}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHO WE SERVE */}
      <section className="py-14 md:py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            center
            eyebrow="Who we serve"
            title="Built for phone-dependent organisations."
            description="If your customers, members or congregation call you, your phone experience is part of your brand."
          />
          <Reveal delay={100} className="flex flex-wrap justify-center gap-3">
            {audiences.map((a) => (
              <span key={a} className="px-5 py-2.5 rounded-full glass text-sm font-medium hover:border-gold/40 hover:text-gold transition cursor-default">
                <Check className="inline h-3.5 w-3.5 mr-2 text-gold" />{a}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* FROM THE BLOG — live from published posts */}
      {latestPosts.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeader
              eyebrow="From the blog"
              title="Stories & updates."
              description="News from the studio and voices from our community."
              action={
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all">
                  Visit the blog <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestPosts.map((post, i) => {
                const image = resolveImageUrl(post.featured_image_path);
                return (
                  <Reveal key={post.id} delay={i * 70}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="card-interactive group block rounded-2xl glass overflow-hidden h-full"
                    >
                      <div className="h-36 bg-hero overflow-hidden">
                        {image ? (
                          <img src={image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <BookOpen className="h-8 w-8 opacity-40" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        {post.blog_categories && (
                          <span className="text-[10px] uppercase tracking-widest text-gold">{post.blog_categories.name}</span>
                        )}
                        <h3 className="font-display font-semibold text-base mt-1 line-clamp-2">{post.title}</h3>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                          <span>{post.author_name}</span>
                          <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.like_count}</span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CLOSING CTA — buttons instead of a form */}
      <section className="py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="ambient-blob absolute -top-24 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-gold/10 blur-3xl" />
        <Reveal className="relative max-w-3xl mx-auto px-4 text-center">
          <AudioWave bars={28} className="max-w-xs mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to make your brand <span className="text-gold-gradient">heard?</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Learn more about who we are, or tell us about your project and let's help you hear your brand.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass font-semibold hover:bg-secondary/50 transition"
            >
              Get to know more about us
            </Link>
            <Link
              to="/contact"
              className="btn-sheen group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
            >
              Reach out to us <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href={contactInfo.phoneHref} className="hover:text-gold transition">{contactInfo.phone}</a>
            <a href={`mailto:${contactInfo.email}`} className="hover:text-gold transition">{contactInfo.email}</a>
            <span>{contactInfo.location}</span>
          </div>
        </Reveal>
      </section>

      <Footer />

      {libraryOpen && <TunesLibrary onClose={() => setLibraryOpen(false)} />}
    </div>
  );
}
