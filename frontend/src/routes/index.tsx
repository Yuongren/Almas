import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AudioWave } from "@/components/AudioWave";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TunesLibrary } from "@/components/TunesLibrary";
import { Reveal } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import heroWaves from "@/assets/hero-waves.jpg";
import studioMic from "@/assets/studio-mic.jpg";
import {
  Church, Languages, Megaphone, ArrowRight, Sparkles,
  ShieldCheck, Zap, Globe2, Check, Headphones, Play, Pause,
  BookOpen, Heart,
} from "lucide-react";
import { submitDemoRequest } from "@/lib/api/example.functions";
import { fetchTracks, type AudioTrack } from "@/lib/audio";
import { fetchPosts, resolveImageUrl, type BlogPost } from "@/lib/blog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Almas Skika — Premium Telecom Audio Branding in Kenya" },
      { name: "description", content: "Caller tunes, business greetings, voice overs and audio branding for Kenyan businesses, churches and campaigns. Crafted in studio. Delivered to every call." },
      { property: "og:title", content: "Almas Skika — The Sound of Kenya" },
      { property: "og:description", content: "Voice communication & telecom audio branding for brands, churches and campaigns across Kenya." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const services = [
  { icon: Megaphone, title: "Campaign Tunes", desc: "Political caller tunes that mobilise voters across counties.", featured: true },
  { icon: Church, title: "Church Audio", desc: "Sermons, jingles and worship audio mastered for clarity." },
  { icon: Languages, title: "Native Languages", desc: "Swahili, Kikuyu, Luo, Kalenjin, Luhya — voices that feel home." },
];

const audience = ["Businesses", "Churches", "Political Aspirants", "SMEs", "Schools", "Corporates", "Campaign Teams", "NGOs"];

const steps = [
  { n: "01", t: "Brief", d: "We listen — to your brand, audience and tone of voice." },
  { n: "02", t: "Script & Cast", d: "Words that move. Voices that match your identity." },
  { n: "03", t: "Studio", d: "Recorded, layered and mastered by senior audio engineers." },
  { n: "04", t: "Deploy", d: "Pushed live across Safaricom, Airtel and Telkom networks." },
];

function Index() {
  const [demoForm, setDemoForm] = useState({ name: "", contact: "", request: "" });
  const [demoStatus, setDemoStatus] = useState<string | null>(null);
  const [demoBusy, setDemoBusy] = useState(false);

  async function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDemoBusy(true);
    setDemoStatus(null);
    try {
      await submitDemoRequest(demoForm);
      setDemoForm({ name: "", contact: "", request: "" });
      setDemoStatus("Thanks. We'll be in touch within 24 hours.");
    } catch {
      setDemoStatus("Unable to submit your request.");
    } finally {
      setDemoBusy(false);
    }
  }

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
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-hero overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <img
          src={heroWaves}
          alt=""
          width={1536} height={1536}
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
        />
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6 animate-[float_6s_ease-in-out_infinite]">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Kenya's premier telecom audio studio
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight glow-text">
            The Sound <br className="sm:hidden" />
            <span className="text-gold-gradient">Your Brand</span> <br />
            Deserves.
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-muted-foreground">
            Caller tunes, voice overs and telecom audio branding — engineered in Nairobi, delivered to every phone in Kenya.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#contact" className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition text-base">
              Request a Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </a>
            <Link to="/features" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass font-semibold hover:bg-secondary/50 transition">
              Hear our work
            </Link>
          </div>

          <div className="mt-14">
            <AudioWave bars={40} className="max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-border/50 py-6 bg-card/30">
        <Reveal className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { k: "500+", v: "Brands voiced" },
            { k: "3", v: "Major networks" },
            { k: "12+", v: "Local languages" },
            { k: "24h", v: "Turnaround" },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-2xl md:text-3xl font-display font-bold text-gold-gradient">{s.k}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">What we craft</div>
            <h2 className="text-3xl md:text-5xl font-bold">Audio that does the talking.</h2>
            <p className="mt-4 text-muted-foreground">Every product is mixed, mastered and ready for telecom deployment from day one.</p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className={s.featured ? "sm:col-span-2" : ""}>
                <div
                  className={[
                    "group relative p-6 rounded-2xl glass shadow-card hover:-translate-y-1 transition-all duration-300 hover:shadow-gold h-full",
                    s.featured ? "border-gold/40 bg-gold/5" : "",
                  ].join(" ")}
                >
                  {s.featured && (
                    <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider text-gold">In the spotlight</span>
                  )}
                  <div className="h-11 w-11 rounded-xl bg-gold-gradient grid place-items-center shadow-gold mb-5 group-hover:scale-110 transition">
                    <s.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">{s.desc}</p>
                  <div className="mt-5 h-px bg-gradient-to-r from-gold/40 via-neon/30 to-transparent" />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setLibraryOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
            >
              <Headphones className="h-4 w-4" /> Hear samples
            </button>
            <Link to="/features" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full glass font-semibold hover:bg-secondary/50 transition">
              Explore all features <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* LATEST TUNES — live from the audio library */}
      {latestTracks.length > 0 && (
        <section className="py-20 md:py-28 bg-card/30 relative">
          <div className="max-w-6xl mx-auto px-4">
            <Reveal className="flex items-end justify-between gap-4 flex-wrap mb-10">
              <div className="max-w-2xl">
                <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Fresh off the mix</div>
                <h2 className="text-3xl md:text-5xl font-bold">Latest tunes.</h2>
              </div>
              <button
                onClick={() => setLibraryOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all"
              >
                Browse full library <ArrowRight className="h-4 w-4" />
              </button>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestTracks.map((track, i) => (
                <Reveal key={track.id} delay={i * 80}>
                  <div className="p-6 rounded-2xl glass shadow-card hover:border-gold/40 transition h-full flex flex-col">
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

      {/* FEATURE / WHY */}
      <section className="py-20 md:py-28 bg-mesh relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-neon/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <Reveal className="relative">
            <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
            <img
              src={studioMic}
              alt="Studio microphone"
              width={1024} height={1024}
              loading="lazy"
              className="relative rounded-3xl shadow-card border border-border/60"
            />
            <div className="absolute -bottom-6 -right-4 glass rounded-2xl p-4 shadow-gold animate-[float_6s_ease-in-out_infinite]">
              <AudioWave bars={14} variant="gold" className="h-12 w-32" />
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 text-center">Now recording</div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Why Almas Skika</div>
            <h2 className="text-3xl md:text-5xl font-bold">Built in Kenya. <br /><span className="text-gold-gradient">Heard everywhere.</span></h2>
            <p className="mt-4 text-muted-foreground">We combine broadcast-grade engineering with deep cultural fluency — so your sound lands the moment a call connects.</p>

            <ul className="mt-8 space-y-4">
              {[
                { i: ShieldCheck, t: "Telecom-certified delivery", d: "Pre-approved formats for Safaricom Skiza, Airtel Hello Tunes & Telkom." },
                { i: Zap, t: "24-hour turnaround", d: "Fast-track packages for campaigns and product launches." },
                { i: Globe2, t: "12+ native languages", d: "Voice talent fluent in every major Kenyan language." },
              ].map((f) => (
                <li key={f.t} className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl glass grid place-items-center text-gold">
                    <f.i className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{f.t}</div>
                    <div className="text-sm text-muted-foreground">{f.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Client reviews</div>
            <h2 className="text-3xl md:text-5xl font-bold">Trusted by the voices <span className="text-gold-gradient">of Kenya.</span></h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { q: "Almas Skika built our Skiza tune in 48 hours. Call volumes lifted instantly.", n: "Wanjiku Mwangi", r: "Marketing Lead", c: "Jambo Africa", l: "JA" },
              { q: "Their Swahili voice talent is unmatched. Our IVR finally sounds like us.", n: "David Otieno", r: "CTO", c: "Pesa Plus", l: "P+" },
              { q: "Mastered, mixed and deployed across all three networks. Truly premium work.", n: "Grace Kamau", r: "Campaign Director", c: "Kenya Forward", l: "KF" },
            ].map((t, i) => (
              <Reveal key={t.n} delay={i * 80}>
                <figure className="p-7 rounded-2xl glass shadow-card hover:border-gold/40 transition flex flex-col h-full">
                  <div className="flex gap-1 text-gold mb-4" aria-label="5 star rating">
                    {Array.from({ length: 5 }).map((_, i) => (<span key={i}>★</span>))}
                  </div>
                  <blockquote className="text-sm md:text-base leading-relaxed flex-1">"{t.q}"</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-border/50">
                    <div className="h-11 w-11 rounded-xl bg-gold-gradient grid place-items-center font-display font-bold text-primary-foreground text-sm shrink-0" aria-hidden>{t.l}</div>
                    <div>
                      <div className="font-semibold text-sm">{t.n}</div>
                      <div className="text-xs text-muted-foreground">{t.r} · {t.c}</div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FROM THE BLOG — live from published posts */}
      {latestPosts.length > 0 && (
        <section className="py-20 md:py-28 bg-card/30 relative">
          <div className="max-w-6xl mx-auto px-4">
            <Reveal className="flex items-end justify-between gap-4 flex-wrap mb-10">
              <div className="max-w-2xl">
                <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">From the blog</div>
                <h2 className="text-3xl md:text-5xl font-bold">Stories & updates.</h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all"
              >
                Visit the blog <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestPosts.map((post, i) => {
                const image = resolveImageUrl(post.featured_image_path);
                return (
                  <Reveal key={post.id} delay={i * 80}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="group block rounded-2xl glass overflow-hidden hover:border-gold/40 transition h-full"
                    >
                      <div className="h-36 bg-hero overflow-hidden">
                        {image ? (
                          <img
                            src={image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <BookOpen className="h-8 w-8 opacity-40" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        {post.blog_categories && (
                          <span className="text-[10px] uppercase tracking-widest text-gold">
                            {post.blog_categories.name}
                          </span>
                        )}
                        <h3 className="font-display font-semibold text-base mt-1 line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                          <span>{post.author_name}</span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {post.like_count}
                          </span>
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

      {/* PROCESS */}
      <section id="process" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Process</div>
            <h2 className="text-3xl md:text-5xl font-bold">From brief to broadcast in days.</h2>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="relative p-6 rounded-2xl border border-border/60 bg-card/40 hover:border-gold/40 transition h-full">
                  <div className="font-display text-5xl font-bold text-gold-gradient opacity-80">{s.n}</div>
                  <div className="mt-3 font-semibold">{s.t}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section id="audience" className="py-20 md:py-28 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Who we serve</div>
            <h2 className="text-3xl md:text-5xl font-bold">Sound for every Kenyan organisation.</h2>
          </Reveal>
          <Reveal delay={120} className="mt-10 flex flex-wrap justify-center gap-3">
            {audience.map((a) => (
              <span key={a} className="px-5 py-2.5 rounded-full glass text-sm font-medium hover:border-gold/40 hover:text-gold transition cursor-default">
                <Check className="inline h-3.5 w-3.5 mr-2 text-gold" />{a}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <Reveal className="relative max-w-3xl mx-auto px-4 text-center">
          <AudioWave bars={28} className="max-w-xs mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-bold">Let's make your brand <span className="text-gold-gradient">heard.</span></h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Tell us about your project. We'll send back a custom audio sample within 48 hours — no obligation.</p>

          <form className="mt-10 grid gap-4 max-w-md mx-auto text-left" onSubmit={handleDemoSubmit}>
            <div className="grid gap-1.5">
              <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
              <input id="name" name="name" required maxLength={100} value={demoForm.name} onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })} className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground" placeholder="Your full name" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input id="email" name="email" type="email" required maxLength={255} value={demoForm.contact} onChange={(e) => setDemoForm({ ...demoForm, contact: e.target.value })} className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground" placeholder="you@company.com" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea id="message" name="message" rows={4} required maxLength={1000} value={demoForm.request} onChange={(e) => setDemoForm({ ...demoForm, request: e.target.value })} className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground resize-none" placeholder="What kind of audio do you need?" />
            </div>
            {demoStatus && <p className="text-sm text-gold" role="status">{demoStatus}</p>}
            <button type="submit" disabled={demoBusy} className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.01] transition disabled:opacity-50">
              {demoBusy ? "Sending…" : "Request a Demo"} {!demoBusy && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6 text-sm text-muted-foreground">
            <a href="tel:+254707002424" className="hover:text-gold transition">+254 707 002 424</a>
            <a href="mailto:hello@almasskika.co.ke" className="hover:text-gold transition">hello@almasskika.co.ke</a>
            <span>Nairobi, Kenya</span>
          </div>
        </Reveal>
      </section>

      <Footer />

      {libraryOpen && <TunesLibrary onClose={() => setLibraryOpen(false)} />}
    </div>
  );
}
