import type { Category, Entry, Prayer, QuranSnippet, Segment, SurahMeta } from "./types";
import { isGuide } from "./types";

import thaharah from "@/data/thaharah.json";
import shalat from "@/data/shalat.json";
import puasa from "@/data/puasa.json";
import zakat from "@/data/zakat.json";
import haji from "@/data/haji-qurban.json";
import dzikir from "@/data/dzikir.json";
import doaHarian from "@/data/doa-harian.json";
import shalawat from "@/data/shalawat.json";
import tahlil from "@/data/tahlil.json";
import keluarga from "@/data/keluarga.json";
import doaKhusus from "@/data/doa-khusus.json";
import snippetsJson from "@/data/quran-snippets.json";
import surahIndex from "@/data/surah-index.json";

const snippets = snippetsJson as Record<string, QuranSnippet>;

/** Urutan tampil kategori ibadah di beranda & navigasi. */
const RAW = [thaharah, shalat, puasa, zakat, haji, dzikir, doaHarian, shalawat, tahlil, keluarga, doaKhusus] as unknown as Category[];

/** "2:284-286" -> segmen per ayat dengan teks dari quran-snippets.json */
function expandQuran(seg: Segment): Segment[] {
  if (!seg.quran) return [seg];
  const [surah, range] = seg.quran.split(":");
  const [from, to] = range.split("-").map(Number);
  const out: Segment[] = [];
  for (let a = from; a <= (to || from); a++) {
    const s = snippets[`${surah}:${a}`];
    if (!s) continue;
    out.push({
      label: a === from ? (seg.label ?? `QS. ${s.surah}: ${seg.quran.split(":")[1]}`) : undefined,
      arabic: `${s.arabic} ﴿${toArabicDigits(a)}﴾`,
      latin: s.latin,
      translation: s.translation,
      repeat: a === (to || from) ? seg.repeat : undefined,
      note: a === from ? seg.note : undefined,
    });
  }
  return out;
}

export function toArabicDigits(n: number | string) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

function resolveEntry(e: Entry): Entry {
  if (isGuide(e)) return e;
  const p: Prayer = { ...e };
  if (p.segments) p.segments = p.segments.flatMap(expandQuran);
  return p;
}

export const categories: Category[] = RAW.map((c) => ({
  ...c,
  sections: c.sections.map((s) => ({ ...s, items: s.items.map(resolveEntry) })),
}));

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const surahs = surahIndex as SurahMeta[];

/** Surah yang secara khusus dimuat dalam kitab Lawazim al-Murid. */
export const SURAH_PILIHAN = [32, 36, 56, 67];
/** Surah tambahan yang dimuat dalam Risalatul Ummah. */
export const SURAH_PILIHAN_UMMAH = [18, 55];

export interface SearchDoc {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "doa" | "penjelasan" | "surah";
  haystack: string;
}

const strip = (s = "") => s.toLowerCase().normalize("NFD").replace(/[̀-ًͯ-ْٰ’‘'`-]/g, "");

export const searchIndex: SearchDoc[] = [
  ...categories.flatMap((c) =>
    c.sections.flatMap((s) =>
      s.items.map((e) => ({
        id: `${c.slug}/${e.id}`,
        title: e.title,
        subtitle: `${c.title} · ${s.title}`,
        href: `/ibadah/${c.slug}#${e.id}`,
        type: isGuide(e) ? ("penjelasan" as const) : ("doa" as const),
        haystack: strip([e.title, isGuide(e) ? "" : (e.titleAr ?? ""), s.title, c.title].join(" ")),
      })),
    ),
  ),
  ...surahs.map((s) => ({
    id: `surah/${s.nomor}`,
    title: `${s.nomor}. ${s.namaLatin}`,
    subtitle: `${s.arti} · ${s.jumlahAyat} ayat`,
    href: `/quran/${s.nomor}`,
    type: "surah" as const,
    haystack: strip(`${s.namaLatin} ${s.nama} ${s.arti} surah surat ${s.nomor}`),
  })),
];

export function search(q: string, limit = 30) {
  const terms = strip(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return searchIndex.filter((d) => terms.every((t) => d.haystack.includes(t))).slice(0, limit);
}

export const totalEntries = categories.reduce((n, c) => n + c.sections.reduce((m, s) => m + s.items.length, 0), 0);
