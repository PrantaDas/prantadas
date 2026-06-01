import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { AlertTriangle, Info, Lightbulb, AlertCircle } from "lucide-react";
import { CodeBlock } from "@/components/blog/code-block";

// ── Prose overrides for MDX content ──────────────────────────────────────────
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children, id }) => (
      <h1
        id={id}
        className="font-display text-3xl md:text-4xl font-bold text-white mt-10 mb-4 scroll-mt-20"
      >
        {children}
      </h1>
    ),
    h2: ({ children, id }) => (
      <h2
        id={id}
        className="font-display text-2xl md:text-3xl font-semibold text-white mt-10 mb-4 scroll-mt-20 pb-2 border-b border-white/8"
      >
        {children}
      </h2>
    ),
    h3: ({ children, id }) => (
      <h3
        id={id}
        className="font-display text-xl md:text-2xl font-semibold text-white/90 mt-8 mb-3 scroll-mt-20"
      >
        {children}
      </h3>
    ),
    h4: ({ children, id }) => (
      <h4
        id={id}
        className="font-display text-lg font-semibold text-white/80 mt-6 mb-2 scroll-mt-20"
      >
        {children}
      </h4>
    ),

    // Paragraphs & text
    p: ({ children }) => (
      <p className="text-white/65 leading-relaxed mb-5 text-base md:text-[16.5px]">
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-white/90">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-white/75">{children}</em>,

    // Links
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-3 decoration-primary/30 hover:decoration-primary transition-colors"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href ?? "#"}
          className="text-primary underline underline-offset-3 decoration-primary/30 hover:decoration-primary transition-colors"
        >
          {children}
        </Link>
      );
    },

    // Lists
    ul: ({ children }) => (
      <ul className="mb-5 space-y-1.5 pl-6 list-none">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-5 space-y-1.5 pl-6 list-decimal list-outside marker:text-primary/50">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-white/65 leading-relaxed relative before:content-['▸'] before:absolute before:-left-5 before:text-primary/60 before:text-xs before:top-1">
        {children}
      </li>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-primary/40 pl-5 py-1 bg-primary/5 rounded-r-xl">
        <div className="text-white/60 italic leading-relaxed">{children}</div>
      </blockquote>
    ),

    // Code inline
    code: ({ children, className }) => {
      // If it has a language class it's a fenced block — let rehype-pretty-code handle it
      if (className) return <code className={className}>{children}</code>;
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-white/8 text-primary font-mono text-[0.85em] border border-white/6">
          {children}
        </code>
      );
    },

    // Code block wrapper (rehype-pretty-code wraps in <figure>)
    pre: ({ children, ...props }) => (
      <CodeBlock {...props}>{children}</CodeBlock>
    ),

    // Table
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm text-left">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-white/4 border-b border-white/8">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 font-semibold text-white/80 font-mono text-xs uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-white/60 border-b border-white/5 last:border-0">
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-white/2 transition-colors">{children}</tr>
    ),

    // Horizontal rule
    hr: () => <hr className="my-10 border-white/8" />,

    ...components,
  };
}

// ── Custom MDX callout components ─────────────────────────────────────────────
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
      <div className="text-white/65 text-sm leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}

export function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
      <div className="text-white/65 text-sm leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}

export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <Lightbulb className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
      <div className="text-white/65 text-sm leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}

export function Danger({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
      <div className="text-white/65 text-sm leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}
