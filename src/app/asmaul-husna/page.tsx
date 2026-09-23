import type { Metadata } from "next";
import { AsmaulHusnaTable } from "@/components/asmaul-husna-table";
import data from "@/data/asmaul-husna.json";

export const metadata: Metadata = {
  title: "Asmaul Husna",
  description: "99 nama Allah yang indah beserta transliterasi dan artinya.",
};

export default function AsmaulHusnaPage() {
  return (
    <div>
      <section className="pattern relative overflow-hidden rounded-3xl bg-primary px-5 py-6 text-center text-white dark:bg-primary-soft dark:text-foreground">
        <p className="arabic-title text-3xl text-amber-200 dark:text-gold">الْأَسْمَاءُ الْحُسْنٰى</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Asmaul Husna</h1>
        <p className="arabic mx-auto mt-3 max-w-md text-xl leading-loose">
          هُوَ اللّٰهُ الَّذِيْ لَا إِلٰهَ إِلَّا هُوَ
        </p>
        <p className="mt-1 text-sm text-white/80 dark:text-muted">
          “Allah memiliki Asmaul Husna, maka bermohonlah kepada-Nya dengan menyebutnya.” (QS Al-A‘raf: 180)
        </p>
        <p className="mt-2 text-xs text-white/70 dark:text-muted">
          “Sesungguhnya Allah memiliki 99 nama; barang siapa menghafalnya, ia masuk surga.” (HR. Bukhari & Muslim)
        </p>
      </section>
      <AsmaulHusnaTable names={data} />
    </div>
  );
}
