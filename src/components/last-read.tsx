"use client";

import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useSettings } from "@/store/settings";

/** Mencatat halaman yang sedang dibuka sebagai "terakhir dibaca". */
export function TrackLastRead({ title, href, subtitle, quran = false }: { title: string; href: string; subtitle?: string; quran?: boolean }) {
  const setLastRead = useSettings((s) => s.setLastRead);
  const setLastReadQuran = useSettings((s) => s.setLastReadQuran);
  useEffect(() => {
    (quran ? setLastReadQuran : setLastRead)({ title, href, subtitle });
  }, [title, href, subtitle, quran, setLastRead, setLastReadQuran]);
  return null;
}

export function LastReadCards() {
  const { lastRead, lastReadQuran } = useSettings();
  const items = [lastReadQuran && { ...lastReadQuran, kind: "Al-Qur'an" }, lastRead && { ...lastRead, kind: "Amaliyah" }].filter(Boolean) as {
    title: string;
    href: string;
    subtitle?: string;
    kind: string;
  }[];
  if (!items.length) return null;
  return (
    <section className="mt-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-muted">
        <Clock className="size-4" /> Terakhir dibaca
      </h2>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {items.map((it) => (
          <Link key={it.kind} href={it.href} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-card transition hover:border-primary/40">
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-gold">{it.kind}</span>
              <span className="block truncate text-sm font-semibold">{it.title}</span>
              {it.subtitle && <span className="block truncate text-xs text-muted">{it.subtitle}</span>}
            </span>
            <ChevronRight className="size-4 text-muted" />
          </Link>
        ))}
      </div>
    </section>
  );
}
