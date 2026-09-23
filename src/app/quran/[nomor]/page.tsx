import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackLastRead } from "@/components/last-read";
import { AyahList } from "@/components/quran/ayah-list";
import { surahs } from "@/lib/content";
import { getSurah, juzOf } from "@/lib/quran";

export const dynamicParams = false;

export function generateStaticParams() {
  return surahs.map((s) => ({ nomor: String(s.nomor) }));
}

export async function generateMetadata({ params }: PageProps<"/quran/[nomor]">): Promise<Metadata> {
  const { nomor } = await params;
  const s = surahs[Number(nomor) - 1];
  return s ? { title: `Surah ${s.namaLatin}`, description: `${s.namaLatin} (${s.arti}) · ${s.jumlahAyat} ayat, Arab, Latin, terjemah & murottal.` } : {};
}

export default async function SurahPage({ params }: PageProps<"/quran/[nomor]">) {
  const { nomor } = await params;
  const n = Number(nomor);
  if (!Number.isInteger(n) || n < 1 || n > 114) notFound();
  const data = await getSurah(n);
  const meta = surahs[n - 1];

  return (
    <div>
      <TrackLastRead quran title={`Surah ${meta.namaLatin}`} href={`/quran/${n}`} subtitle={`${meta.arti} · ${meta.jumlahAyat} ayat`} />
      <section className="pattern relative overflow-hidden rounded-3xl bg-primary px-5 py-6 text-center text-white dark:bg-primary-soft dark:text-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 dark:text-gold">
          Surah ke-{n} · Juz {juzOf(n, 1)}
        </p>
        <p className="arabic-title mt-2 text-4xl">{meta.nama}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{meta.namaLatin}</h1>
        <p className="mt-1 text-sm text-white/80 dark:text-muted">
          {meta.arti} · {meta.tempatTurun === "Mekah" ? "Makkiyah" : "Madaniyah"} · {meta.jumlahAyat} ayat
        </p>
      </section>

      {data ? (
        <AyahList
          context={`${meta.arti} · ${meta.jumlahAyat} ayat`}
          audioFull={data.audioFull}
          blocks={[{ surah: { nomor: n, nama: meta.nama, namaLatin: meta.namaLatin }, showBismillah: n !== 1 && n !== 9, ayat: data.ayat }]}
        />
      ) : (
        <p className="mt-8 rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted">
          Gagal memuat surah. Periksa koneksi internet lalu muat ulang halaman.
        </p>
      )}

      <nav className="mt-8 flex items-center justify-between gap-2" aria-label="Surah lain">
        {n > 1 ? (
          <Link href={`/quran/${n - 1}`} className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-surface px-4 text-sm font-medium">
            <ChevronLeft className="size-4" /> {surahs[n - 2].namaLatin}
          </Link>
        ) : (
          <span />
        )}
        {n < 114 && (
          <Link href={`/quran/${n + 1}`} className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-surface px-4 text-sm font-medium">
            {surahs[n].namaLatin} <ChevronRight className="size-4" />
          </Link>
        )}
      </nav>
    </div>
  );
}
