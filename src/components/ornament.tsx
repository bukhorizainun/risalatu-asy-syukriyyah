import { cn } from "@/lib/utils";

/** Bintang delapan (rub el hizb) minimalis. */
export function Star8({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-4", className)} fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="5" y="5" width="14" height="14" rx="0.5" />
      <rect x="5" y="5" width="14" height="14" rx="0.5" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  );
}

/** Garis pemisah dengan ornamen di tengah. */
export function Divider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-gold/70", className)} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current opacity-40" />
      <Star8 className="size-3.5" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current opacity-40" />
    </div>
  );
}

/** Bingkai nomor ayat / urutan berbentuk bintang. */
export function NumberBadge({ n, className }: { n: number | string; className?: string }) {
  return (
    <span className={cn("relative inline-grid size-9 shrink-0 place-items-center text-primary", className)}>
      <Star8 className="absolute inset-0 size-9 opacity-70" />
      <span className="relative text-[11px] font-semibold tabular-nums">{n}</span>
    </span>
  );
}
