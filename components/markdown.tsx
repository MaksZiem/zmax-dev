import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Dictionary } from "@/lib/i18n";
import { slugify } from "@/lib/slugify";
import { Mermaid } from "./mermaid";

interface HastNode {
  type: string;
  value?: string;
  tagName?: string;
  properties?: { className?: string[] };
  children?: HastNode[];
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function hastText(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(hastText).join("");
}

export function Markdown({ source, dict }: { source: string; dict: Dictionary }) {
  const components: Components = {
    h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
    table: ({ children }) => (
      <div className="table-scroll">
        <table>{children}</table>
      </div>
    ),
    a: ({ href, children }) => (
      <a href={href} {...(href?.startsWith("http") && { target: "_blank", rel: "noreferrer" })}>
        {children}
      </a>
    ),
    pre: ({ node, children }) => {
      const code = (node as HastNode | undefined)?.children?.find((child) => child.tagName === "code");
      const classes = code?.properties?.className ?? [];

      if (classes.includes("language-mermaid")) {
        return (
          <Mermaid
            chart={hastText(code).trim()}
            expandLabel={dict.expand}
            closeLabel={dict.close}
            errorLabel={dict.diagramError}
          />
        );
      }

      const language = classes.find((name) => name.startsWith("language-"))?.slice(9);
      return (
        <pre data-language={language}>
          {children}
        </pre>
      );
    },
  };

  return (
    <div className="md-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
