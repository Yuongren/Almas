import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { H as Header } from "./Header-RIImzVxl.mjs";
import { F as Footer } from "./Footer-DsNOYzoO.mjs";
import { A as AudioWave } from "./example.functions-DzSdFh8R.mjs";
import { T as TunesLibrary } from "./TunesLibrary-Ci7fDXXO.mjs";

import "../_libs/seroval.mjs";
import { S as Sparkles, j as Phone, m as Mic, M as Megaphone, C as Church, n as Music4, L as Languages, H as Headphones, R as Radio, a as ShieldCheck, Z as Zap, E as Earth, A as ArrowRight } from "../_libs/lucide-react.mjs";

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
const features = [{
  icon: Phone,
  title: "Caller Tunes",
  desc: "Custom Skiza tunes that turn every ring into a brand moment."
}, {
  icon: Mic,
  title: "Business Greetings",
  desc: "Professional IVR voices that welcome every caller with intent."
}, {
  icon: Megaphone,
  title: "Campaign Tunes",
  desc: "Political caller tunes that mobilise voters across counties."
}, {
  icon: Church,
  title: "Church Audio",
  desc: "Sermons, jingles and worship audio mastered for clarity."
}, {
  icon: Music4,
  title: "Hold Music",
  desc: "Corporate hold loops with brand messaging that retains callers."
}, {
  icon: Languages,
  title: "Native Languages",
  desc: "Swahili, Kikuyu, Luo, Kalenjin, Luhya — voices that feel home."
}, {
  icon: Headphones,
  title: "Voice Overs",
  desc: "Broadcast-grade VO for radio, TV, e-learning and explainers."
}, {
  icon: Radio,
  title: "Audio Branding",
  desc: "Sonic logos, anthems and signatures that travel with your brand."
}];
const why = [{
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
}];
function FeaturesPage() {
  const [libraryOpen, setLibraryOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative pt-32 pb-16 md:pt-40 md:pb-24 bg-hero overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-6xl mx-auto px-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-gold" }),
          " Everything we craft"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight glow-text", children: [
          "Audio products built ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold-gradient", children: "for every brand moment." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl mx-auto text-muted-foreground", children: "From the first ring to the last word — a complete sonic toolkit for Kenyan organisations." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AudioWave, { bars: 32, className: "max-w-md mx-auto" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-16 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: features.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group flex min-h-[218px] flex-col p-6 rounded-2xl glass shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-gold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 shrink-0 rounded-xl bg-gold-gradient grid place-items-center shadow-gold mb-5 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg leading-tight", children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-muted-foreground", children: s.desc })
      ] }, s.title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setLibraryOpen(true), className: "inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 font-semibold text-primary-foreground shadow-gold transition duration-300 hover:scale-[1.02] hover:shadow-[0_12px_44px_-12px_oklch(0.82_0.14_85_/_65%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Headphones, { className: "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" }),
        " Hear samples"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-24 bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-3", children: "Why Almas Skika" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl md:text-4xl font-bold max-w-2xl", children: [
        "Built in Kenya. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold-gradient", children: "Heard everywhere." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-10 grid md:grid-cols-3 gap-4", children: why.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "group min-h-[164px] rounded-2xl glass p-6 transition-colors duration-300 hover:border-gold/25", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 grid h-10 w-10 place-items-center rounded-xl glass text-gold transition-transform duration-300 group-hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.i, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold leading-tight", children: f.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm leading-6 text-muted-foreground", children: f.d })
      ] }, f.t)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/contact", className: "inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition", children: [
        "Start your project ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    libraryOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(TunesLibrary, { onClose: () => setLibraryOpen(false) })
  ] });
}
export {
  FeaturesPage as component
};
