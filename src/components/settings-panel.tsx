"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Slider from "@radix-ui/react-slider";
import { Monitor, Moon, Settings2, Sun, X } from "lucide-react";
import { ARABIC_MAX, ARABIC_MIN, useSettings, type Theme } from "@/store/settings";
import { cn } from "@/lib/utils";

export function FontSizeControl({ compact = false }: { compact?: boolean }) {
  const { arabicSize, setArabicSize } = useSettings();
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setArabicSize(arabicSize - 2)}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-sm font-semibold text-muted hover:text-primary"
        aria-label="Perkecil teks Arab"
      >
        A-
      </button>
      <Slider.Root
        className="relative flex h-5 flex-1 touch-none select-none items-center"
        min={ARABIC_MIN}
        max={ARABIC_MAX}
        step={1}
        value={[arabicSize]}
        onValueChange={([v]) => setArabicSize(v)}
        aria-label="Ukuran font Arab"
      >
        <Slider.Track className="relative h-1.5 grow rounded-full bg-surface-2">
          <Slider.Range className="absolute h-full rounded-full bg-primary-strong" />
        </Slider.Track>
        <Slider.Thumb className="block size-5 rounded-full border-2 border-primary-strong bg-surface shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20" />
      </Slider.Root>
      <button
        type="button"
        onClick={() => setArabicSize(arabicSize + 2)}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-base font-semibold text-muted hover:text-primary"
        aria-label="Perbesar teks Arab"
      >
        A+
      </button>
      {!compact && <span className="w-10 text-right text-xs tabular-nums text-muted">{arabicSize}px</span>}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={onChange} className="flex w-full items-center justify-between py-2.5 text-sm">
      <span>{label}</span>
      <span className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-primary-strong" : "bg-surface-2 ring-1 ring-border")}>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
    </button>
  );
}

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
];

export function SettingsPanel() {
  const s = useSettings();
  return (
    <Dialog.Root>
      <Dialog.Trigger className="grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-primary" aria-label="Pengaturan tampilan">
        <Settings2 className="size-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85dvh] max-w-md overflow-y-auto rounded-t-3xl border border-border bg-surface p-5 pb-8 shadow-2xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Pengaturan Tampilan</Dialog.Title>
            <Dialog.Close className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2" aria-label="Tutup">
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Atur tema, ukuran huruf Arab, dan teks yang ditampilkan.</Dialog.Description>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted">Tema</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => s.setTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl border py-3 text-xs font-medium transition",
                  s.theme === value ? "border-primary bg-primary-soft text-primary" : "border-border text-muted hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Ukuran Teks Arab</p>
          <div className="mt-3">
            <FontSizeControl />
          </div>
          <p className="arabic mt-3 rounded-2xl bg-surface-2 px-4 py-2 text-center" style={{ fontSize: "var(--arabic-size)" }}>
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Jenis Huruf Arab</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                ["amiri", "Amiri", "var(--font-amiri)"],
                ["scheherazade", "Scheherazade", "var(--font-scheherazade)"],
              ] as const
            ).map(([v, label, font]) => (
              <button
                key={v}
                type="button"
                onClick={() => s.setArabicFont(v)}
                className={cn(
                  "rounded-2xl border px-3 py-2 transition",
                  s.arabicFont === v ? "border-primary bg-primary-soft text-primary" : "border-border text-muted",
                )}
              >
                <span className="block text-2xl" style={{ fontFamily: font }} dir="rtl">
                  سُبْحَانَ اللّٰهِ
                </span>
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Tampilkan</p>
          <div className="mt-1 divide-y divide-border">
            <Toggle checked={s.showLatin} onChange={s.toggleLatin} label="Transliterasi Latin" />
            <Toggle checked={s.showTranslation} onChange={s.toggleTranslation} label="Terjemah Indonesia" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
