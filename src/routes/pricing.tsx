import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Almas Skika Audio Branding Packages" },
      { name: "description", content: "Transparent pricing for caller tunes, voice overs and full audio branding suites. Packages for startups, SMEs and enterprise." },
      { property: "og:title", content: "Pricing — Almas Skika" },
      { property: "og:description", content: "Pick a package: Starter, Studio or Signature. Custom quotes for campaigns and enterprise." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Starter",
    price: "KSh 15,000",
    blurb: "For small businesses and startups.",
    features: ["1 caller tune (30s)", "1 IVR greeting", "1 voice in English or Swahili", "Standard delivery (5 days)", "Telecom-ready export"],
    cta: "Choose Starter",
  },
  {
    name: "Studio",
    price: "KSh 45,000",
    blurb: "Most chosen by growing brands.",
    features: ["3 caller tunes + remix", "Full IVR menu set", "2 voices, 2 languages", "Hold music loop (60s)", "48-hour turnaround", "1 round of revisions"],
    cta: "Choose Studio",
    featured: true,
  },
  {
    name: "Signature",
    price: "Custom",
    blurb: "Campaigns, churches, enterprise.",
    features: ["Sonic logo & brand anthem", "Unlimited voice talent", "All Kenyan languages", "Dedicated audio engineer", "24-hour fast-track", "Multi-network deployment"],
    cta: "Talk to us",
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-hero overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Simple, transparent pricing
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight glow-text">
            Pricing that <span className="text-gold-gradient">scales with your sound.</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-muted-foreground">
            One-off projects or ongoing retainers. Every package is telecom-ready out of the studio.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative p-7 rounded-3xl glass shadow-card flex flex-col ${t.featured ? "border-gold/50 shadow-gold scale-[1.02]" : ""}`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gold-gradient text-primary-foreground shadow-gold">
                  Most popular
                </span>
              )}
              <div className="text-xs uppercase tracking-[0.3em] text-gold">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-gold-gradient">{t.price}</span>
                {t.price !== "Custom" && <span className="text-xs text-muted-foreground">/ project</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
              <ul className="mt-6 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm">
                    <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold transition ${
                  t.featured
                    ? "bg-gold-gradient text-primary-foreground shadow-gold hover:scale-[1.01]"
                    : "glass hover:bg-secondary/50"
                }`}
              >
                {t.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Need a campaign quote or church partnership rate? <Link to="/contact" className="text-gold hover:underline">Talk to our team →</Link>
        </p>
      </section>

      <Footer />
    </div>
  );
}
