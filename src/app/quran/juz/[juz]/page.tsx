import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackLastRead } from "@/components/last-read";
import { AyahList, type AyahBlock } from "@/components/quran/ayah-list";
import { surahs } from "@/lib/content";
import { getSurah, juzRange } from "@/lib/quran";

export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps<"/quran/juz/[juz]">): Promise<Metadata> {
  const { juz } = await params;
  return { title: `Juz ${juz}` };
}

export default async function JuzPage({ params }: PageProps<"/quran/juz/[juz]">) {
  const { juz } = await params;
  const j = Number(juz);
  if (!Number.isInteger(j) || j < 1 || j > 30) notFound();

  const { from, to } = juzRange(j, (s) => surahs[s - 1].jumlahAyat);
  const nums = Array.from({ length: to[0] - from[0] + 1 }, (_, i) => from[0] + i);
  const details = await Promise.all(nums.map((n) => getSurah(n)));

  const blocks: AyahBlock[] = [];
  let failed = false;
  details.forEach((d, i) => {
    const n = nums[i];
    if (!d) {
      failed = true;
      return;
    }
    const start = n === from[0] ? from[1] : 1;
    const end = n === to[0] ? to[1] : d.jumlahAyat;
    blocks.push({
      surah: { nomor: n, nama: d.nama, namaLatin: d.namaLatin },
      showBismillah: start === 1 && n !== 1 && n !== 9,
      ayat: d.ayat.filter((a) => a.nomorAyat >= start && a.nomorAyat <= end),
    });
  });

  const label = `QS ${surahs[from[0] - 1].namaLatin} ${from[1]} – ${surahs[to[0] - 1].namaLatin} ${to[1]}`;

  return (
    <div>
      <TrackLastRead quran title={`Juz ${j}`} href={`/quran/juz/${j}`} subtitle={label} />
      <section className="pattern relative overflow-hidden rounded-3xl bg-primary px-5 py-6 text-center text-white dark:bg-primary-soft dark:text-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 dark:text-gold">Al-Qur&apos;an al-Karim</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Juz {j}</h1>
        <p className="mt-1 text-sm text-white/80 dark:text-muted">{label}</p>
      </section>

      {failed && (
        <p className="mt-6 rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted">
          Sebagian surah gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.
        </p>
      )}
      <AyahList blocks={blocks} context={label} />

      <nav className="mt-8 flex items-center justify-between gap-2" aria-label="Juz lain">
        {j > 1 ? (
          <Link href={`/quran/juz/${j - 1}`} className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-surface px-4 text-sm font-medium">
            <ChevronLeft className="size-4" /> Juz {j - 1}
          </Link>
        ) : (
          <span />
        )}
        {j < 30 && (
          <Link href={`/quran/juz/${j + 1}`} className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-surface px-4 text-sm font-medium">
            Juz {j + 1} <ChevronRight className="size-4" />
          </Link>
        )}
      </nav>
    </div>
  );
}
