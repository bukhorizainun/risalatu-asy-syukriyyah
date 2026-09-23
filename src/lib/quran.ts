// Akses Public Quran API (equran.id v2) + data pembagian 30 juz.

export const QURAN_API = "https://equran.id/api/v2";

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  ayat: Ayah[];
  suratSelanjutnya: false | { nomor: number; namaLatin: string };
  suratSebelumnya: false | { nomor: number; namaLatin: string };
}

export const QARI: Record<string, string> = {
  "01": "Abdullah Al-Juhany",
  "02": "Abdul Muhsin Al-Qasim",
  "03": "Abdurrahman As-Sudais",
  "04": "Ibrahim Al-Dossari",
  "05": "Misyari Rasyid Al-Afasi",
  "06": "Yasser Al-Dosari",
};

const cache = new Map<number, Promise<SurahDetail | null>>();

/** Mengambil satu surah (dengan cache & percobaan ulang) saat build statis. */
export function getSurah(nomor: number): Promise<SurahDetail | null> {
  if (!cache.has(nomor)) cache.set(nomor, fetchSurah(nomor));
  return cache.get(nomor)!;
}

async function fetchSurah(nomor: number, attempts = 4): Promise<SurahDetail | null> {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(`${QURAN_API}/surat/${nomor}`, { cache: "force-cache" });
      if (res.ok) return (await res.json()).data as SurahDetail;
    } catch {}
    await new Promise((r) => setTimeout(r, 500 * i));
  }
  // Gagalkan build daripada menerbitkan halaman surah kosong.
  throw new Error(`Gagal mengambil surah ${nomor} dari ${QURAN_API}`);
}

/** Awal setiap juz (surah, ayat) menurut mushaf standar Madinah. */
export const JUZ_START: [number, number][] = [
  [1, 1], [2, 142], [2, 253], [3, 93], [4, 24], [4, 148], [5, 83], [6, 111], [7, 88], [8, 41],
  [9, 93], [11, 6], [12, 53], [15, 1], [17, 1], [18, 75], [21, 1], [23, 1], [25, 21], [27, 56],
  [29, 46], [33, 31], [36, 28], [39, 32], [41, 47], [46, 1], [51, 31], [58, 1], [67, 1], [78, 1],
];

/** Rentang juz: [surahAwal, ayatAwal] s.d. [surahAkhir, ayatAkhir] (inklusif). */
export function juzRange(juz: number, lastAyahOf: (surah: number) => number) {
  const [s1, a1] = JUZ_START[juz - 1];
  if (juz === 30) return { from: [s1, a1] as const, to: [114, lastAyahOf(114)] as const };
  const [ns, na] = JUZ_START[juz];
  const to = na === 1 ? ([ns - 1, lastAyahOf(ns - 1)] as const) : ([ns, na - 1] as const);
  return { from: [s1, a1] as const, to };
}

export function juzOf(surah: number, ayah: number) {
  let j = 1;
  for (let i = 0; i < JUZ_START.length; i++) {
    const [s, a] = JUZ_START[i];
    if (surah > s || (surah === s && ayah >= a)) j = i + 1;
  }
  return j;
}
