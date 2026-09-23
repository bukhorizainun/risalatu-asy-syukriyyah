"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type ArabicFont = "amiri" | "scheherazade";

export interface Bookmark {
  id: string;
  title: string;
  href: string;
  subtitle?: string;
  savedAt: number;
}

export interface LastRead {
  title: string;
  href: string;
  subtitle?: string;
  at: number;
}

interface SettingsState {
  theme: Theme;
  arabicSize: number;
  arabicFont: ArabicFont;
  showLatin: boolean;
  showTranslation: boolean;
  qari: string;
  bookmarks: Bookmark[];
  lastRead: LastRead | null;
  lastReadQuran: LastRead | null;
  tasbih: { count: number; target: number; rounds: number };
  setTasbih: (t: Partial<SettingsState["tasbih"]>) => void;
  setTheme: (t: Theme) => void;
  setArabicSize: (n: number) => void;
  setArabicFont: (f: ArabicFont) => void;
  toggleLatin: () => void;
  toggleTranslation: () => void;
  setQari: (q: string) => void;
  toggleBookmark: (b: Omit<Bookmark, "savedAt">) => void;
  isBookmarked: (id: string) => boolean;
  setLastRead: (r: Omit<LastRead, "at">) => void;
  setLastReadQuran: (r: Omit<LastRead, "at">) => void;
}

export const ARABIC_MIN = 22;
export const ARABIC_MAX = 48;

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "system",
      arabicSize: 30,
      arabicFont: "amiri",
      showLatin: true,
      showTranslation: true,
      qari: "05",
      bookmarks: [],
      lastRead: null,
      lastReadQuran: null,
      tasbih: { count: 0, target: 33, rounds: 0 },
      setTasbih: (t) => set((s) => ({ tasbih: { ...s.tasbih, ...t } })),
      setTheme: (theme) => set({ theme }),
      setArabicSize: (n) => set({ arabicSize: Math.min(ARABIC_MAX, Math.max(ARABIC_MIN, n)) }),
      setArabicFont: (arabicFont) => set({ arabicFont }),
      toggleLatin: () => set((s) => ({ showLatin: !s.showLatin })),
      toggleTranslation: () => set((s) => ({ showTranslation: !s.showTranslation })),
      setQari: (qari) => set({ qari }),
      toggleBookmark: (b) =>
        set((s) =>
          s.bookmarks.some((x) => x.id === b.id)
            ? { bookmarks: s.bookmarks.filter((x) => x.id !== b.id) }
            : { bookmarks: [{ ...b, savedAt: Date.now() }, ...s.bookmarks] },
        ),
      isBookmarked: (id) => get().bookmarks.some((x) => x.id === id),
      setLastRead: (r) => set({ lastRead: { ...r, at: Date.now() } }),
      setLastReadQuran: (r) => set({ lastReadQuran: { ...r, at: Date.now() } }),
    }),
    // Dimuat setelah mount (lihat ThemeSync) agar render pertama sama dengan server.
    { name: "risalah-settings", version: 1, skipHydration: true },
  ),
);
