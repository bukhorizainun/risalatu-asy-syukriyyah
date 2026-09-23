import type { Metadata, Viewport } from "next";
import { Amiri, Plus_Jakarta_Sans, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeSync } from "@/components/theme-sync";
import { TasbihFab } from "@/components/tasbih";
import { searchIndex } from "@/lib/content";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });
const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-scheherazade",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Risalatu asy-Syukriyyah", template: "%s · Risalatu asy-Syukriyyah" },
  description:
    "Buku saku digital amaliyah santri: Al-Qur'an 30 juz, thaharah, shalat, puasa, zakat, dzikir, tahlil, istighatsah, shalawat, dan doa-doa pilihan. Diadaptasi dari Lawazim al-Murid (Risalah Syukriyyah) & Risalatul Ummah.",
  applicationName: "Risalatu asy-Syukriyyah",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#065f46" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1211" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Menerapkan tema & ukuran font sebelum hydrasi agar tidak berkedip.
const bootScript = `(function(){try{var s=JSON.parse(localStorage.getItem('risalah-settings')||'{}').state||{};var t=s.theme||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');r.style.setProperty('--arabic-size',(s.arabicSize||30)+'px');r.style.setProperty('--arabic-font',s.arabicFont==='scheherazade'?'var(--font-scheherazade)':'var(--font-amiri)');}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const docs = searchIndex.map(({ id, title, subtitle, href, type, haystack }) => ({ id, title, subtitle, href, type, haystack }));
  return (
    <html lang="id" suppressHydrationWarning className={`${jakarta.variable} ${amiri.variable} ${scheherazade.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeSync />
        <AppHeader searchDocs={docs} />
        <main className="mx-auto w-full max-w-3xl px-4 pb-28 pt-4 sm:pb-16">{children}</main>
        <TasbihFab />
        <BottomNav />
      </body>
    </html>
  );
}
