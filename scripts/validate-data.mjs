// Memeriksa konsistensi data di src/data: id unik, rujukan ayat tersedia,
// dan setiap kartu doa memiliki isi. Jalankan: node scripts/validate-data.mjs
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../src/data/", import.meta.url);
const snippets = JSON.parse(readFileSync(new URL("quran-snippets.json", dir), "utf8"));
const skip = new Set(["quran-snippets.json", "surah-index.json", "asmaul-husna.json"]);
const errors = [];
let total = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json") && !skip.has(f))) {
  const cat = JSON.parse(readFileSync(new URL(file, dir), "utf8"));
  const ids = new Set();
  for (const s of cat.sections) {
    if (ids.has(s.id)) errors.push(`${file}: id bagian ganda "${s.id}"`);
    ids.add(s.id);
    for (const e of s.items) {
      total++;
      if (ids.has(e.id)) errors.push(`${file}: id ganda "${e.id}"`);
      ids.add(e.id);
      if (e.kind === "guide") continue;
      const hasBody = e.arabic || e.variants?.length || e.segments?.length || e.link || e.note;
      if (!hasBody) errors.push(`${file}: "${e.id}" tidak memiliki isi`);
      for (const seg of e.segments ?? []) {
        if (!seg.quran) continue;
        const [su, range] = seg.quran.split(":");
        const [from, to] = range.split("-").map(Number);
        for (let a = from; a <= (to || from); a++) {
          if (!snippets[`${su}:${a}`]) errors.push(`${file}: "${e.id}" butuh ayat ${su}:${a} (jalankan fetch-quran-snippets)`);
        }
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK: ${total} entri valid.`);
