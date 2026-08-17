import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, e as useSearch } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CT4naPST.mjs";
import { H as Header } from "./Header-RIImzVxl.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/lucide-react.mjs";
function AuthPage() {
  const navigate = useNavigate();
  const {
    redirect
  } = useSearch({
    from: "/auth"
  });
  const [mode, setMode] = reactExports.useState("in");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      if (mode === "in") {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
      }
      navigate({
        to: redirect ?? "/admin"
      });
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-32 pb-20 px-4 max-w-md mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 rounded-3xl glass shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-2", children: "Admin access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold mb-1", children: mode === "in" ? "Sign in" : "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Restricted area — Almas Skika staff only." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60" })
        ] }),
        err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-400", children: err }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "mt-2 py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.01] transition disabled:opacity-50", children: busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(mode === "in" ? "up" : "in"), className: "mt-4 text-xs text-muted-foreground hover:text-gold transition w-full text-center", children: mode === "in" ? "No account? Create one" : "Already have an account? Sign in" })
    ] }) })
  ] });
}
export {
  AuthPage as component
};
