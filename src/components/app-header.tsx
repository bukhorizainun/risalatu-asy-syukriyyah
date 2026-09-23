"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { SearchDialog, type SearchDocLite } from "./search-dialog";
import { SettingsPanel } from "./settings-panel";
import { Star8 } from "./ornament";
import { TopNavLinks } from "./bottom-nav";

export function AppHeader({ searchDocs }: { searchDocs: SearchDocLite[] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-white dark:text-background">
            <Star8 className="size-5" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[15px] font-bold tracking-tight">Risalatu asy-Syukriyyah</span>
            <span className="arabic-title block truncate text-xs text-gold">الرسالة الشكرية</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <SearchDialog
            docs={searchDocs}
            trigger={
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-full text-muted transition hover:text-primary sm:w-56 sm:border sm:border-border sm:bg-surface sm:px-3"
                aria-label="Cari"
              >
                <Search className="mx-auto size-5 sm:mx-0 sm:size-4" />
                <span className="hidden text-sm sm:inline">Cari doa / surah…</span>
                <kbd className="ml-auto hidden rounded border border-border px-1.5 text-[10px] sm:inline">/</kbd>
              </button>
            }
          />
          <SettingsPanel />
        </div>
      </div>
      <div className="mx-auto hidden max-w-3xl px-4 pb-2 sm:block">
        <TopNavLinks />
      </div>
    </header>
  );
}
