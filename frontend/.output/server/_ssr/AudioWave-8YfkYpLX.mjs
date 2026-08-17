import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function AudioWave({ bars = 32, className = "", variant = "mixed" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex items-center justify-center gap-[3px] h-16 ${className}`, children: Array.from({ length: bars }).map((_, i) => {
    const color = variant === "gold" ? "bg-gold" : variant === "neon" ? "bg-neon" : i % 2 === 0 ? "bg-gold" : "bg-neon";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `w-[3px] rounded-full ${color}`,
        style: {
          height: `${30 + Math.sin(i * 0.6) * 35 + 35}%`,
          animation: `wave 1.2s ease-in-out ${i * 0.05}s infinite`,
          boxShadow: "0 0 8px currentColor",
          opacity: 0.85
        }
      },
      i
    );
  }) });
}
export {
  AudioWave as A
};
