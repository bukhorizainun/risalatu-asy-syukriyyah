"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { useSettings } from "@/store/settings";
import { cn } from "@/lib/utils";
import { Star8 } from "./ornament";

const TARGETS = [3, 7, 11, 33, 100, 0] as const;

function buzz(ms: number | number[]) {
  try {
    navigator.vibrate?.(ms);
  } catch {}
}

/** Lingkaran progres + angka hitungan. */
function Ring({ count, target, size = 200 }: { count: number; target: number; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const pct = target ? (count % target === 0 && count > 0 ? 1 : (count % target) / target) : 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--primary-strong)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        className="transition-[stroke-dashoffset] duration-200"
      />
    </svg>
  );
}

/** Penghitung kecil di dalam kartu dzikir (mis. 33x). */
export function TasbihInline({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const done = count >= target;
  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => {
          if (done) return;
          const n = count + 1;
          setCount(n);
          buzz(n === target ? [40, 60, 40] : 12);
        }}
        className={cn(
          "inline-flex h-8 min-w-24 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold tabular-nums transition active:scale-95",
          done ? "bg-primary text-white dark:text-background" : "bg-primary-soft text-primary hover:bg-primary/15",
        )}
        aria-label={`Tasbih ${count} dari ${target}`}
      >
        <Star8 className="size-3.5" />
        {count}/{target}
      </button>
      {count > 0 && (
        <button type="button" onClick={() => setCount(0)} className="grid size-8 place-items-center rounded-full text-muted hover:text-primary" aria-label="Ulangi hitungan">
          <RotateCcw className="size-3.5" />
        </button>
      )}
    </div>
  );
}

/** Tombol tasbih digital mengambang + panel penghitung besar. */
export function TasbihFab() {
  const [open, setOpen] = useState(false);
  const { tasbih, setTasbih } = useSettings();
  const { count, target, rounds } = tasbih;
  const setCount = (n: number) => setTasbih({ count: n });
  const setTarget = (n: number) => setTasbih({ target: n });
  const setRounds = (fn: (r: number) => number) => setTasbih({ rounds: fn(rounds) });

  function tap() {
    const n = count + 1;
    if (target && n >= target) {
      setRounds((r) => r + 1);
      setCount(0);
      buzz([50, 70, 50]);
    } else {
      setCount(n);
      buzz(12);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed bottom-24 right-4 z-40 grid size-14 place-items-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition hover:scale-105 active:scale-95 dark:text-background sm:bottom-6"
          aria-label="Buka tasbih digital"
        >
          <Star8 className="size-6" />
          {(count > 0 || rounds > 0) && (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-gold px-1 text-[10px] font-bold leading-5 text-white tabular-nums">
              {count}
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-3xl border border-border bg-surface p-5 pb-8 shadow-2xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Tasbih Digital</Dialog.Title>
            <Dialog.Close className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2" aria-label="Tutup">
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Ketuk lingkaran untuk menambah hitungan dzikir.</Dialog.Description>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {TARGETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTarget(t);
                  setCount(0);
                  setRounds(() => 0);
                }}
                className={cn(
                  "h-8 rounded-full border px-3 text-xs font-semibold transition",
                  target === t ? "border-primary bg-primary text-white dark:text-background" : "border-border text-muted hover:text-primary",
                )}
              >
                {t ? `${t}x` : "∞"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={tap}
            className="relative mx-auto mt-5 grid size-52 select-none place-items-center rounded-full transition active:scale-[0.97]"
            aria-label="Tambah hitungan"
          >
            <span className="absolute inset-0">
              <Ring count={count} target={target} size={208} />
            </span>
            <span className="absolute inset-5 rounded-full bg-primary-soft" />
            <span className="relative text-center">
              <span className="block text-5xl font-bold tabular-nums text-primary">{count}</span>
              <span className="mt-1 block text-xs text-muted">{target ? `dari ${target}` : "tanpa batas"}</span>
            </span>
          </button>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-muted">
              Putaran: <b className="text-foreground tabular-nums">{rounds}</b>
            </span>
            <button
              type="button"
              onClick={() => {
                setCount(0);
                setRounds(() => 0);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-primary"
            >
              <RotateCcw className="size-3.5" /> Reset
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
