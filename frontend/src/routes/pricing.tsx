import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Accordion } from "@/components/Accordion";
import { Check, ArrowRight, Sparkles, Info } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Almas Skika Audio Branding" },
      { name: "description", content: "Indicative launch pricing for caller tunes, business voice packages, IVR/PABX prompts, corporate voice identity and campaign audio." },
      { property: "og:title", content: "Pricing — Almas Skika" },
      { property: "og:description", content: "Start with a caller tune from KSh 2,500 and grow into a full voice package." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Caller Tune",
    price: "From KSh 2,500",
    blurb: "The low-friction way to start.",
    features: [
      "Basic Caller Tune — KSh 2,500",
      "Premium Caller Tune — KSh 5,000",
      "Multilingual Caller Tune — KSh 7,500+",
      "Scripting, voice-over and production",
    ],
    cta: "Ask about caller tunes",
  },
  {
    name: "Business Voice Package",
    price: "KSh 10,000–25,000",
    blurb: "A fuller brand experience for every call.",
    features: [
      "Welcome and service-explanation messages",
      "On-hold marketing",
      "After-hours and holiday greetings",
      "Voice and language matched to your brand",
    ],
    cta: "Ask about voice packages",
    featured: true,
  },
  {
    name: "IVR / PABX Voice",
    price: "KSh 15,000–40,000+",
    blurb: "Clear prompts for structured call handling.",
    features: [
      "Menu and call-routing prompts",
      "Multiple voices or languages as needed",
      "Consistent tone across every prompt",
      "Integration through licensed technical partners",
    ],
    cta: "Ask about IVR / PABX",
  },
];

const wide = [
  {
    name: "Corporate Voice Identity",
    price: "From KSh 30,000",
    blurb: "One consistent voice across calls, prompts and messages — our premium, ongoing relationship for growing brands.",
  },
  {
    name: "Campaign Audio",
    price: "KSh 10,000–50,000+",
    blurb: "Candidate caller tunes and multilingual campaign audio, using client-approved messages and claims.",
  },
];

const faqs = [
  {
    q: "What affects the final price?",
    a: "Prices shown are indicative launch prices. The final quote depends on voice talent, the number of languages, revisions, music licensing and any integration requirements.",
  },
  {
    q: "Who owns the rights to my audio?",
    a: "We use original or properly licensed music, written voice-artist agreements, client content approvals and clear rights and usage terms, so your audio is documented and safe to use.",
  },
  {
    q: "Can you set it up on my phone line or network?",
    a: "We produce the audio. Where telecom-side activation or infrastructure is required, we work through appropriate licensed technical partners.",
  },
  {
    q: "Can I start with just a caller tune?",
    a: "Yes — it's our entry product. You can add multilingual audio, business voice packages or IVR/PABX prompts as your needs grow.",
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-hero overflow-hidden bg-grain">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="ambient-blob absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="ambient-blob absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-5">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Simple, transparent pricing
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight glow-text">
            Start small. <span className="text-shimmer">Grow your sound.</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
            Begin with a caller tune from KSh 2,500 and add multilingual audio, voice packages and IVR/PABX prompts as you grow.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-5">
            {tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <div
                  className={`relative p-7 rounded-3xl glass shadow-card flex flex-col h-full ${
                    t.featured ? "border-gold/50 shadow-gold md:scale-[1.02]" : ""
                  }`}
                >
                  {t.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gold-gradient text-primary-foreground shadow-gold">
                      Most popular
                    </span>
                  )}
                  <div className="text-xs uppercase tracking-[0.3em] text-gold">{t.name}</div>
                  <div className="mt-3">
                    <span className="font-display text-3xl font-bold text-gold-gradient">{t.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
                  <ul className="mt-5 space-y-3 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-3 text-sm">
                        <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className={`mt-7 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold transition ${
                      t.featured
                        ? "btn-sheen bg-gold-gradient text-primary-foreground shadow-gold hover:scale-[1.01]"
                        : "glass hover:bg-secondary/50"
                    }`}
                  >
                    {t.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-5">
            {wide.map((w, i) => (
              <Reveal key={w.name} delay={i * 90}>
                <div className="card-interactive h-full p-6 rounded-2xl glass shadow-card flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-gold">{w.name}</div>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md">{w.blurb}</p>
                  </div>
                  <div className="font-display text-2xl font-bold text-gold-gradient shrink-0">{w.price}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150} className="mt-6 flex items-start gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
            <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <p>
              Prices are indicative launch prices and are adjusted for voice talent, number of languages,
              revisions, music licensing and integration requirements.{" "}
              <Link to="/contact" className="text-gold hover:underline">Reach out for an exact quote →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-card/30">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeader center eyebrow="Common questions" title="Before you choose." />
          <Reveal delay={100}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
