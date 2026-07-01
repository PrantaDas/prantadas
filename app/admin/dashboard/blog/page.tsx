"use client";

import { useState, useTransition } from "react";
import {
  createBlogPost,
  parseMDXContent,
  type CreatePostInput,
  type ParsedMDX,
} from "@/app/actions/admin";
import { toast } from "sonner";
import {
  PenLine, Eye, Code2, Loader2, CheckCircle2, Tag, Calendar,
  AlignLeft, Type, FileText, Sparkles, ClipboardPaste, ArrowRight,
  RefreshCw, Globe, EyeOff,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-white/4 border border-white/8 text-white/80 text-sm placeholder:text-white/48 focus:outline-none focus:border-primary/40 focus:bg-white/6 transition-colors";

const today = new Date().toISOString().split("T")[0];

const EMPTY_FORM: CreatePostInput = {
  title: "", description: "", excerpt: "", date: today,
  tags: "", featured: false, status: "published", content: "",
};

const MDX_TEMPLATE = `## Introduction

Write your introduction here...

## Main Content

Your main content goes here.

\`\`\`typescript
const example = { key: "value" };
\`\`\`

## Conclusion

Wrap up your article here.
`;

function Toggle({
  checked, onChange, label, sub,
  onIcon, offIcon,
}: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; sub?: string;
  onIcon?: React.ReactNode; offIcon?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative flex-shrink-0" onClick={() => onChange(!checked)}>
        <div className={cn(
          "w-10 h-6 rounded-full border transition-colors",
          checked ? "bg-primary/30 border-primary/40" : "bg-white/5 border-white/10",
        )}>
          <div className={cn(
            "absolute top-1 w-4 h-4 rounded-full transition-all",
            checked ? "left-5 bg-primary" : "left-1 bg-white/30",
          )} />
        </div>
      </div>
      <div className="flex-1">
        <span className="text-sm text-white/74 font-mono">{label}</span>
        {sub && <span className="text-xs text-white/52 font-mono ml-2">{sub}</span>}
      </div>
      {checked ? onIcon : offIcon}
    </label>
  );
}

function Field({ label, icon: Icon, children }: {
  label: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-mono text-white/62 uppercase tracking-wider mb-2">
        <Icon className="w-3.5 h-3.5" />{label}
      </label>
      {children}
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ slug, onReset }: { slug: string; onReset: () => void }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </div>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Post Saved!</h2>
      <p className="text-white/62 font-mono text-sm mb-6">/blog/{slug}</p>
      <div className="flex gap-3">
        <Link href={`/blog/${slug}`} target="_blank"
          className="px-5 py-2.5 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors">
          View Post
        </Link>
        <button onClick={onReset}
          className="px-5 py-2.5 rounded-xl border border-white/8 text-white/74 text-sm hover:border-white/20 transition-colors">
          Write Another
        </button>
      </div>
    </div>
  );
}

