import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import { categories } from "@/lib/content";

export const metadata: Metadata = { title: "Amaliyah Ibadah" };

export default function IbadahIndex() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Amaliyah Ibadah</h1>
      <p className="mt-1 text-sm text-muted">Penjelasan singkat dan bacaan setiap ibadah, disusun seperti buku saku.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {categories.map((c) => {
          const count = c.sections.reduce((n, s) => n + s.items.length, 0);
          return (
            <Link
              key={c.slug}
              href={`/ibadah/${c.slug}`}
              className="group flex gap-4 rounded-3xl border border-border bg-surface p-4 shadow-card transition hover:border-primary/40"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-white dark:group-hover:text-background">
                <CategoryIcon name={c.icon} className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{c.title}</span>
                  <span className="arabic-title text-sm text-gold">{c.titleAr}</span>
                </span>
                <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{c.description}</span>
                <span className="mt-1.5 block text-xs font-medium text-primary">{count} bacaan & penjelasan</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
