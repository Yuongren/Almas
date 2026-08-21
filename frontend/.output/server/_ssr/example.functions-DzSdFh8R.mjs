import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createSsrRpc } from "./createSsrRpc-dmGqwb_d.mjs";
import { a as createServerFn } from "./server-Bhy4EJDI.mjs";
import { s as supabase } from "./client-Dnm9rgfp.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
function AudioWave({ bars = 32, className = "", variant = "mixed" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex items-center justify-center gap-[3px] h-16 ${className}`, children: Array.from({ length: bars }).map((_, i) => {
    const color = variant === "gold" ? "bg-gold" : variant === "neon" ? "bg-neon" : i % 2 === 0 ? "bg-gold" : "bg-neon";
    const height = (30 + Math.sin(i * 0.6) * 35 + 35).toFixed(4);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `w-[3px] rounded-full ${color} wave-bar`,
        style: {
          height: `${height}%`,
          animationDelay: `${i * 0.05}s`
        }
      },
      i
    );
  }) });
}
createServerFn({
  method: "POST"
}).inputValidator(objectType({
  name: stringType().min(1)
})).handler(createSsrRpc("a8ea96f55c98d9dfe39eba1f21271c6c33bfa924611fe9d828fca0774e41b939"));
const demoRequestSchema = objectType({
  name: stringType().trim().min(1),
  contact: stringType().trim().min(1),
  organisation: stringType().trim().max(200).optional(),
  request: stringType().trim().min(1).max(2e3)
});
async function submitDemoRequest(input) {
  const data = demoRequestSchema.parse(input);
  const {
    error
  } = await supabase.from("demo_requests").insert({
    name: data.name,
    contact: data.contact,
    organisation: data.organisation || null,
    request: data.request
  });
  if (error) {
    console.error("Demo request submission failed:", error);
    throw new Error(error.message);
  }
  return {
    success: true
  };
}
export {
  AudioWave as A,
  submitDemoRequest as s
};
