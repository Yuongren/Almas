interface AudioWaveProps {
  bars?: number;
  className?: string;
  variant?: "gold" | "neon" | "mixed";
  /** Speeds up and brightens the wave on hover — use for interactive contexts (buttons, cards). */
  interactive?: boolean;
}

export function AudioWave({ bars = 32, className = "", variant = "mixed", interactive = false }: AudioWaveProps) {
  return (
    <div
      className={`group flex items-center justify-center gap-[3px] h-16 ${className}`}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const color =
          variant === "gold"
            ? "bg-gold"
            : variant === "neon"
            ? "bg-neon"
            : i % 2 === 0
            ? "bg-gold"
            : "bg-neon";
        const height = (30 + Math.sin(i * 0.6) * 35 + 35).toFixed(4);
        return (
          <span
            key={i}
            className={`w-[3px] rounded-full ${color} wave-bar transition-[opacity,filter] duration-300 ${
              interactive ? "group-hover:brightness-125" : ""
            }`}
            style={{
              height: `${height}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: interactive ? "0.7s" : "1.2s",
            }}
          />
        );
      })}
    </div>
  );
}