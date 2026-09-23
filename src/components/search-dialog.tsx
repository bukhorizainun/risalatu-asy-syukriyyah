"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { BookOpen, FileText, HandHeart, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface SearchDocLite {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "doa" | "penjelasan" | "surah";
  haystack: string;
}

const strip = (s = "") => s.toLowerCase().normalize("NFD").replace(/[̀-ًͯ-ْٰ’‘'`-]/g, "");

const ICON = { doa: HandHeart, penjelasan: FileText, surah: BookOpen };
const SUGGEST = ["Yasin", "Tahlil", "Qunut", "Wudhu", "Istighatsah", "Nariyah", "Zakat", "Ayat Kursi"];

export function SearchDialog({ docs, trigger }: { docs: SearchDocLite[]; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    const terms = strip(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return docs
      .filter((d) => terms.every((t) => d.haystack.includes(t)))
      .sort((a, b) => Number(strip(b.title).startsWith(terms[0])) - Number(strip(a.title).startsWith(terms[0])))
      .slice(0, 40);
  }, [q, docs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target instanceof HTMLInputElement))) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQ("");
    router.push(href);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-3 top-3 z-50 mx-auto flex max-h-[80dvh] max-w-xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl sm:top-20">
          <Dialog.Title className="sr-only">Cari doa, bacaan, atau surah</Dialog.Title>
          <Dialog.Description className="sr-only">Ketik nama doa, bacaan, atau surah.</Dialog.Description>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="size-5 shrink-0 text-muted" />
            <input
              autoFocus
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
                if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
                if (e.key === "Enter" && results[active]) go(results[active].href);
              }}
              placeholder="Cari doa, bacaan, atau surah…"
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
            />
            <Dialog.Close className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2" aria-label="Tutup">
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <div className="overflow-y-auto p-2">
            {!q && (
              <div className="p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pencarian populer</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SUGGEST.map((s) => (
                    <button key={s} type="button" onClick={() => { setQ(s); setActive(0); }} className="rounded-full bg-surface-2 px-3 py-1.5 text-sm hover:text-primary">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {q && results.length === 0 && <p className="p-6 text-center text-sm text-muted">Tidak ditemukan untuk “{q}”.</p>}
            <ul>
              {results.map((r, i) => {
                const Icon = ICON[r.type];
                return (
                  <li key={r.id}>
                    <Link
                      href={r.href}
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                      }}
                      onMouseEnter={() => setActive(i)}
                      className={cn("flex items-center gap-3 rounded-2xl px-3 py-2.5", i === active && "bg-primary-soft")}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{r.title}</span>
                        <span className="block truncate text-xs text-muted">{r.subtitle}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
