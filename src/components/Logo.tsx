export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-9 w-9 rounded-xl bg-gold-gradient grid place-items-center shadow-gold">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 12h2M8 8v8M12 5v14M16 8v8M20 12h-2" />
        </svg>
      </div>
      <div className="leading-none">
        <div className="font-display font-bold text-base tracking-tight">Almas <span className="text-gold-gradient">Skika</span></div>
        <div className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mt-0.5">Sound of Kenya</div>
      </div>
    </div>
  );
}
