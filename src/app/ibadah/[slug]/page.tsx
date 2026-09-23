import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryIcon } from "@/components/category-icon";
import { TrackLastRead } from "@/components/last-read";
import { Divider } from "@/components/ornament";
import { GuideCard, PrayerCard } from "@/components/prayer-card";
import { SectionNav } from "@/components/section-nav";
import { categories, getCategory } from "@/lib/content";
import { isGuide } from "@/lib/types";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ibadah/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  return c ? { title: c.title, description: c.description } : {};
}

export default async function IbadahPage({ params }: PageProps<"/ibadah/[slug]">) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  return (
    <div>
      <TrackLastRead title={cat.title} href={`/ibadah/${cat.slug}`} subtitle={cat.description} />
      <section className="pattern relative overflow-hidden rounded-3xl bg-primary p-5 text-white dark:bg-primary-soft dark:text-foreground">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15 dark:bg-primary/15 dark:text-primary">
            <CategoryIcon name={cat.icon} className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="arabic-title text-lg text-amber-200 dark:text-gold">{cat.titleAr}</p>
            <h1 className="text-2xl font-bold tracking-tight">{cat.title}</h1>
            <p className="mt-1 text-sm text-white/80 dark:text-muted">{cat.description}</p>
          </div>
        </div>
      </section>

      <SectionNav sections={cat.sections.map((s) => ({ id: s.id, title: s.title }))} />

      <div className="mt-4 space-y-10">
        {cat.sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-36">
            <h2 className="text-lg font-bold tracking-tight">{s.title}</h2>
            {s.intro && <p className="mt-1 text-sm leading-relaxed text-muted">{s.intro}</p>}
            <Divider className="my-3" />
            <div className="space-y-4">
              {s.items.map((e) =>
                isGuide(e) ? (
                  <GuideCard key={e.id} guide={e} />
                ) : (
                  <PrayerCard key={e.id} prayer={e} href={`/ibadah/${cat.slug}#${e.id}`} subtitle={`${cat.title} · ${s.title}`} />
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
