"use client";

import { Bookmark, BookmarkCheck, Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { NumberBadge } from "@/components/ornament";
import { FontSizeControl } from "@/components/settings-panel";
import type { Ayah } from "@/lib/quran";
import { QARI } from "@/lib/quran";
import { cn } from "@/lib/utils";
import { useSettings } from "@/store/settings";

export interface AyahBlock {
  surah: { nomor: number; nama: string; namaLatin: string };
  showBismillah: boolean;
  ayat: Ayah[];
}

const BISMILLAH = "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ";

export function AyahList({ blocks, audioFull, context }: { blocks: AyahBlock[]; audioFull?: Record<string, string>; context: string }) {
  const { qari, setQari, showLatin, showTranslation, bookmarks, toggleBookmark, setLastReadQuran } = useSettings();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<string | null>(null); // "s:a" | "full"
  const [paused, setPaused] = useState(false);

  const queue = blocks.flatMap((b) => b.ayat.map((a) => ({ key: `${b.surah.nomor}:${a.nomorAyat}`, src: a.audio[qari] ?? Object.values(a.audio)[0] })));

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => {
      if (playing && playing !== "full") {
        const idx = queue.findIndex((q) => q.key === playing);
        const next = queue[idx + 1];
        if (next) return play(next.key, next.src);
      }
      setPlaying(null);
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  });

  function play(key: string, src: string) {
    const el = audioRef.current;
    if (!el) return;
    el.src = src;
    el.play().catch(() => setPlaying(null));
    setPlaying(key);
    setPaused(false);
    if (key !== "full") document.getElementById(`ayat-${key.replace(":", "-")}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function toggle(key: string, src: string) {
    const el = audioRef.current;
    if (!el) return;
    if (playing === key) {
      if (el.paused) {
        el.play();
        setPaused(false);
      } else {
        el.pause();
        setPaused(true);
      }
    } else play(key, src);
  }

  function stop() {
    audioRef.current?.pause();
    setPlaying(null);
  }

  return (
    <div>
      <audio ref={audioRef} preload="none" className="hidden" />

      <div className="sticky top-16 sm:top-[6.75rem] z-20 -mx-4 border-b border-border/60 bg-background/90 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <select
            value={qari}
            onChange={(e) => {
              setQari(e.target.value);
              stop();
            }}
            className="h-9 min-w-0 flex-1 rounded-full border border-border bg-surface px-3 text-xs font-medium outline-none"
            aria-label="Pilih qari"
          >
            {Object.entries(QARI).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          {audioFull && (
            <button
              type="button"
              onClick={() => toggle("full", audioFull[qari])}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-white dark:text-background"
            >
              {playing === "full" && !paused ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              Surah penuh
            </button>
          )}
          {!audioFull && queue[0] && (
            <button
              type="button"
              onClick={() => (playing ? toggle(playing, "") : play(queue[0].key, queue[0].src))}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-white dark:text-background"
            >
              {playing && !paused ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              Putar berurutan
            </button>
          )}
          {playing && (
            <button type="button" onClick={stop} className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted" aria-label="Hentikan audio">
              <Square className="size-3.5" />
            </button>
          )}
        </div>
        <div className="mt-2">
          <FontSizeControl compact />
        </div>
      </div>

      {blocks.map((b) => (
        <section key={b.surah.nomor} className="mt-4">
          {blocks.length > 1 && (
            <div className="mb-3 mt-6 flex items-center justify-between rounded-2xl bg-primary-soft px-4 py-3">
              <span className="font-semibold text-primary">
                {b.surah.nomor}. {b.surah.namaLatin}
              </span>
              <span className="arabic-title text-xl text-primary">{b.surah.nama}</span>
            </div>
          )}
          {b.showBismillah && (
            <p className="arabic py-3 text-center text-primary" style={{ fontSize: "calc(var(--arabic-size) * 1.05)" }}>
              {BISMILLAH}
            </p>
          )}
          <ol className="divide-y divide-border">
            {b.ayat.map((a) => {
              const key = `${b.surah.nomor}:${a.nomorAyat}`;
              const href = `/quran/${b.surah.nomor}#ayat-${b.surah.nomor}-${a.nomorAyat}`;
              const marked = bookmarks.some((x) => x.id === href);
              const isPlaying = playing === key;
              return (
                <li
                  key={key}
                  id={`ayat-${b.surah.nomor}-${a.nomorAyat}`}
                  className={cn("scroll-mt-40 py-5 transition-colors", isPlaying && "-mx-3 rounded-2xl bg-primary-soft/60 px-3")}
                >
                  <div className="flex items-center gap-1">
                    <NumberBadge n={a.nomorAyat} />
                    <span className="ml-1 text-xs text-muted">
                      QS {b.surah.nomor}:{a.nomorAyat}
                    </span>
                    <div className="ml-auto flex items-center">
                      <button
                        type="button"
                        onClick={() => toggle(key, a.audio[qari] ?? Object.values(a.audio)[0])}
                        className="grid size-9 place-items-center rounded-full text-primary hover:bg-surface-2"
                        aria-label={`Putar ayat ${a.nomorAyat}`}
                      >
                        {isPlaying && !paused ? <Pause className="size-4" /> : <Play className="size-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toggleBookmark({ id: href, href, title: `QS ${b.surah.namaLatin}: ${a.nomorAyat}`, subtitle: a.teksIndonesia.slice(0, 80) });
                          setLastReadQuran({ title: `${b.surah.namaLatin} · ayat ${a.nomorAyat}`, href, subtitle: context });
                        }}
                        className={cn("grid size-9 place-items-center rounded-full hover:bg-surface-2", marked ? "text-gold" : "text-muted")}
                        aria-label={marked ? "Hapus penanda ayat" : "Tandai ayat"}
                        aria-pressed={marked}
                      >
                        {marked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                      </button>
                      <CopyButton
                        label=""
                        className="size-9 justify-center border-0 px-0"
                        text={`${a.teksArab}\n\n${a.teksLatin}\n\n${a.teksIndonesia}\n\n(QS ${b.surah.namaLatin}: ${a.nomorAyat})`}
                      />
                    </div>
                  </div>
                  <p className="arabic mt-3 text-right" style={{ fontSize: "var(--arabic-size)" }}>
                    {a.teksArab}
                  </p>
                  {showLatin && <p className="mt-3 text-[15px] italic leading-relaxed text-primary">{a.teksLatin}</p>}
                  {showTranslation && <p className="mt-2 text-[15px] leading-relaxed text-muted">{a.teksIndonesia}</p>}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
