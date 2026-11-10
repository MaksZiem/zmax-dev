"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MermaidProps {
  chart: string;
  expandLabel: string;
  closeLabel: string;
  errorLabel: string;
}

const darkQuery = "(prefers-color-scheme: dark)";

export function Mermaid({ chart, expandLabel, closeLabel, errorLabel }: MermaidProps) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let cancelled = false;
    const media = window.matchMedia(darkQuery);

    async function render() {
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: media.matches ? "dark" : "neutral",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      });

      try {
        const result = await mermaid.render(id, chart);
        if (!cancelled) setSvg(result.svg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    }

    render();
    media.addEventListener("change", render);

    return () => {
      cancelled = true;
      media.removeEventListener("change", render);
    };
  }, [chart, id]);

  if (failed) {
    return (
      <figure className="diagram">
        <p className="diagram-error">{errorLabel}</p>
        <pre>
          <code>{chart}</code>
        </pre>
      </figure>
    );
  }

  return (
    <figure className="diagram">
      {svg ? (
        <>
          <button type="button" className="diagram-expand" onClick={() => dialogRef.current?.showModal()}>
            {expandLabel}
          </button>
          <div className="diagram-canvas" dangerouslySetInnerHTML={{ __html: svg }} />
          <dialog
            ref={dialogRef}
            className="diagram-dialog"
            onClick={(event) => {
              if (event.target === dialogRef.current) dialogRef.current.close();
            }}
          >
            <button type="button" className="diagram-close" onClick={() => dialogRef.current?.close()}>
              {closeLabel}
            </button>
            <div className="diagram-dialog-canvas" dangerouslySetInnerHTML={{ __html: svg }} />
          </dialog>
        </>
      ) : (
        <div className="diagram-skeleton" aria-hidden />
      )}
    </figure>
  );
}
