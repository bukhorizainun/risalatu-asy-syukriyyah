"use client";

import { Eye, EyeOff, LayoutGrid, List, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { NumberBadge } from "./ornament";

interface Name {
  n: number;
  ar: string;
  latin: string;
  arti: string;
}

const strip = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ’‘'\-\s]/g, "");

export function AsmaulHusnaTable({ names }: { names: Name[] }) {
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [hafalan, setHafalan] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const list = useMemo(() => {
    const t = strip(q);
    return t ? names.filter((x) => strip(`${x.latin}${x.arti}${x.n}`).includes(t)) : names;
  }, [q, names]);

  const reveal = (n: number) =>
    setRevealed((s) => {
      const next = new Set(s);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const hidden = (n: number) => hafalan && !revealed.has(n);

  return (
    <div>
      <div className="sticky top-16 sm:top-[6.75rem] z-20 -mx-4 mt-4 flex items-center gap-2 border-b border-border/60 bg-background/90 px-4 py-2 backdrop-blur-md">
        <label className="flex h-10 flex-1 items-center gap-2 rounded-full border border-border bg-surface px-3">
          <Search className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau arti…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
        </label>
        <button
          type="button"
          onClick={() => {
            setHafalan((h) => !h);
            setRevealed(new Set());
          }}
          className={cn("inline-flex h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold", hafalan ? "border-gold bg-gold-soft text-gold" : "border-border text-muted")}
          aria-pressed={hafalan}
          title="Mode hafalan: sembunyikan arti"
        >
          {hafalan ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          <span className="hidden sm:inline">Hafalan</span>
        </button>
        <button
          type="button"
          onClick={() => setView((v) => (v === "grid" ? "table" : "grid"))}
          className="grid size-10 place-items-center rounded-full border border-border text-muted"
          aria-label={view === "grid" ? "Tampilan tabel" : "Tampilan kartu"}
        >
          {view === "grid" ? <List className="size-4" /> : <LayoutGrid className="size-4" />}
        </button>
      </div>

      {view === "grid" ? (
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {list.map((x) => (
            <button
              key={x.n}
              type="button"
              onClick={() => reveal(x.n)}
              className="flex flex-col items-center rounded-3xl border border-border bg-surface p-4 text-center shadow-card transition hover:border-primary/40"
            >
              <NumberBadge n={x.n} className="size-8" />
              <span className="arabic mt-1 text-3xl leading-[1.9] text-primary">{x.ar}</span>
              <span className="text-sm font-semibold">{x.latin}</span>
              <span className={cn("mt-0.5 text-xs leading-snug text-muted transition", hidden(x.n) && "select-none blur-sm")}>{x.arti}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="w-12 px-3 py-2.5">No</th>
                <th className="px-3 py-2.5">Nama</th>
                <th className="px-3 py-2.5 text-right">Arab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((x) => (
                <tr key={x.n} onClick={() => reveal(x.n)} className="cursor-pointer hover:bg-primary-soft/40">
                  <td className="px-3 py-2.5 text-xs tabular-nums text-muted">{x.n}</td>
                  <td className="px-3 py-2.5">
                    <span className="block font-semibold">{x.latin}</span>
                    <span className={cn("block text-xs text-muted", hidden(x.n) && "select-none blur-sm")}>{x.arti}</span>
                  </td>
                  <td className="arabic px-3 py-1 text-right text-2xl text-primary">{x.ar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {list.length === 0 && <p className="mt-8 text-center text-sm text-muted">Tidak ditemukan.</p>}
    </div>
  );
}
