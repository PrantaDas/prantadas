"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBlogPost, type EditPostInput } from "@/app/actions/admin";
import { toast } from "sonner";
import {
  PenLine, Eye, Code2, Loader2, CheckCircle2, Tag, Calendar,
  AlignLeft, Type, FileText, Sparkles, Globe, EyeOff, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-white/4 border border-white/8 text-white/80 text-sm placeholder:text-white/48 focus:outline-none focus:border-primary/40 focus:bg-white/6 transition-colors";

function Toggle({ checked, onChange, label, sub, onIcon, offIcon }: {
  checked: boolean; onChange: (v: boolean) => void;
  label: string; sub?: string;
  onIcon?: React.ReactNode; offIcon?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative flex-shrink-0" onClick={() => onChange(!checked)}>
        <div className={cn("w-10 h-6 rounded-full border transition-colors",
          checked ? "bg-primary/30 border-primary/40" : "bg-white/5 border-white/10")}>
          <div className={cn("absolute top-1 w-4 h-4 rounded-full transition-all",
            checked ? "left-5 bg-primary" : "left-1 bg-white/30")} />
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

export default function EditPostForm({ post }: { post: EditPostInput & { slug: string } }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<EditPostInput>({
    title: post.title,
    description: post.description,
    excerpt: post.excerpt,
    date: post.date,
    tags: post.tags,
    featured: post.featured,
    status: post.status,
    content: post.content,
  });

  const set = (key: keyof EditPostInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    startTransition(async () => {
      const result = await updateBlogPost(post.slug, form);
      if (result.success) {
        toast.success("Post updated!");
        setSaved(true);
      } else {
        toast.error(result.error ?? "Update failed");
      }
    });
  };

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">Updated!</h2>
        <p className="text-white/62 font-mono text-sm mb-6">/blog/{post.slug}</p>
        <div className="flex gap-3">
          <Link href={`/blog/${post.slug}`} target="_blank"
            className="px-5 py-2.5 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors">
            View Post
          </Link>
          <button onClick={() => { setSaved(false); router.push("/admin/dashboard/blog/manage"); }}
            className="px-5 py-2.5 rounded-xl border border-white/8 text-white/74 text-sm hover:border-white/20 transition-colors">
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Back */}
      <Link href="/admin/dashboard/blog/manage"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-white/55 hover:text-white/74 transition-colors mb-2">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to posts
      </Link>

      {/* Frontmatter */}
      <div className="p-5 rounded-2xl border border-white/6 bg-white/2 space-y-4">
        <p className="text-[10px] font-mono text-white/48 uppercase tracking-widest">Frontmatter</p>

        <Field label="Title" icon={Type}>
          <input value={form.title} onChange={set("title")} required className={inputClass} />
        </Field>
        <Field label="Description" icon={AlignLeft}>
          <input value={form.description} onChange={set("description")} className={inputClass} />
        </Field>
        <Field label="Excerpt" icon={FileText}>
          <input value={form.excerpt} onChange={set("excerpt")} className={inputClass} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Date" icon={Calendar}>
            <input type="date" value={form.date} onChange={set("date")} className={inputClass} />
          </Field>
          <Field label="Tags (comma separated)" icon={Tag}>
            <input value={form.tags} onChange={set("tags")} placeholder="Node.js, TypeScript" className={inputClass} />
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
            label={form.status === "published" ? "Published" : "Draft — hidden from public"}
            onIcon={<Globe className="w-3.5 h-3.5 text-emerald-400" />}
            offIcon={<EyeOff className="w-3.5 h-3.5 text-white/52" />}
          />
        </div>
      </div>

      {/* MDX Editor */}
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
            className="w-full bg-transparent p-5 text-sm font-mono text-white/70 focus:outline-none resize-none leading-7" />
        ) : (
          <div className="p-5 min-h-[400px]">
            <pre className="text-sm font-mono text-white/68 whitespace-pre-wrap leading-7">{form.content}</pre>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end">
        <button type="submit" disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />}
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
