"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 group/code">
      <pre
        ref={preRef}
        {...props}
        className="overflow-x-auto rounded-xl border border-white/8 bg-[#0d1117] p-5 text-sm font-mono leading-relaxed"
      >
        {children}
      </pre>
      <button
        onClick={copy}
        aria-label="Copy code"
        className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 border border-white/10 text-white/55 hover:text-white/70 hover:bg-white/10 transition-all opacity-0 group-hover/code:opacity-100 focus-visible:opacity-100"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
