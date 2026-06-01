"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePostStatus, deletePost } from "@/app/actions/admin";
import { Globe, EyeOff, Trash2 } from "lucide-react";

export function ToggleStatusBtn({
  slug,
  status,
}: {
  slug: string;
  status: "published" | "draft";
}) {
  const [isPending, start] = useTransition();
  const router = useRouter();

  const toggle = () => {
    start(async () => {
      await togglePostStatus(slug);
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={
        status === "published"
          ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
          : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-white/35 hover:bg-white/10 hover:text-white/55 transition-colors disabled:opacity-50"
      }
    >
      {status === "published" ? (
        <><Globe className="w-3 h-3" />Published</>
      ) : (
        <><EyeOff className="w-3 h-3" />Draft</>
      )}
    </button>
  );
}

export function DeletePostBtn({ slug }: { slug: string }) {
  const [isPending, start] = useTransition();
  const router = useRouter();

  const del = () => {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    start(async () => {
      await deletePost(slug);
      router.refresh();
    });
  };

  return (
    <button
      onClick={del}
      disabled={isPending}
      aria-label="Delete post"
      className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
