import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { H as Header } from "./Header-RIImzVxl.mjs";
import { F as Footer } from "./Footer-DsNOYzoO.mjs";
import { S as Sparkles, b as Check, A as ArrowRight } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
const tiers = [{
  name: "Starter",
  price: "KSh 15,000",
  blurb: "For small businesses and startups.",
  features: ["1 caller tune (30s)", "1 IVR greeting", "1 voice in English or Swahili", "Standard delivery (5 days)", "Telecom-ready export"],
  cta: "Choose Starter"
}, {
  name: "Studio",
  price: "KSh 45,000",
  blurb: "Most chosen by growing brands.",
  features: ["3 caller tunes + remix", "Full IVR menu set", "2 voices, 2 languages", "Hold music loop (60s)", "48-hour turnaround", "1 round of revisions"],
  cta: "Choose Studio",
  featured: true
}, {
  name: "Signature",
  price: "Custom",
  blurb: "Campaigns, churches, enterprise.",
  features: ["Sonic logo & brand anthem", "Unlimited voice talent", "All Kenyan languages", "Dedicated audio engineer", "24-hour fast-track", "Multi-network deployment"],
  cta: "Talk to us"
}];
function PricingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative pt-32 pb-16 md:pt-40 md:pb-20 bg-hero overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-6xl mx-auto px-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-gold" }),
          " Simple, transparent pricing"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl sm:text-6xl font-bold leading-tight tracking-tight glow-text", children: [
          "Pricing that ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold-gradient", children: "scales with your sound." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl mx-auto text-muted-foreground", children: "One-off projects or ongoing retainers. Every package is telecom-ready out of the studio." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-16 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-5", children: tiers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative p-7 rounded-3xl glass shadow-card flex flex-col ${t.featured ? "border-gold/50 shadow-gold scale-[1.02]" : ""}`, children: [
        t.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gold-gradient text-primary-foreground shadow-gold", children: "Most popular" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-gold", children: t.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl font-bold text-gold-gradient", children: t.price }),
          t.price !== "Custom" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "/ project" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: t.blurb }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-3 flex-1", children: t.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-gold shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
        ] }, f)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/contact", className: `mt-8 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold transition ${t.featured ? "bg-gold-gradient text-primary-foreground shadow-gold hover:scale-[1.01]" : "glass hover:bg-secondary/50"}`, children: [
          t.cta,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }, t.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-10 text-center text-sm text-muted-foreground", children: [
        "Need a campaign quote or church partnership rate? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-gold hover:underline", children: "Talk to our team →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  PricingPage as component
};
