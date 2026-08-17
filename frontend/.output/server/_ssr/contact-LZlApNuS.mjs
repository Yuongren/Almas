import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Header } from "./Header-RIImzVxl.mjs";
import { F as Footer } from "./Footer-DsNOYzoO.mjs";
import { A as AudioWave } from "./AudioWave-8YfkYpLX.mjs";
import { A as ArrowRight, j as Phone, k as Mail, l as MapPin } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
function ContactPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-hero" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-3xl mx-auto px-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AudioWave, { bars: 28, className: "max-w-xs mx-auto mb-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl md:text-6xl font-bold glow-text", children: [
          "Let's make your brand ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold-gradient", children: "heard." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground max-w-xl mx-auto", children: "Tell us about your project. We'll send back a custom audio sample within 48 hours — no obligation." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-10 grid gap-3 max-w-md mx-auto text-left", onSubmit: (e) => e.preventDefault(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground", placeholder: "Your name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground", placeholder: "Email or phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground", placeholder: "Organisation (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, className: "px-5 py-3.5 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 transition placeholder:text-muted-foreground resize-none", placeholder: "What kind of audio do you need?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.01] transition", children: [
            "Request demo ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid sm:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "tel:+254707002424", className: "p-5 rounded-2xl glass hover:border-gold/40 transition flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "+254 707 002 424" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Mon–Fri, 9am–6pm EAT" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:hello@almasskika.co.ke", className: "p-5 rounded-2xl glass hover:border-gold/40 transition flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "hello@almasskika.co.ke" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "We reply within 24h" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl glass flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Nairobi, Kenya" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Studio by appointment" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  ContactPage as component
};
