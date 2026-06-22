export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg shadow-blue">
        <div className="absolute inset-0 bg-gradient-brand" />
        <span className="relative font-display text-lg font-bold tracking-tight text-white">M</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-foreground">MEPA</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Academy</span>
      </div>
    </div>
  );
}