// ── Manual form ───────────────────────────────────────────────────────────────
function ManualForm({
  form, setForm, onSubmit, isPending,
}: {
  form: CreatePostInput;
  setForm: React.Dispatch<React.SetStateAction<CreatePostInput>>;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}) {
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  const set = (key: keyof CreatePostInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Frontmatter */}
      <div className="p-5 rounded-2xl border border-white/6 bg-white/2 space-y-4">
        <p className="text-[10px] font-mono text-white/48 uppercase tracking-widest">Frontmatter</p>

        <Field label="Title" icon={Type}>
          <input value={form.title} onChange={set("title")} placeholder="Article title…" required className={inputClass} />
        </Field>

        <Field label="Description" icon={AlignLeft}>
          <input value={form.description} onChange={set("description")} placeholder="Short description for SEO & cards…" className={inputClass} />
        </Field>

        <Field label="Excerpt" icon={FileText}>
          <input value={form.excerpt} onChange={set("excerpt")} placeholder="Longer excerpt for blog card…" className={inputClass} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Date" icon={Calendar}>
            <input type="date" value={form.date} onChange={set("date")} className={inputClass} />
          </Field>
          <Field label="Tags (comma separated)" icon={Tag}>
            <input value={form.tags} onChange={set("tags")} placeholder="Node.js, TypeScript, Backend" className={inputClass} />
          </Field>
        </div>

        <div className="space-y-3 pt-1">
          <Toggle
            checked={form.featured} onChange={(v) => setForm((p) => ({ ...p, featured: v }))}
            label="Featured post" sub="(shown at top of blog page)"
            onIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
            offIcon={<Sparkles className="w-3.5 h-3.5 text-white/45" />}
          />
          <Toggle
            checked={form.status === "published"}
            onChange={(v) => setForm((p) => ({ ...p, status: v ? "published" : "draft" }))}
            label={form.status === "published" ? "Published — visible to readers" : "Draft — hidden from public"}
            onIcon={<Globe className="w-3.5 h-3.5 text-emerald-400" />}
            offIcon={<EyeOff className="w-3.5 h-3.5 text-white/52" />}
          />
        </div>
      </div>

      {/* MDX editor */}
      <div className="rounded-2xl border border-white/6 bg-[#0d1117] overflow-hidden">
        <div className="flex items-center gap-1 px-4 py-2.5 border-b border-white/6 bg-[#161b22]">
          {(["write", "preview"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setEditorTab(t)}
              className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors",
                editorTab === t ? "bg-white/8 text-white/80" : "text-white/55 hover:text-white/74")}>
              {t === "write" ? <Code2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-xs text-white/48 font-mono">MDX</span>
        </div>
        {editorTab === "write" ? (
          <textarea value={form.content} onChange={set("content")} rows={26}
            placeholder="Write your MDX content here…"
            className="w-full bg-transparent p-5 text-sm font-mono text-white/70 placeholder:text-white/45 focus:outline-none resize-none leading-7" />
        ) : (
          <div className="p-5 min-h-[400px]">
            <pre className="text-sm font-mono text-white/68 whitespace-pre-wrap leading-7">{form.content || "Nothing to preview."}</pre>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end">
        <button type="submit" disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />}
          {isPending ? "Saving…" : form.status === "published" ? "Publish Post" : "Save Draft"}
        </button>
      </div>
    </form>
  );
}

// ── Paste-MDX form ────────────────────────────────────────────────────────────
function PasteForm({
  onSubmit, isPending,
}: {
  onSubmit: (form: CreatePostInput) => void;
  isPending: boolean;
}) {
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedMDX | null>(null);
  const [parsing, startParsing] = useTransition();
  const [status, setStatus] = useState<"published" | "draft">("published");

  const extract = () => {
    if (!raw.trim()) { toast.error("Paste your MDX file first"); return; }
    startParsing(async () => {
      try {
        const result = await parseMDXContent(raw);
        setParsed(result);
        toast.success("Frontmatter extracted!");
      } catch {
        toast.error("Failed to parse MDX — check the frontmatter format");
      }
    });
  };

  const handleSave = () => {
    if (!parsed) return;
    onSubmit({ ...parsed, status });
  };

  return (
    <div className="space-y-5">
      {!parsed ? (
        <>
          {/* Paste area */}
          <div className="rounded-2xl border border-white/6 bg-[#0d1117] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6 bg-[#161b22]">
              <ClipboardPaste className="w-3.5 h-3.5 text-white/55" />
              <span className="text-xs font-mono text-white/55">Paste full .mdx file (frontmatter + content)</span>
            </div>
            <textarea
              value={raw} onChange={(e) => setRaw(e.target.value)}
              rows={28}
              placeholder={`---\ntitle: "Your Title"\ndescription: "Description"\ndate: "2026-06-01"\ntags: ["Node.js", "TypeScript"]\nfeatured: false\nexcerpt: "Excerpt text"\n---\n\nYour MDX content here...`}
              className="w-full bg-transparent p-5 text-sm font-mono text-white/70 placeholder:text-white/48 focus:outline-none resize-none leading-7"
            />
          </div>

          <div className="flex items-center justify-end">
            <button onClick={extract} disabled={parsing || !raw.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {parsing ? "Extracting…" : "Extract & Preview"}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Extracted preview */}
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400/70 uppercase tracking-widest">Extracted Frontmatter</span>
              <button onClick={() => setParsed(null)}
                className="inline-flex items-center gap-1 text-xs font-mono text-white/55 hover:text-white/74 transition-colors">
                <RefreshCw className="w-3 h-3" /> Re-paste
              </button>
            </div>

            {([
              ["Title", parsed.title],
              ["Description", parsed.description],
              ["Date", parsed.date],
              ["Tags", parsed.tags],
              ["Excerpt", parsed.excerpt],
              ["Featured", parsed.featured ? "Yes" : "No"],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex gap-3 text-sm">
                <span className="w-24 text-white/55 font-mono flex-shrink-0">{k}</span>
                <span className="text-white/65 font-mono break-all">{v || <span className="text-white/48 italic">empty</span>}</span>
              </div>
            ))}
          </div>

          {/* Content preview */}
          <div className="rounded-2xl border border-white/6 bg-[#0d1117] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/6 bg-[#161b22] flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-white/52" />
              <span className="text-xs font-mono text-white/52">Content ({parsed.content.split(/\s+/).length} words)</span>
            </div>
            <pre className="p-5 text-xs font-mono text-white/62 whitespace-pre-wrap leading-6 max-h-60 overflow-auto">
              {parsed.content.slice(0, 500)}{parsed.content.length > 500 ? "\n…" : ""}
            </pre>
          </div>

          {/* Status toggle before save */}
          <div className="p-4 rounded-xl border border-white/6 bg-white/2">
            <Toggle
              checked={status === "published"}
              onChange={(v) => setStatus(v ? "published" : "draft")}
              label={status === "published" ? "Publish immediately" : "Save as draft"}
              onIcon={<Globe className="w-3.5 h-3.5 text-emerald-400" />}
              offIcon={<EyeOff className="w-3.5 h-3.5 text-white/52" />}
            />
          </div>

          <div className="flex items-center justify-end">
            <button onClick={handleSave} disabled={isPending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {isPending ? "Saving…" : status === "published" ? "Publish Post" : "Save Draft"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function NewBlogPage() {
  const [mode, setMode] = useState<"manual" | "paste">("manual");
  const [isPending, startTransition] = useTransition();
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const [form, setForm] = useState<CreatePostInput>({
    ...EMPTY_FORM, content: MDX_TEMPLATE,
  });

  const save = (input: CreatePostInput) => {
    if (!input.title.trim()) { toast.error("Title is required"); return; }
    if (!input.content.trim()) { toast.error("Content is required"); return; }
    startTransition(async () => {
      const result = await createBlogPost(input);
      if (result.success) {
        setCreatedSlug(result.slug!);
      } else {
        toast.error(result.error ?? "Failed to save post");
      }
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save(form);
  };

  const reset = () => {
    setCreatedSlug(null);
    setForm({ ...EMPTY_FORM, content: MDX_TEMPLATE });
    setMode("manual");
  };

  if (createdSlug) return <SuccessScreen slug={createdSlug} onReset={reset} />;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">New Blog Post</h1>
          <p className="text-sm text-white/58 font-mono">Create a post manually or paste a complete MDX file</p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/6 w-fit mb-7">
        {([
          { id: "manual", label: "Manual", icon: PenLine },
          { id: "paste", label: "Paste MDX", icon: ClipboardPaste },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setMode(id)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all",
              mode === id ? "bg-white/8 text-white/85 shadow-sm" : "text-white/58 hover:text-white/74",
            )}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {mode === "manual" ? (
        <ManualForm form={form} setForm={setForm} onSubmit={handleManualSubmit} isPending={isPending} />
      ) : (
        <PasteForm onSubmit={save} isPending={isPending} />
      )}
    </div>
  );
}
