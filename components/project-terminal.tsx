"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { TerminalLine, TerminalLineKind } from "@/lib/terminal-demos";

export type TerminalLabels = {
  hint: string;
  help: string;
  notFound: string;
  opening: string;
  noRepo: string;
};

type Props = {
  slug: string;
  stack: [string, string][];
  demo: TerminalLine[];
  repo: string | null;
  dirs: { frontend: string; backend: string; branch: string } | null;
  labels: TerminalLabels;
};

const KIND_CLASS: Record<TerminalLineKind, string> = {
  cmd: "text-foreground",
  out: "text-muted",
  ok: "text-accent",
  warn: "text-amber-400 dark:text-amber-300",
  dim: "text-muted/70",
};

function Line({ line }: { line: TerminalLine }) {
  return line.kind === "cmd" ? (
    <p className="text-foreground">
      <span className="text-accent">$</span> {line.text}
    </p>
  ) : (
    <p className={KIND_CLASS[line.kind]}>{line.text}</p>
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Terminal on a featured project card: shows the stack, types out a short demo of what the
 * project does once the card is on screen, then accepts commands. `cd frontend` / `cd backend`
 * open those folders of the repo on GitHub.
 */
export function ProjectTerminal({ slug, stack, demo, repo, dirs, labels }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const runId = useRef(0);

  const [shown, setShown] = useState<TerminalLine[]>([]); // demo lines already printed
  const [typing, setTyping] = useState<string | null>(null); // command being typed right now
  const [ready, setReady] = useState(demo.length === 0); // demo finished, prompt accepts input
  const [log, setLog] = useState<TerminalLine[]>([]); // interactive session output
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const historyPos = useRef(-1);

  const playDemo = useCallback(async () => {
    const id = ++runId.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReady(false);
    setShown([]);
    if (still) {
      setShown(demo);
      setReady(true);
      return;
    }
    await sleep(350);
    for (const line of demo) {
      if (runId.current !== id) return;
      if (line.kind === "cmd") {
        for (let i = 1; i <= line.text.length; i++) {
          if (runId.current !== id) return;
          setTyping(line.text.slice(0, i));
          await sleep(18 + Math.random() * 28);
        }
        await sleep(220);
        setTyping(null);
      } else {
        await sleep(260);
      }
      if (runId.current !== id) return;
      setShown((s) => [...s, line]);
    }
    if (runId.current === id) setReady(true);
  }, [demo]);

  // start the demo the first time the card is properly on screen
  useEffect(() => {
    const el = rootRef.current;
    const runs = runId;
    if (!el || demo.length === 0) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          void playDemo();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      runs.current++; // stops a demo that is still typing
    };
  }, [demo, playDemo]);

  // keep the newest line in view inside the panel
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [shown, typing, log, ready]);

  const print = (lines: TerminalLine[]) => setLog((l) => [...l, ...lines]);

  const openUrl = (url: string) => {
    print([{ kind: "ok", text: `→ ${labels.opening} ${url.replace(/^https?:\/\//, "")}` }]);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const run = (raw: string) => {
    const input = raw.trim();
    const echo: TerminalLine = { kind: "cmd", text: input };
    if (!input) return print([echo]);
    const [cmd, ...args] = input.split(/\s+/);
    const arg = (args[0] ?? "").replace(/\/+$/, "");
    const names = dirs ? [dirs.frontend, dirs.backend] : [];

    switch (cmd) {
      case "help":
        return print([
          echo,
          { kind: "out", text: labels.help },
          { kind: "dim", text: "  cd frontend · cd backend · cd .. · ls · open · demo · clear" },
        ]);
      case "ls":
        return print([echo, { kind: "out", text: names.length ? names.map((n) => `${n}/`).join("   ") : "README.md" }]);
      case "clear":
        setShown([]);
        return setLog([]);
      case "demo":
        setLog([]);
        return void playDemo();
      case "open":
      case "git":
        print([echo]);
        return repo ? openUrl(repo) : print([{ kind: "warn", text: labels.noRepo }]);
      case "cd": {
        print([echo]);
        if (!repo) return print([{ kind: "warn", text: labels.noRepo }]);
        if (arg === "" || arg === ".." || arg === "~" || arg === "/") return openUrl(repo);
        // accept both the alias ("frontend") and the real folder name ("ai-notes-frontend")
        const target =
          dirs && (arg === "frontend" || arg === dirs.frontend)
            ? dirs.frontend
            : dirs && (arg === "backend" || arg === dirs.backend)
              ? dirs.backend
              : null;
        if (!target || !dirs) return print([{ kind: "warn", text: `cd: ${arg}: no such directory` }]);
        return openUrl(`${repo}/tree/${dirs.branch}/${target}`);
      }
      default:
        return print([echo, { kind: "warn", text: `${labels.notFound}: ${cmd}` }]);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) history.current.push(value.trim());
      historyPos.current = -1;
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const h = history.current;
      if (!h.length) return;
      e.preventDefault();
      const pos =
        e.key === "ArrowUp"
          ? historyPos.current < 0
            ? h.length - 1
            : Math.max(0, historyPos.current - 1)
          : historyPos.current < 0
            ? -1
            : historyPos.current + 1;
      historyPos.current = pos >= h.length ? -1 : pos;
      setValue(historyPos.current < 0 ? "" : h[historyPos.current]);
    } else if (e.key === "Tab" && dirs) {
      // complete "cd fr" -> "cd frontend"
      const m = value.match(/^cd\s+(\S*)$/);
      if (!m) return;
      const hit = ["frontend", "backend"].find((d) => d.startsWith(m[1]) && d !== m[1]);
      if (hit) {
        e.preventDefault();
        setValue(`cd ${hit}`);
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative z-10 flex h-full cursor-text flex-col overflow-hidden rounded-2xl border border-line bg-background/70 font-mono text-[13px] leading-relaxed"
      onClick={() => {
        if (ready && !window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
      }}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="ml-3 text-xs text-muted">~/{slug}</span>
      </div>

      <div ref={bodyRef} className="terminal-body flex-1 space-y-1.5 overflow-y-auto whitespace-pre-wrap p-5">
        <p className="text-foreground">
          <span className="text-accent">$</span> cat stack
        </p>
        <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 pb-2 text-muted">
          {stack.map(([group, items]) => (
            <div key={group} className="contents">
              <dt className="text-foreground/70">{group}</dt>
              <dd className="truncate">{items}</dd>
            </div>
          ))}
        </dl>

        {shown.map((line, i) => (
          <Line key={`d${i}`} line={line} />
        ))}
        {typing !== null && (
          <p className="text-foreground">
            <span className="text-accent">$</span> {typing}
            <span className="terminal-caret ml-0.5" aria-hidden="true" />
          </p>
        )}
        {log.map((line, i) => (
          <Line key={`l${i}`} line={line} />
        ))}

        {ready && (
          <label className="flex items-center gap-2 pt-1">
            <span className="text-accent">$</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={labels.hint}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label={`terminal ~/${slug}`}
              className="min-w-0 flex-1 bg-transparent text-foreground caret-accent outline-none placeholder:text-muted/60"
            />
          </label>
        )}
      </div>
    </div>
  );
}
