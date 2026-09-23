"use client";

import { Search, Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LastReadCards } from "@/components/last-read";
import { NumberBadge } from "@/components/ornament";
import type { SurahMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "surah" | "juz" | "pilihan";
const TABS: { value: Tab; label: string }[] = [
  { value: "surah", label: "Surah" },
  { value: "juz", label: "Juz" },
  { value: "pilihan", label: "Surah Pilihan Kitab" },
];

const strip = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function SurahRow({ s, highlight }: { s: SurahMeta; highlight?: boolean }) {
  return (
    <Link
      href={`/quran/${s.nomor}`}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-card transition hover:border-primary/40",
        highlight && "border-gold/40",
      )}
    >
      <NumberBadge n={s.nomor} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          {s.namaLatin}
          {highlight && <Star className="size-3.5 fill-gold text-gold" aria-label="Surah pilihan kitab" />}
        </span>
        <span className="block truncate text-xs text-muted">
          {s.arti} · {s.tempatTurun} · {s.jumlahAyat} ayat
        </span>
      </span>
      <span className="arabic-title text-xl text-primary">{s.nama}</span>
    </Link>
  );
}

export function QuranBrowser({
  surahs,
  juz,
  pilihan,
  pilihanUmmah,
}: {
  surahs: SurahMeta[];
  juz: { juz: number; surah: number; ayah: number; namaLatin: string }[];
  pilihan: number[];
  pilihanUmmah: number[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = (params.get("tab") as Tab) || "surah";
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = strip(q);
    if (!t) return surahs;
    return surahs.filter((s) => strip(`${s.namaLatin}${s.arti}${s.nomor}`).includes(t));
  }, [q, surahs]);

  const setTab = (t: Tab) => router.replace(`${pathname}?tab=${t}`, { scroll: false });

  return (
    <div>
      <LastReadCards />
      <div className="mt-5 grid grid-cols-3 gap-1 rounded-full bg-surface-2 p-1" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "h-9 truncate rounded-full px-2 text-xs font-semibold transition sm:text-sm",
              tab === t.value ? "bg-surface text-primary shadow" : "text-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "surah" && (
        <>
          <label className="mt-4 flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4">
            <Search className="size-4 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau nomor surah…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
          </label>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {filtered.map((s) => (
              <SurahRow key={s.nomor} s={s} highlight={pilihan.includes(s.nomor)} />
            ))}
          </div>
        </>
      )}

      {tab === "juz" && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {juz.map((j) => (
            <Link key={j.juz} href={`/quran/juz/${j.juz}`} className="rounded-2xl border border-border bg-surface p-3 shadow-card transition hover:border-primary/40">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">Juz {j.juz}</span>
              <span className="mt-1 block text-sm font-semibold">{j.namaLatin}</span>
              <span className="block text-xs text-muted">
                mulai QS {j.surah}:{j.ayah}
              </span>
            </Link>
          ))}
        </div>
      )}

      {tab === "pilihan" && (
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-sm text-muted">Surah yang dimuat dalam kitab <i>Lawazim al-Murid</i> (Risalah Syukriyyah) untuk dibaca rutin:</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {pilihan.map((n) => (
                <SurahRow key={n} s={surahs[n - 1]} highlight />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted">Tambahan dari <i>Risalatul Ummah</i>:</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {pilihanUmmah.map((n) => (
                <SurahRow key={n} s={surahs[n - 1]} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
