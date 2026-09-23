// Mengambil ayat-ayat Al-Qur'an yang dikutip di dalam wirid/tahlil/doa dari equran.id
// lalu menyimpannya ke src/data/quran-snippets.json agar dapat dirujuk offline
// dengan kunci "surah:ayat" (mis. "2:255"). Jalankan: node scripts/fetch-quran-snippets.mjs
import { writeFileSync } from "node:fs";

// surah -> daftar ayat / rentang [awal, akhir]
const RANGES = {
  1: [[1, 7]],
  2: [[1, 5], 163, [183, 185], 196, 201, 255, [284, 286]],
  3: [[8, 9], [18, 20], [26, 27], 38, 97, 102, 173],
  4: [1],
  7: [23],
  9: [60, [128, 129]],
  11: [73],
  17: [[80, 82]],
  20: [[25, 28], 114],
  21: [87, 89],
  22: [[27, 28], 37],
  24: [35],
  25: [74],
  30: [21],
  33: [33, 56, [70, 71]],
  37: [[180, 182]],
  43: [[13, 14]],
  59: [[21, 24]],
  97: [[1, 5]],
  105: [[1, 5]],
  108: [[1, 3]],
  109: [[1, 6]],
  112: [[1, 4]],
  113: [[1, 5]],
  114: [[1, 6]],
};

const result = {};
for (const [surah, spec] of Object.entries(RANGES)) {
  const wanted = new Set();
  for (const s of spec) {
    if (Array.isArray(s)) for (let i = s[0]; i <= s[1]; i++) wanted.add(i);
    else wanted.add(s);
  }
  const res = await fetch(`https://equran.id/api/v2/surat/${surah}`);
  const { data } = await res.json();
  for (const a of data.ayat) {
    if (!wanted.has(a.nomorAyat)) continue;
    result[`${surah}:${a.nomorAyat}`] = {
      surah: data.namaLatin,
      arabic: a.teksArab,
      latin: a.teksLatin,
      translation: a.teksIndonesia,
    };
  }
}
writeFileSync("src/data/quran-snippets.json", JSON.stringify(result, null, 1));
console.log(Object.keys(result).length, "ayat tersimpan");
