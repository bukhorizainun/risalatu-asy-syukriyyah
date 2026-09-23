"use client";

import { BookmarkX, Bookmark } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/store/settings";

export default function TersimpanPage() {
  const { bookmarks, toggleBookmark } = useSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Tersimpan</h1>
      <p className="mt-1 text-sm text-muted">Doa, bacaan, dan ayat yang Anda tandai. Tersimpan di perangkat ini.</p>
      {bookmarks.length === 0 && (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border p-10 text-center">
          <Bookmark className="size-10 text-muted" />
          <p className="mt-3 font-semibold">Belum ada yang disimpan</p>
          <p className="mt-1 text-sm text-muted">Ketuk ikon penanda pada kartu doa atau ayat untuk menyimpannya di sini.</p>
        </div>
      )}
      <ul className="mt-5 space-y-2">
        {bookmarks.map((b) => (
            <li key={b.id} className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-3 shadow-card">
              <Link href={b.href} className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{b.title}</span>
                {b.subtitle && <span className="block truncate text-xs text-muted">{b.subtitle}</span>}
              </Link>
              <button
                type="button"
                onClick={() => toggleBookmark(b)}
                className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-red-600"
                aria-label={`Hapus ${b.title}`}
              >
                <BookmarkX className="size-4" />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
