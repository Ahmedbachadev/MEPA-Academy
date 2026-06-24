import { ImageIcon } from "lucide-react";

export function Logo({
  className = "",
  src,
  variant = "light",
}: {
  className?: string;
  src?: string | null;
  /** light = for white backgrounds, dark = for dark backgrounds (footer) */
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border ${
          isDark ? "border-white/20 bg-white/10" : "border-border bg-surface"
        }`}
        aria-hidden="true"
      >
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon
            className={`h-5 w-5 ${isDark ? "text-white/70" : "text-muted-foreground"}`}
          />
        )}
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-bold tracking-tight ${
            isDark ? "text-white" : "text-brand-blue"
          }`}
        >
          MEPA
        </span>
        <span
          className={`text-[10px] uppercase tracking-[0.18em] ${
            isDark ? "text-white/60" : "text-muted-foreground"
          }`}
        >
          Academy
        </span>
      </div>
    </div>
  );
}
