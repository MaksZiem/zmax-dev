"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Screenshot } from "@/lib/projects";

interface ScreenshotGalleryProps {
  shots: Screenshot[];
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}

// Opens a screenshot in an in-page dialog (same look as the expanded diagrams) instead of a new tab.
export function ScreenshotGallery({ shots, closeLabel, prevLabel, nextLabel }: ScreenshotGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const shot = shots[current];

  const open = (index: number) => {
    setCurrent(index);
    dialogRef.current?.showModal();
  };
  const step = (delta: number) => setCurrent((i) => (i + delta + shots.length) % shots.length);

  return (
    <>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {shots.map((s, index) => (
          <figure key={s.src} className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[45%]">
            <button
              type="button"
              onClick={() => open(index)}
              className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line"
            >
              <Image src={s.src} alt={s.caption} width={1600} height={1000} className="h-auto w-full" />
            </button>
            <figcaption className="mt-2 text-sm text-muted">{s.caption}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="diagram-dialog screenshot-dialog"
        aria-label={shot?.caption}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
      >
        <div className="flex items-center justify-between gap-4 pb-3">
          <p className="truncate text-sm text-muted">
            <span className="font-mono">
              {current + 1} / {shots.length}
            </span>
            {shot && <span className="ml-3">{shot.caption}</span>}
          </p>
          <div className="flex shrink-0 gap-2">
            {shots.length > 1 && (
              <>
                <button type="button" className="diagram-close" aria-label={prevLabel} onClick={() => step(-1)}>
                  ←
                </button>
                <button type="button" className="diagram-close" aria-label={nextLabel} onClick={() => step(1)}>
                  →
                </button>
              </>
            )}
            <button type="button" className="diagram-close" onClick={() => dialogRef.current?.close()}>
              {closeLabel}
            </button>
          </div>
        </div>
        {shot && (
          <div className="relative h-[calc(100%-2.75rem)]">
            <Image src={shot.src} alt={shot.caption} fill sizes="96vw" className="object-contain" />
          </div>
        )}
      </dialog>
    </>
  );
}
