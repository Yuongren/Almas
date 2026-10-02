import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioWave } from "@/components/AudioWave";
import { TunesLibrary } from "@/components/TunesLibrary";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Headphones, Sparkles, ArrowRight, Languages, ShieldCheck, Radio } from "lucide-react";
import { features, principles, glanceStats, capabilities } from "@/lib/siteContent";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Almas Skika Audio Branding Studio" },
      { name: "description", content: "Caller tunes, business greetings, IVR/PABX prompts, on-hold marketing, campaign audio and multilingual voice content for Kenyan organisations." },
      { property: "og:title", content: "Features — Almas Skika" },
      { property: "og:description", content: "Every audio product Almas Skika crafts, from caller tunes to corporate voice identity." },
      { property: "og:url", content: "/features" },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
  component: FeaturesPage,
});

const principleIcons = [Languages, ShieldCheck, Radio];

function FeaturesPage() {
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-hero overflow-hidden bg-grain">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="ambient-blob absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="ambient-blob absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-5">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Everything we craft
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight glow-text">
            Audio built for <br /><span className="text-shimmer">every phone moment.</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
            From the first ring to the last prompt — a complete voice toolkit for Kenyan organisations.
          </p>
          <div className="mt-8"><AudioWave bars={32} className="max-w-md mx-auto" /></div>
        </div>
      </section>

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

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="The full range"
            title="Eight ways to sound like your brand."
            description="Start with a caller tune or go straight to a full voice package — every product is scripted, voiced and produced in-house."
            action={
              <button
                type="button"
                onClick={() => setLibraryOpen(true)}
                className="btn-sheen inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-semibold text-primary-foreground shadow-gold transition hover:scale-[1.02]"
              >
                <Headphones className="h-4 w-4" /> Hear samples
              </button>
            }
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 60}>
                <div className="card-interactive group flex h-full flex-col p-6 rounded-2xl glass shadow-card">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gold-gradient grid place-items-center shadow-gold mb-4 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
                    <s.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg leading-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground flex-1">{s.desc}</p>
                  <div className="mt-4 pt-3 border-t border-border/50 text-[11px] uppercase tracking-wider text-gold font-semibold">
                    {s.tag}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="How it comes together"
            title="Four skills behind every project."
            description="Every product combines the same four capabilities, so quality stays consistent from a single tune to a full voice identity."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <div className="h-full p-6 rounded-2xl border border-border/60 bg-card/40 hover:border-gold/40 transition">
                  <div className="font-display text-4xl font-bold text-gold-gradient opacity-80">0{i + 1}</div>
                  <div className="mt-2 font-semibold">{c.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{c.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="Why Almas Skika"
            title={<>Local by design. <span className="text-gold-gradient">Careful by default.</span></>}
            description="What sets us apart from a generic upload service."
          />
          <ul className="grid md:grid-cols-3 gap-4">
            {principles.map((f, i) => {
              const Icon = principleIcons[i];
              return (
                <Reveal key={f.title} delay={i * 80}>
                  <li className="group h-full rounded-2xl glass p-6 transition-colors duration-300 hover:border-gold/25 list-none">
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl glass text-gold transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-semibold leading-tight">{f.title}</div>
                    <div className="mt-1 text-sm leading-6 text-muted-foreground">{f.desc}</div>
                  </li>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={200} className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/pricing" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass font-semibold hover:bg-secondary/50 transition">
              View pricing
            </Link>
            <Link to="/contact" className="btn-sheen inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition">
              Reach out to us <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
      {libraryOpen && <TunesLibrary onClose={() => setLibraryOpen(false)} />}
    </div>
  );
}
