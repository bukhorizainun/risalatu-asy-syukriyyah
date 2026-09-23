"use client";

import { Bookmark, BookmarkCheck, ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Guide, Prayer, Segment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSettings } from "@/store/settings";
import { CopyButton } from "./copy-button";
import { TasbihInline } from "./tasbih";

function RepeatBadge({ repeat }: { repeat: number | string }) {
  const n = typeof repeat === "number" ? repeat : Number(repeat);
  if (Number.isFinite(n) && n > 1) return <TasbihInline target={n} />;
  return <span className="inline-flex h-7 items-center rounded-full bg-gold-soft px-2.5 text-xs font-semibold text-gold">{repeat}x</span>;
}

function Texts({ arabic, latin, translation }: { arabic?: string; latin?: string; translation?: string }) {
  const { showLatin, showTranslation } = useSettings();
  return (
    <>
      {arabic && (
        <p className="arabic whitespace-pre-line text-right text-foreground" style={{ fontSize: "var(--arabic-size)" }}>
          {arabic}
        </p>
      )}
      {showLatin && latin && <p className="mt-3 whitespace-pre-line text-[15px] italic leading-relaxed text-primary">{latin}</p>}
      {showTranslation && translation && <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-muted">{translation}</p>}
    </>
  );
}

function SegmentView({ seg }: { seg: Segment }) {
  return (
    <div className="border-t border-dashed border-border py-4 first:border-t-0 first:pt-0">
      {(seg.label || seg.repeat) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          {seg.label ? <span className="text-xs font-semibold uppercase tracking-wide text-gold">{seg.label}</span> : <span />}
          {seg.repeat && <RepeatBadge repeat={seg.repeat} />}
        </div>
      )}
      {seg.note && <p className="mb-2 text-sm text-muted">{seg.note}</p>}
      <Texts arabic={seg.arabic} latin={seg.latin} translation={seg.translation} />
    </div>
  );
}

function plainText(p: Prayer, variantIdx: number) {
  const v = p.variants?.[variantIdx];
  const parts = [p.title];
  if (v) parts.push(v.arabic, v.latin ?? "", v.translation ?? "");
  if (p.arabic) parts.push(p.arabic, p.latin ?? "", p.translation ?? "");
  p.segments?.forEach((s) => parts.push([s.label, s.arabic, s.latin, s.translation].filter(Boolean).join("\n")));
  return parts.filter(Boolean).join("\n\n") + "\n\n— Risalatu asy-Syukriyyah";
}

export function PrayerCard({ prayer, href, subtitle }: { prayer: Prayer; href: string; subtitle?: string }) {
  const [variantIdx, setVariantIdx] = useState(0);
  const { toggleBookmark, bookmarks } = useSettings();
  const bookmarked = bookmarks.some((b) => b.id === href);
  const variant = prayer.variants?.[variantIdx];

  return (
    <article id={prayer.id} className="scroll-mt-24 rounded-3xl border border-border bg-surface p-4 shadow-card sm:p-5">
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold leading-snug">{prayer.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
            {prayer.titleAr && <span className="arabic-title text-sm text-gold">{prayer.titleAr}</span>}
            {prayer.page && <span className="rounded-full bg-surface-2 px-2 py-0.5">Kitab hlm. {prayer.page}</span>}
            {prayer.extra && <span className="rounded-full bg-gold-soft px-2 py-0.5 font-medium text-gold">Tambahan</span>}
          </div>
        </div>
        {prayer.repeat && <RepeatBadge repeat={prayer.repeat} />}
        <button
          type="button"
          onClick={() => toggleBookmark({ id: href, title: prayer.title, href, subtitle })}
          className={cn("grid size-9 shrink-0 place-items-center rounded-full transition hover:bg-surface-2", bookmarked ? "text-gold" : "text-muted")}
          aria-label={bookmarked ? "Hapus dari tersimpan" : "Simpan"}
          aria-pressed={bookmarked}
        >
          {bookmarked ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
        </button>
      </header>

      {prayer.note && (
        <p className="mt-3 flex gap-2 rounded-2xl bg-primary-soft/60 px-3 py-2 text-sm leading-relaxed text-foreground/80">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{prayer.note}</span>
        </p>
      )}

      {prayer.variants && (
        <div className="no-scrollbar -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1" role="tablist">
          {prayer.variants.map((v, i) => (
            <button
              key={v.label}
              type="button"
              role="tab"
              aria-selected={i === variantIdx}
              onClick={() => setVariantIdx(i)}
              className={cn(
                "h-8 shrink-0 rounded-full border px-3 text-xs font-medium transition",
                i === variantIdx ? "border-primary bg-primary text-white dark:text-background" : "border-border text-muted hover:text-foreground",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        {variant && <Texts arabic={variant.arabic} latin={variant.latin} translation={variant.translation} />}
        {(prayer.arabic || prayer.latin) && <Texts arabic={prayer.arabic} latin={prayer.latin} translation={prayer.translation} />}
        {!prayer.arabic && !variant && prayer.translation && <p className="text-[15px] leading-relaxed text-muted">{prayer.translation}</p>}
        {prayer.segments && (
          <div className={cn((prayer.arabic || variant) && "mt-4 border-t border-dashed border-border pt-4")}>
            {prayer.segments.map((s, i) => (
              <SegmentView key={i} seg={s} />
            ))}
          </div>
        )}
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-2">
        <CopyButton text={plainText(prayer, variantIdx)} />
        {prayer.link && (
          <Link href={prayer.link.href} className="inline-flex h-8 items-center gap-1 rounded-full bg-primary-soft px-3 text-xs font-semibold text-primary">
            {prayer.link.label} <ChevronRight className="size-3.5" />
          </Link>
        )}
        {prayer.source && <span className="ml-auto text-[11px] italic text-muted">{prayer.source}</span>}
      </footer>
    </article>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article id={guide.id} className="scroll-mt-24 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary-soft/70 to-surface p-4 sm:p-5">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
        <Info className="size-3.5" /> Penjelasan
      </div>
      <h3 className="mt-1.5 text-[15px] font-semibold leading-snug">{guide.title}</h3>
      <div className="mt-2 space-y-2 text-[14.5px] leading-relaxed text-foreground/85">
        {guide.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
        {guide.points && (
          <ul className="space-y-1.5">
            {guide.points.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        {guide.steps && (
          <ol className="space-y-2">
            {guide.steps.map((p, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-white dark:text-background">{i + 1}</span>
                <span className="pt-0.5">{p}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
      {guide.source && <p className="mt-3 text-[11px] italic text-muted">Rujukan: {guide.source}</p>}
    </article>
  );
}
