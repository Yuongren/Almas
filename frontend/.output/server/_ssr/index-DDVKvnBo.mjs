import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AudioWave, s as submitDemoRequest } from "./example.functions-DzSdFh8R.mjs";
import { H as Header } from "./Header-RIImzVxl.mjs";
import { F as Footer } from "./Footer-DsNOYzoO.mjs";
import { T as TunesLibrary } from "./TunesLibrary-Ci7fDXXO.mjs";

import "../_libs/seroval.mjs";
import { S as Sparkles, A as ArrowRight, M as Megaphone, C as Church, L as Languages, H as Headphones, a as ShieldCheck, Z as Zap, E as Earth, b as Check } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "./createSsrRpc-dmGqwb_d.mjs";
import "./server-Bhy4EJDI.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./client-Dnm9rgfp.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "./audio-BjlvbQrT.mjs";
import "./useAuth-PyDB7P0L.mjs";
const heroWaves = "/assets/hero-waves-BFuezyf3.jpg";
const studioMic = "/assets/studio-mic-QDpYlZ9k.jpg";
const services = [{
  icon: Megaphone,
  title: "Campaign Tunes",
  desc: "Political caller tunes that mobilise voters across counties.",
  featured: true
}, {
  icon: Church,
  title: "Church Audio",
  desc: "Sermons, jingles and worship audio mastered for clarity."
}, {
  icon: Languages,
  title: "Native Languages",
  desc: "Swahili, Kikuyu, Luo, Kalenjin, Luhya — voices that feel home."
}];
const audience = ["Businesses", "Churches", "Political Aspirants", "SMEs", "Schools", "Corporates", "Campaign Teams", "NGOs"];
const steps = [{
  n: "01",
  t: "Brief",
  d: "We listen — to your brand, audience and tone of voice."
}, {
  n: "02",
  t: "Script & Cast",
  d: "Words that move. Voices that match your identity."
}, {
  n: "03",
  t: "Studio",
  d: "Recorded, layered and mastered by senior audio engineers."
}, {
  n: "04",
  t: "Deploy",
  d: "Pushed live across Safaricom, Airtel and Telkom networks."
}];
function Index() {
  const [demoForm, setDemoForm] = reactExports.useState({
    name: "",
    contact: "",
    request: ""
  });
  const [demoStatus, setDemoStatus] = reactExports.useState(null);
  const [demoBusy, setDemoBusy] = reactExports.useState(false);
  async function handleDemoSubmit(e) {
    e.preventDefault();
    setDemoBusy(true);
    setDemoStatus(null);
    try {
      await submitDemoRequest(demoForm);
      setDemoForm({
        name: "",
        contact: "",
        request: ""
      });
      setDemoStatus("Thanks. We'll be in touch within 24 hours.");
    } catch {
      setDemoStatus("Unable to submit your request.");
    } finally {
      setDemoBusy(false);
    }
  }
  const [libraryOpen, setLibraryOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative pt-32 pb-20 md:pt-40 md:pb-32 bg-hero overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroWaves, alt: "", width: 1536, height: 1536, className: "absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-6xl mx-auto px-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6 animate-[float_6s_ease-in-out_infinite]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-gold" }),
          "Kenya's premier telecom audio studio"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight glow-text", children: [
          "The Sound ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "sm:hidden" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold-gradient", children: "Your Brand" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Deserves."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl mx-auto text-base md:text-lg text-muted-foreground", children: "Caller tunes, voice overs and telecom audio branding — engineered in Nairobi, delivered to every phone in Kenya." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#contact", className: "group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition text-base", children: [
            "Request a Demo ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-0.5 transition" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/features", className: "inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass font-semibold hover:bg-secondary/50 transition", children: "Hear our work" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AudioWave, { bars: 40, className: "max-w-md mx-auto" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-y border-border/50 py-6 bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center", children: [{
      k: "500+",
      v: "Brands voiced"
    }, {
      k: "3",
      v: "Major networks"
    }, {
      k: "12+",
      v: "Local languages"
    }, {
      k: "24h",
      v: "Turnaround"
    }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl md:text-3xl font-display font-bold text-gold-gradient", children: s.k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mt-1", children: s.v })
    ] }, s.v)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "services", className: "py-20 md:py-28 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-3", children: "What we craft" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-5xl font-bold", children: "Audio that does the talking." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Every product is mixed, mastered and ready for telecom deployment from day one." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid sm:grid-cols-2 gap-4", children: services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: ["group relative p-6 rounded-2xl glass shadow-card hover:-translate-y-1 transition-all duration-300 hover:shadow-gold", s.featured ? "sm:col-span-2 border-gold/40 bg-gold/5" : ""].join(" "), children: [
        s.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider text-gold", children: "In the spotlight" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-gold-gradient grid place-items-center shadow-gold mb-5 group-hover:scale-110 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg", children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl", children: s.desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 h-px bg-gradient-to-r from-gold/40 via-neon/30 to-transparent" })
      ] }, s.title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex flex-col sm:flex-row gap-3 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setLibraryOpen(true), className: "inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Headphones, { className: "h-4 w-4" }),
          " Hear samples"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/features", className: "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full glass font-semibold hover:bg-secondary/50 transition", children: [
          "Explore all features ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-20 md:py-28 bg-mesh relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-neon/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gold/20 blur-3xl rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: studioMic, alt: "Studio microphone", width: 1024, height: 1024, loading: "lazy", className: "relative rounded-3xl shadow-card border border-border/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -bottom-6 -right-4 glass rounded-2xl p-4 shadow-gold animate-[float_6s_ease-in-out_infinite]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AudioWave, { bars: 14, variant: "gold", className: "h-12 w-32" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mt-1 text-center", children: "Now recording" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-3", children: "Why Almas Skika" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-bold", children: [
            "Built in Kenya. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold-gradient", children: "Heard everywhere." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "We combine broadcast-grade engineering with deep cultural fluency — so your sound lands the moment a call connects." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-8 space-y-4", children: [{
            i: ShieldCheck,
            t: "Telecom-certified delivery",
            d: "Pre-approved formats for Safaricom Skiza, Airtel Hello Tunes & Telkom."
          }, {
            i: Zap,
            t: "24-hour turnaround",
            d: "Fast-track packages for campaigns and product launches."
          }, {
            i: Earth,
            t: "12+ native languages",
            d: "Voice talent fluent in every major Kenyan language."
          }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 shrink-0 rounded-xl glass grid place-items-center text-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.i, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: f.t }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: f.d })
            ] })
          ] }, f.t)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "testimonials", className: "py-20 md:py-28 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-3", children: "Client reviews" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-bold", children: [
          "Trusted by the voices ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold-gradient", children: "of Kenya." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-5", children: [{
        q: "Almas Skika built our Skiza tune in 48 hours. Call volumes lifted instantly.",
        n: "Wanjiku Mwangi",
        r: "Marketing Lead",
        c: "Jambo Africa",
        l: "JA"
      }, {
        q: "Their Swahili voice talent is unmatched. Our IVR finally sounds like us.",
        n: "David Otieno",
        r: "CTO",
        c: "Pesa Plus",
        l: "P+"
      }, {
        q: "Mastered, mixed and deployed across all three networks. Truly premium work.",
        n: "Grace Kamau",
        r: "Campaign Director",
        c: "Kenya Forward",
        l: "KF"
      }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "p-7 rounded-2xl glass shadow-card hover:border-gold/40 transition flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 text-gold mb-4", "aria-label": "5 star rating", children: Array.from({
          length: 5
        }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "★" }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "text-sm md:text-base leading-relaxed flex-1", children: [
          '"',
          t.q,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { className: "mt-6 flex items-center gap-3 pt-5 border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-gold-gradient grid place-items-center font-display font-bold text-primary-foreground text-sm shrink-0", "aria-hidden": true, children: t.l }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: t.n }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              t.r,
              " · ",
              t.c
            ] })
          ] })
        ] })
      ] }, t.n)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "process", className: "py-20 md:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-3", children: "Process" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-5xl font-bold", children: "From brief to broadcast in days." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: steps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-6 rounded-2xl border border-border/60 bg-card/40 hover:border-gold/40 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-5xl font-bold text-gold-gradient opacity-80", children: s.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-semibold", children: s.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: s.d })
      ] }, s.n)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "audience", className: "py-20 md:py-28 bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-3", children: "Who we serve" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-5xl font-bold", children: "Sound for every Kenyan organisation." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex flex-wrap justify-center gap-3", children: audience.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-5 py-2.5 rounded-full glass text-sm font-medium hover:border-gold/40 hover:text-gold transition cursor-default", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "inline h-3.5 w-3.5 mr-2 text-gold" }),
        a
      ] }, a)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "contact", className: "py-20 md:py-28 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-hero" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-3xl mx-auto px-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AudioWave, { bars: 28, className: "max-w-xs mx-auto mb-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-5xl font-bold", children: [
          "Let's make your brand ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold-gradient", children: "heard." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground max-w-xl mx-auto", children: "Tell us about your project. We'll send back a custom audio sample within 48 hours — no obligation." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-10 grid gap-4 max-w-md mx-auto text-left", onSubmit: handleDemoSubmit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "name", name: "name", required: true, maxLength: 100, value: demoForm.name, onChange: (e) => setDemoForm({
              ...demoForm,
              name: e.target.value
            }), className: "px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground", placeholder: "Your full name" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "email", name: "email", type: "email", required: true, maxLength: 255, value: demoForm.contact, onChange: (e) => setDemoForm({
              ...demoForm,
              contact: e.target.value
            }), className: "px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground", placeholder: "you@company.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "message", className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { id: "message", name: "message", rows: 4, required: true, maxLength: 1e3, value: demoForm.request, onChange: (e) => setDemoForm({
              ...demoForm,
              request: e.target.value
            }), className: "px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground resize-none", placeholder: "What kind of audio do you need?" })
          ] }),
          demoStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gold", role: "status", children: demoStatus }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: demoBusy, className: "mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.01] transition disabled:opacity-50", children: [
            demoBusy ? "Sending…" : "Request a Demo",
            " ",
            !demoBusy && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-col sm:flex-row justify-center gap-6 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:+254707002424", className: "hover:text-gold transition", children: "+254 707 002 424" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:hello@almasskika.co.ke", className: "hover:text-gold transition", children: "hello@almasskika.co.ke" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Nairobi, Kenya" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    libraryOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(TunesLibrary, { onClose: () => setLibraryOpen(false) })
  ] });
}
export {
  Index as component
};
