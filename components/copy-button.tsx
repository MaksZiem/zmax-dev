"use client";

import { useState } from "react";

/** Copies `value` to the clipboard and briefly confirms it. */
export function CopyButton({ value, label, doneLabel }: { value: string; label: string; doneLabel: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      // clipboard blocked (e.g. insecure context): the mailto link next to it still works
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-foreground hover:text-foreground"
    >
      <span aria-live="polite">{done ? doneLabel : label}</span>
    </button>
  );
}
