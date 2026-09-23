import { BookOpen, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import { LastReadCards } from "@/components/last-read";
import { Divider, Star8 } from "@/components/ornament";
import { SURAH_PILIHAN, categories, surahs, totalEntries } from "@/lib/content";

export default function Home() {
  const pilihan = SURAH_PILIHAN.map((n) => surahs.find((s) => s.nomor === n)!);
  return (
    <div>
      <section className="pattern relative overflow-hidden rounded-[2rem] bg-primary px-5 py-7 text-white shadow-lg shadow-primary/20 dark:bg-primary-soft dark:text-foreground dark:shadow-none">
        <Star8 className="absolute -right-10 -top-10 size-44 text-white/10 dark:text-primary/10" />
        <p className="arabic-title text-2xl leading-relaxed text-amber-200 dark:text-gold">لَوَازِمُ الْمُرِيْدِ فِيْ ذِكْرِ رَبِّهِ الْمَجِيْدِ</p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight">Risalatu asy-Syukriyyah</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80 dark:text-muted">
          Buku saku digital amaliyah santri: Al-Qur&apos;an, thaharah, shalat, puasa, zakat, dzikir, tahlil, istighatsah, shalawat, dan doa-doa pilihan.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/quran" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-primary dark:bg-primary dark:text-background">
            <BookOpen className="size-4" /> Baca Al-Qur&apos;an
          </Link>
          <Link href="/ibadah" className="inline-flex h-10 items-center gap-2 rounded-full bg-white/15 px-4 text-sm font-semibold backdrop-blur dark:bg-surface">
            {totalEntries}+ bacaan <ChevronRight className="size-4" />
          </Link>
        </div>
      </section>

      <LastReadCards />

      <section className="mt-7">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold tracking-tight">Surah Pilihan Kitab</h2>
          <Link href="/quran?tab=pilihan" className="text-xs font-semibold text-primary">
            Semua surah
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {pilihan.map((s) => (
            <Link
              key={s.nomor}
              href={`/quran/${s.nomor}`}
              className="flex w-36 shrink-0 flex-col rounded-3xl border border-border bg-surface p-4 shadow-card transition hover:border-primary/40 sm:w-auto"
            >
              <span className="arabic-title text-2xl text-primary">{s.nama}</span>
              <span className="mt-2 text-sm font-semibold">{s.namaLatin}</span>
              <span className="text-xs text-muted">{s.jumlahAyat} ayat</span>
            </Link>
          ))}
        </div>
      </section>

      <Divider className="my-7" />

      <section>
        <h2 className="text-lg font-bold tracking-tight">Amaliyah Ibadah</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/ibadah/${c.slug}`}
              className="group flex flex-col rounded-3xl border border-border bg-surface p-4 shadow-card transition hover:border-primary/40"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-white dark:group-hover:text-background">
                <CategoryIcon name={c.icon} className="size-5" />
              </span>
              <span className="mt-3 text-sm font-semibold leading-snug">{c.title}</span>
              <span className="arabic-title mt-0.5 text-sm text-gold">{c.titleAr}</span>
            </Link>
          ))}
          <Link
            href="/asmaul-husna"
            className="group flex flex-col rounded-3xl border border-border bg-surface p-4 shadow-card transition hover:border-primary/40"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-gold-soft text-gold">
              <Sparkles className="size-5" />
            </span>
            <span className="mt-3 text-sm font-semibold leading-snug">Asmaul Husna</span>
            <span className="arabic-title mt-0.5 text-sm text-gold">الأسماء الحسنى</span>
          </Link>
        </div>
      </section>

      <p className="mt-10 text-center text-xs leading-relaxed text-muted">
        Diadaptasi dari kitab <i>Lawazim al-Murid fi Dzikri Rabbihi al-Majid</i> (Risalah Syukriyyah), <i>Risalah Syukriyah</i>, dan{" "}
        <i>Risalatul Ummah</i>, dilengkapi rujukan Al-Qur&apos;an & hadits.
      </p>
    </div>
  );
}
