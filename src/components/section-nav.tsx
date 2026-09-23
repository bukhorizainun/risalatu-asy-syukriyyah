"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FontSizeControl } from "./settings-panel";

/** Chip navigasi bagian yang lengket di bawah header + pengatur ukuran font cepat. */
export function SectionNav({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  useEffect(() => {
    const chip = document.getElementById(`chip-${active}`);
    const bar = chip?.parentElement;
    if (chip && bar) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <div className="sticky top-16 sm:top-[6.75rem] z-20 -mx-4 mt-4 border-b border-border/60 bg-background/90 px-4 py-2 backdrop-blur-md">
      <div className="no-scrollbar relative flex gap-1.5 overflow-x-auto">
        {sections.map((s) => (
          <a
            key={s.id}
            id={`chip-${s.id}`}
            href={`#${s.id}`}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition",
              active === s.id ? "bg-primary text-white dark:text-background" : "bg-surface-2 text-muted hover:text-foreground",
            )}
          >
            {s.title}
          </a>
        ))}
      </div>
      <div className="mt-2">
        <FontSizeControl compact />
      </div>
    </div>
  );
}
