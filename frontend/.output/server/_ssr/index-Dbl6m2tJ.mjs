import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Dnm9rgfp.mjs";
import { H as Header } from "./Header-RIImzVxl.mjs";
import { u as useAuth } from "./useAuth-PyDB7P0L.mjs";
import { d as AUDIO_CATEGORIES, c as categoryLabel, f as fetchTracks, A as AUDIO_CATEGORY_VALUES } from "./audio-BjlvbQrT.mjs";
import { c as createSsrRpc } from "./createSsrRpc-dmGqwb_d.mjs";
import { a as createServerFn } from "./server-Bhy4EJDI.mjs";

import "../_libs/seroval.mjs";
import { o as LogOut, U as Upload, D as DollarSign, p as Trash2 } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, b as booleanType, e as enumType } from "../_libs/zod.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/unenv.mjs";


import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




const uploadAudioTrack = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  title: stringType().min(1),
  description: stringType().max(400).nullable().optional(),
  category: enumType(AUDIO_CATEGORY_VALUES),
  isPaid: booleanType(),
  skizaCode: stringType().max(50).nullable().optional(),
  fileName: stringType().min(1),
  fileType: stringType().min(1),
  fileData: stringType().min(1)
})).handler(createSsrRpc("89ff173fbe56a8ca331e9ac50d31ad63f4a7c5acc7e881bde011b8bacae2fd8f"));
function AdminPage() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [tracks, setTracks] = reactExports.useState([]);
  const [accessChecked, setAccessChecked] = reactExports.useState(false);
  const [isAdmin, setIsAdmin] = reactExports.useState(true);
  const [loading, setLoading] = reactExports.useState(true);
  const [demoRequests, setDemoRequests] = reactExports.useState([]);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState(AUDIO_CATEGORIES[0].value);
  const [isPaid, setIsPaid] = reactExports.useState(false);
  const [skizaCode, setSkizaCode] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState(null);
  async function reload() {
    setLoading(true);
    try {
      setTracks(await fetchTracks());
      const {
        data: requests
      } = await supabase.from("demo_requests").select("*").order("created_at", {
        ascending: false
      });
      setDemoRequests(requests ?? []);
    } finally {
      setLoading(false);
    }
  }
  reactExports.useEffect(() => {
    async function verifyAccess() {
      if (!user?.id) {
        setAccessChecked(true);
        setIsAdmin(false);
        return;
      }
      try {
        const {
          data
        } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
        setIsAdmin(Boolean(data));
      } catch {
        setIsAdmin(true);
      } finally {
        setAccessChecked(true);
      }
    }
    verifyAccess();
    reload();
  }, [user?.id]);
  if (!accessChecked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pt-32 text-center text-muted-foreground", children: "Checking access…" })
    ] });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-32 max-w-md mx-auto px-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold mb-2", children: "Access denied" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [
          "Your account (",
          user?.email,
          ") is not an administrator."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-6", children: [
          "To grant yourself admin access, ask a workspace owner to run in the database:",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { className: "text-gold", children: [
            "insert into user_roles (user_id, role) values ('",
            user?.id,
            "', 'admin');"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
          await supabase.auth.signOut();
          navigate({
            to: "/auth"
          });
        }, className: "inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          " Sign out"
        ] })
      ] })
    ] });
  }
  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !title) return;
    setBusy(true);
    setMsg(null);
    try {
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === "string") {
            const base64 = result.split(",")[1];
            resolve(base64);
          } else {
            reject(new Error("Unable to read file."));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      await uploadAudioTrack({
        title,
        description: description || null,
        category,
        isPaid,
        skizaCode: skizaCode || null,
        fileName: file.name,
        fileType: file.type || "audio/mpeg",
        fileData
      });
      setTitle("");
      setDescription("");
      setSkizaCode("");
      setIsPaid(false);
      setFile(null);
      setMsg("Uploaded ✔");
      await reload();
    } catch (e2) {
      setMsg(e2 instanceof Error ? e2.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  async function handleDelete(t) {
    if (!confirm(`Delete "${t.title}"?`)) return;
    await supabase.storage.from("audio-tracks").remove([t.storage_path]);
    await supabase.from("audio_tracks").delete().eq("id", t.id);
    await reload();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-28 pb-20 max-w-6xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-2", children: "Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold", children: "Audio library" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
            "Signed in as ",
            user?.email
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
          await supabase.auth.signOut();
          navigate({
            to: "/auth"
          });
        }, className: "inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          " Sign out"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpload, className: "p-6 rounded-2xl glass shadow-card grid gap-4 md:grid-cols-2 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 text-gold" }),
          " Upload new audio"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, placeholder: "Title", value: title, onChange: (e) => setTitle(e.target.value), className: "px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60", children: AUDIO_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.value, children: c.label }, c.value)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Description (optional)", value: description, onChange: (e) => setDescription(e.target.value), rows: 2, className: "md:col-span-2 px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Skiza code (e.g. *811*123#)", value: skizaCode, onChange: (e) => setSkizaCode(e.target.value), className: "px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-3 px-4 py-3 rounded-xl glass cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isPaid, onChange: (e) => setIsPaid(e.target.checked), className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-gold" }),
            " Paid tune"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "audio/*", required: true, onChange: (e) => setFile(e.target.files?.[0] ?? null), className: "md:col-span-2 px-4 py-3 rounded-xl glass bg-input/40 outline-none file:mr-3 file:px-3 file:py-1.5 file:rounded-full file:border-0 file:bg-gold-gradient file:text-primary-foreground file:font-semibold" }),
        msg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "md:col-span-2 text-sm text-gold", children: msg }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "md:col-span-2 py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold disabled:opacity-50", children: busy ? "Uploading…" : "Upload track" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl mb-4", children: [
        "All tracks (",
        tracks.length,
        ")"
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: tracks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl glass flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-widest text-gold", children: [
            categoryLabel(t.category),
            " ",
            t.is_paid && "· PAID"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate", children: t.title }),
          t.skiza_code && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Code: ",
            t.skiza_code
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(t), "aria-label": "Delete", className: "h-9 w-9 grid place-items-center rounded-full glass hover:bg-red-500/20 hover:text-red-400 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }, t.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-xl mt-12 mb-4", children: [
        "Demo requests (",
        demoRequests.length,
        ")"
      ] }),
      demoRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No demo requests yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: demoRequests.map((request) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl glass grid gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: request.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(request.created_at).toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gold", children: request.contact }),
        request.organisation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: request.organisation }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground whitespace-pre-wrap", children: request.request })
      ] }, request.id)) })
    ] })
  ] });
}
export {
  AdminPage as component
};
