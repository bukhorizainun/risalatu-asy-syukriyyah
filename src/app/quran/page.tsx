import type { Metadata } from "next";
import { Suspense } from "react";
import { QuranBrowser } from "@/components/quran/quran-browser";
import { SURAH_PILIHAN, SURAH_PILIHAN_UMMAH, surahs } from "@/lib/content";
import { JUZ_START } from "@/lib/quran";

export const metadata: Metadata = {
  title: "Al-Qur'an",
  description: "Al-Qur'an 114 surah dan 30 juz lengkap dengan teks Arab, transliterasi, terjemah Indonesia, dan murottal.",
};

export default function QuranPage() {
  const juz = JUZ_START.map(([s, a], i) => ({
    juz: i + 1,
    surah: s,
    ayah: a,
    namaLatin: surahs[s - 1].namaLatin,
  }));
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Al-Qur&apos;an al-Karim</h1>
      <p className="mt-1 text-sm text-muted">114 surah · 30 juz · teks Arab, Latin, terjemah, dan murottal.</p>
      <Suspense>
        <QuranBrowser surahs={surahs} juz={juz} pilihan={SURAH_PILIHAN} pilihanUmmah={SURAH_PILIHAN_UMMAH} />
      </Suspense>
    </div>
  );
}
