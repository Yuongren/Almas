import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioWave } from "@/components/AudioWave";
import { Reveal } from "@/components/Reveal";
import { Accordion } from "@/components/Accordion";
import { ArrowRight, Phone, Mail, MapPin, MessageCircle, Send, Clock } from "lucide-react";
import { useState } from "react";
import { submitDemoRequest } from "@/lib/api/example.functions";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    track: typeof search.track === "string" ? search.track : undefined,
  }),
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

const nextSteps = [
  { n: "01", t: "Send your request", d: "Tell us what you need — a caller tune, IVR, or full audio branding suite." },
  { n: "02", t: "We reply within 24h", d: "A member of our studio team reaches out to confirm scope and timeline." },
  { n: "03", t: "Get your sample", d: "A custom audio sample lands in your inbox within 48 hours — no obligation." },
];

const faqs = [
  {
    q: "How fast can you deliver?",
    a: "Standard delivery is 5 days for most projects. Fast-track packages (24–48 hours) are available for campaigns and product launches — mention your deadline in the form and we'll confirm feasibility.",
  },
  {
    q: "Do you work in languages other than English?",
    a: "Yes — we record in Swahili, Kikuyu, Luo, Kalenjin, Luhya and more. Let us know your target audience and we'll match the right voice talent.",
  },
  {
    q: "Can I request revisions?",
    a: "Most packages include at least one round of revisions. If something doesn't sound right, tell us and we'll adjust it before final delivery.",
  },
  {
    q: "How do I pay?",
    a: "We accept M-Pesa and bank transfer. Payment terms depend on project size — we'll confirm details once we understand your scope.",
  },
];

function ContactPage() {
  const { track } = Route.useSearch();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    organisation: "",
    request: track ? `I'd like a demo of "${track}".` : "",
  });
  const [website, setWebsite] = useState(""); // honeypot — real users never see or fill this
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Silently drop likely-bot submissions: a hidden field only a bot would fill.
    if (website.trim()) {
      setForm({ name: "", contact: "", organisation: "", request: "" });
      setStatus("Thanks. We'll be in touch within 24 hours.");
      return;
    }

    setBusy(true);
    setStatus(null);
    try {
      await submitDemoRequest(form);
      setForm({ name: "", contact: "", organisation: "", request: "" });
      setStatus("Thanks. We'll be in touch within 24 hours.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to submit your request.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      {/* HERO + FORM */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-neon/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4">
          <Reveal className="text-center mb-14">
            <AudioWave bars={28} className="max-w-xs mx-auto mb-8" />
            <h1 className="font-display text-4xl md:text-6xl font-bold glow-text">
              Let's make your brand <span className="text-gold-gradient">heard.</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Tell us about your project. We'll send back a custom audio sample within 48 hours — no obligation.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* FORM */}
            <Reveal className="lg:col-span-3">
              <form
                className="p-7 md:p-8 rounded-3xl glass shadow-card grid gap-4"
                onSubmit={handleSubmit}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground"
                    placeholder="Your name"
                  />
                  <input
                    required
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground"
                    placeholder="Email or phone"
                  />
                </div>
                <input
                  value={form.organisation}
                  onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                  className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground"
                  placeholder="Organisation (optional)"
                />
                <textarea
                  required
                  rows={5}
                  value={form.request}
                  onChange={(e) => setForm({ ...form, request: e.target.value })}
                  className="px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground resize-none"
                  placeholder="What kind of audio do you need?"
                />
                {status && <p className="text-sm text-gold" role="status">{status}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.01] transition disabled:opacity-50"
                >
                  {busy ? "Sending…" : "Request demo"} {!busy && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            </Reveal>

            {/* SIDE INFO */}
            <Reveal delay={100} className="lg:col-span-2 grid gap-4">
              <a
                href="https://wa.me/254707002424"
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl glass hover:border-gold/40 transition flex items-center gap-4"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gold-gradient grid place-items-center shadow-gold">
                  <MessageCircle className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Chat on WhatsApp</div>
                  <div className="text-xs text-muted-foreground">Fastest way to reach us</div>
                </div>
              </a>

              <a
                href="tel:+254707002424"
                className="p-5 rounded-2xl glass hover:border-gold/40 transition flex items-center gap-4"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl glass grid place-items-center text-gold">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">+254 707 002 424</div>
                  <div className="text-xs text-muted-foreground">Mon–Fri, 9am–6pm EAT</div>
                </div>
              </a>

              <a
                href="mailto:hello@almasskika.co.ke"
                className="p-5 rounded-2xl glass hover:border-gold/40 transition flex items-center gap-4"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl glass grid place-items-center text-gold">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">hello@almasskika.co.ke</div>
                  <div className="text-xs text-muted-foreground">We reply within 24h</div>
                </div>
              </a>

              <div className="p-5 rounded-2xl glass flex items-center gap-4">
                <div className="h-11 w-11 shrink-0 rounded-xl glass grid place-items-center text-gold">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Nairobi, Kenya</div>
                  <div className="text-xs text-muted-foreground">Studio by appointment</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="py-20 md:py-28 bg-card/30">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl mb-12 text-center mx-auto">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">What happens next</div>
            <h2 className="text-3xl md:text-4xl font-bold">From message to master, in three steps.</h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-4">
            {nextSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="relative p-6 rounded-2xl border border-border/60 bg-card/40 hover:border-gold/40 transition h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="font-display text-3xl font-bold text-gold-gradient opacity-80">{s.n}</div>
                    {i < nextSteps.length - 1 && (
                      <Clock className="h-4 w-4 text-muted-foreground/40 hidden sm:block" />
                    )}
                  </div>
                  <div className="font-semibold">{s.t}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal className="text-center mb-10">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Common questions</div>
            <h2 className="text-3xl md:text-4xl font-bold">Before you reach out.</h2>
          </Reveal>

          <Reveal delay={100}>
            <Accordion items={faqs} />
          </Reveal>

          <Reveal delay={200} className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Still have questions?{" "}
              <a href="https://wa.me/254707002424" target="_blank" rel="noreferrer" className="text-gold hover:underline inline-flex items-center gap-1">
                Message us on WhatsApp <Send className="h-3 w-3" />
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
