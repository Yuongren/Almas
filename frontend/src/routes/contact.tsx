import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioWave } from "@/components/AudioWave";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Almas Skika Audio Studio Nairobi" },
      { name: "description", content: "Talk to the Almas Skika studio in Nairobi. Get a custom audio sample for your brand within 48 hours." },
      { property: "og:title", content: "Contact Almas Skika" },
      { property: "og:description", content: "Reach the Almas Skika team — caller tunes, voice overs and audio branding." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <AudioWave bars={28} className="max-w-xs mx-auto mb-8" />
          <h1 className="font-display text-4xl md:text-6xl font-bold glow-text">
            Let's make your brand <span className="text-gold-gradient">heard.</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Tell us about your project. We'll send back a custom audio sample within 48 hours — no obligation.
          </p>

          <form className="mt-10 grid gap-3 max-w-md mx-auto text-left" onSubmit={(e) => e.preventDefault()}>
            <input className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground" placeholder="Your name" />
            <input className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground" placeholder="Email or phone" />
            <input className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground" placeholder="Organisation (optional)" />
            <textarea rows={4} className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground resize-none" placeholder="What kind of audio do you need?" />
            <button className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.01] transition">
              Request demo <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-12 grid sm:grid-cols-3 gap-4 text-sm">
            <a href="tel:+254707002424" className="p-5 rounded-2xl glass hover:border-gold/40 transition flex flex-col items-center gap-2">
              <Phone className="h-5 w-5 text-gold" />
              <span className="font-semibold">+254 707 002 424</span>
              <span className="text-xs text-muted-foreground">Mon–Fri, 9am–6pm EAT</span>
            </a>
            <a href="mailto:hello@almasskika.co.ke" className="p-5 rounded-2xl glass hover:border-gold/40 transition flex flex-col items-center gap-2">
              <Mail className="h-5 w-5 text-gold" />
              <span className="font-semibold">hello@almasskika.co.ke</span>
              <span className="text-xs text-muted-foreground">We reply within 24h</span>
            </a>
            <div className="p-5 rounded-2xl glass flex flex-col items-center gap-2">
              <MapPin className="h-5 w-5 text-gold" />
              <span className="font-semibold">Nairobi, Kenya</span>
              <span className="text-xs text-muted-foreground">Studio by appointment</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
