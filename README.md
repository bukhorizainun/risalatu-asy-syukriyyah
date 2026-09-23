# Risalatu asy-Syukriyyah

**Situs:** https://bukhorizainun.github.io/risalatu-asy-syukriyyah/

Buku saku digital amaliyah santri: Al-Qur'an 30 juz, thaharah, shalat, puasa, zakat, haji & qurban, dzikir, tahlil, istighatsah, shalawat, nikah & kelahiran, serta doa-doa pilihan, dengan teks Arab berharakat, transliterasi, dan terjemah Indonesia.

Isi diadaptasi dari:

- **Lawazim al-Murid fi Dzikri Rabbihi al-Majid** (Risalah Syukriyyah, al-Ma'had al-'Ali ats-Tsaqafah), sumber utama
- **Risalah Syukriyah** (edisi ringkas)
- **Risalatul Ummah** (M. Raudho), untuk bacaan tambahan seperti talqin, fidyah, nikah, kelahiran, Rawi Marhaban, dan Ratib

Bacaan yang tidak ada dalam kitab rujukan ditandai **Tambahan** dan diberi rujukan Al-Qur'an atau hadits.

## Fitur

- **Al-Qur'an**: 114 surah, bacaan per juz, dan tab *Surah Pilihan Kitab* (As-Sajdah, Yasin, Al-Waqi'ah, Al-Mulk). Teks, transliterasi, terjemah, dan murottal enam qari dari [equran.id](https://equran.id).
- **Halaman per ibadah**: kartu penjelasan (fiqih ringkas) dan kartu doa. Kartu doa punya pilihan lafaz (misalnya niat munfarid/imam/makmum) dan susunan bacaan berurutan untuk tahlil, istighatsah, dan wirid.
- **Tasbih digital**: tombol mengambang (3/7/11/33/100/∞) dan penghitung mini di setiap bacaan yang berulang.
- Tombol salin, penanda (bookmark), dan catatan *terakhir dibaca*.
- Slider ukuran huruf Arab (A-/A+), pilihan huruf Amiri atau Scheherazade New, tema terang/gelap/sistem, serta tombol tampil/sembunyi Latin dan terjemah.
- Pencarian instan untuk doa, bacaan, dan surah (tekan `/`).
- Tabel interaktif 99 Asmaul Husna dengan mode hafalan.

## Teknologi

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Radix UI · Zustand · Lucide.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # hasil statis di folder out/
```

## Deploy ke GitHub Pages

```bash
npm run deploy
```

Perintah ini membangun situs statis (dengan base path nama repo) lalu menerbitkan folder `out/` ke branch `gh-pages`. Di pengaturan repo, *Settings, Pages* menggunakan sumber branch `gh-pages`.

## Struktur data

Semua isi ada di `src/data/*.json`, satu file per ibadah. Setiap file berisi `sections` dengan `items` berupa:

- kartu penjelasan: `{ "kind": "guide", "title", "paragraphs" | "points" | "steps", "source" }`
- kartu doa: `{ "title", "titleAr", "page", "arabic", "latin", "translation", "repeat", "variants", "segments", "source", "extra" }`

Ayat Al-Qur'an di dalam wirid ditulis sebagai rujukan, misalnya `{ "quran": "2:255" }`, lalu teksnya diambil dari `src/data/quran-snippets.json`.

```bash
node scripts/fetch-quran-snippets.mjs   # perbarui teks ayat yang dirujuk
node scripts/validate-data.mjs          # cek id ganda & rujukan ayat
```
