import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioWave } from "@/components/AudioWave";
import {
  Phone, Mic, Megaphone, Church, Music4, Languages,
  Headphones, Radio, ShieldCheck, Zap, Globe2, Sparkles, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Almas Skika Audio Branding Studio" },
      { name: "description", content: "Caller tunes, IVR greetings, voice overs, hold music and native-language audio branding — engineered for Kenyan telecoms." },
      { property: "og:title", content: "Features — Almas Skika" },
      { property: "og:description", content: "Every audio product Almas Skika crafts, from Skiza tunes to broadcast voice overs." },
      { property: "og:url", content: "/features" },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
  component: FeaturesPage,
});

const features = [
  { icon: Phone, title: "Caller Tunes", desc: "Custom Skiza tunes that turn every ring into a brand moment." },
  { icon: Mic, title: "Business Greetings", desc: "Professional IVR voices that welcome every caller with intent." },
  { icon: Megaphone, title: "Campaign Tunes", desc: "Political caller tunes that mobilise voters across counties." },
  { icon: Church, title: "Church Audio", desc: "Sermons, jingles and worship audio mastered for clarity." },
  { icon: Music4, title: "Hold Music", desc: "Corporate hold loops with brand messaging that retains callers." },
  { icon: Languages, title: "Native Languages", desc: "Swahili, Kikuyu, Luo, Kalenjin, Luhya — voices that feel home." },
  { icon: Headphones, title: "Voice Overs", desc: "Broadcast-grade VO for radio, TV, e-learning and explainers." },
  { icon: Radio, title: "Audio Branding", desc: "Sonic logos, anthems and signatures that travel with your brand." },
];

const why = [
  { i: ShieldCheck, t: "Telecom-certified delivery", d: "Pre-approved formats for Safaricom Skiza, Airtel Hello Tunes & Telkom." },
  { i: Zap, t: "24-hour turnaround", d: "Fast-track packages for campaigns and product launches." },
  { i: Globe2, t: "12+ native languages", d: "Voice talent fluent in every major Kenyan language." },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-hero overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Everything we craft
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight glow-text">
            Audio products built <br /><span className="text-gold-gradient">for every brand moment.</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-muted-foreground">
            From the first ring to the last word — a complete sonic toolkit for Kenyan organisations.
          </p>
          <div className="mt-10"><AudioWave bars={32} className="max-w-md mx-auto" /></div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((s) => (
            <div key={s.title} className="group p-6 rounded-2xl glass shadow-card hover:-translate-y-1 hover:shadow-gold transition-all">
              <div className="h-11 w-11 rounded-xl bg-gold-gradient grid place-items-center shadow-gold mb-5 group-hover:scale-110 transition">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Why Almas Skika</div>
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl">Built in Kenya. <span className="text-gold-gradient">Heard everywhere.</span></h2>
          <ul className="mt-10 grid md:grid-cols-3 gap-4">
            {why.map((f) => (
              <li key={f.t} className="p-6 rounded-2xl glass">
                <div className="h-10 w-10 rounded-xl glass grid place-items-center text-gold mb-4">
                  <f.i className="h-5 w-5" />
                </div>
                <div className="font-semibold">{f.t}</div>
                <div className="text-sm text-muted-foreground mt-1">{f.d}</div>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition">
              Start your project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
