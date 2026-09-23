"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({ text, label = "Salin", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  }
  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted transition hover:border-primary/40 hover:text-primary",
        done && "border-primary/40 text-primary",
        className,
      )}
      aria-label={label || "Salin"}
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {label && (done ? "Tersalin" : label)}
    </button>
  );
}
