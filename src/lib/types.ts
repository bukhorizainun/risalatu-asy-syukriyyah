/** Satu bagian bacaan di dalam wirid/doa panjang (mis. tahlil). */
export interface Segment {
  label?: string;
  arabic?: string;
  latin?: string;
  translation?: string;
  /** Jumlah pengulangan yang dianjurkan, memunculkan tombol tasbih. */
  repeat?: number | string;
  note?: string;
  /** Rujukan ayat, mis. "2:255" atau "2:284-286"; teks diisi otomatis dari quran-snippets.json. */
  quran?: string;
}

/** Varian lafaz untuk bacaan yang sama (mis. niat munfarid/imam/makmum). */
export interface Variant {
  label: string;
  arabic: string;
  latin?: string;
  translation?: string;
}

/** Kartu penjelasan (fiqih, tata cara, keutamaan). */
export interface Guide {
  kind: "guide";
  id: string;
  title: string;
  paragraphs?: string[];
  points?: string[];
  /** Daftar bernomor, cocok untuk tata cara berurutan. */
  steps?: string[];
  source?: string;
}

/** Kartu doa / dzikir / niat. */
export interface Prayer {
  kind?: "prayer";
  id: string;
  title: string;
  titleAr?: string;
  /** Halaman di kitab Lawazim al-Murid / Risalah Syukriyyah. */
  page?: number;
  /** Sumber lain: hadits, ayat, atau kitab. */
  source?: string;
  /** true jika bukan dari kitab rujukan utama (tambahan). */
  extra?: boolean;
  note?: string;
  arabic?: string;
  latin?: string;
  translation?: string;
  repeat?: number | string;
  variants?: Variant[];
  segments?: Segment[];
  /** Tautan internal, mis. ke surah. */
  link?: { href: string; label: string };
}

export type Entry = Prayer | Guide;

export interface Section {
  id: string;
  title: string;
  intro?: string;
  items: Entry[];
}

export interface Category {
  slug: string;
  title: string;
  titleAr: string;
  description: string;
  icon: string;
  sections: Section[];
}

export interface QuranSnippet {
  surah: string;
  arabic: string;
  latin: string;
  translation: string;
}

export interface SurahMeta {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
}

export const isGuide = (e: Entry): e is Guide => e.kind === "guide";
