interface AudioWaveProps {
  bars?: number;
  className?: string;
  variant?: "gold" | "neon" | "mixed";
}

export function AudioWave({ bars = 32, className = "", variant = "mixed" }: AudioWaveProps) {
  return (
    <div className={`flex items-center justify-center gap-[3px] h-16 ${className}`}>
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
            className={`w-[3px] rounded-full ${color} wave-bar`}
            style={{
              height: `${height}%`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        );
      })}
    </div>
  );
}
