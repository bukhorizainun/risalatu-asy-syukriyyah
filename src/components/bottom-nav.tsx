"use client";

import { BookMarked, BookOpen, Home, LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Beranda", icon: Home, match: (p: string) => p === "/" },
  { href: "/quran", label: "Al-Qur'an", icon: BookOpen, match: (p: string) => p.startsWith("/quran") },
  { href: "/ibadah", label: "Ibadah", icon: LayoutGrid, match: (p: string) => p.startsWith("/ibadah") },
  { href: "/asmaul-husna", label: "Asmaul Husna", icon: Sparkles, match: (p: string) => p.startsWith("/asmaul-husna") },
  { href: "/tersimpan", label: "Tersimpan", icon: BookMarked, match: (p: string) => p.startsWith("/tersimpan") },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden" aria-label="Navigasi utama">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {NAV.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[10.5px] font-medium", active ? "text-primary" : "text-muted")}
                aria-current={active ? "page" : undefined}
              >
                <span className={cn("grid h-7 w-12 place-items-center rounded-full transition", active && "bg-primary-soft")}>
                  <Icon className="size-5" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Navigasi horizontal untuk layar lebar (di bawah header). */
export function TopNavLinks() {
  const pathname = usePathname();
  return (
    <nav className="no-scrollbar -mx-4 hidden gap-1 overflow-x-auto px-4 sm:flex" aria-label="Navigasi utama">
      {NAV.map(({ href, label, match }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition",
            match(pathname) ? "bg-primary-soft text-primary" : "text-muted hover:text-foreground",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
