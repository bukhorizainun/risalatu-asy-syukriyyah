"use client";

import { useEffect } from "react";
import { useSettings } from "@/store/settings";

/** Menyelaraskan preferensi (tema, ukuran & jenis font Arab) ke elemen <html>. */
export function ThemeSync() {
  const { theme, arabicSize, arabicFont } = useSettings();

  useEffect(() => {
    useSettings.persist.rehydrate();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => root.classList.toggle("dark", theme === "dark" || (theme === "system" && mq.matches));
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--arabic-size", `${arabicSize}px`);
    root.style.setProperty("--arabic-font", arabicFont === "scheherazade" ? "var(--font-scheherazade)" : "var(--font-amiri)");
  }, [arabicSize, arabicFont]);

  return null;
}
