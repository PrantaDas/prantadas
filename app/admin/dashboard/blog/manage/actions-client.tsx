"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePostStatus, deletePost } from "@/app/actions/admin";
import { Globe, EyeOff, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

export function ToggleStatusBtn({ slug, status }: { slug: string; status: "published" | "draft" }) {
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
      {status === "published"
        ? <><Globe className="w-3 h-3" />Published</>
        : <><EyeOff className="w-3 h-3" />Draft</>}
    </button>
  );
}

export function DeletePostBtn({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, start] = useTransition();
  const router = useRouter();

  const confirm = () => {
    start(async () => {
      await deletePost(slug);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isPending}
        aria-label="Delete post"
        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <ConfirmDialog
        open={open}
        danger
        title="Delete post"
        description={`Delete "${slug}"? All comments on this post will remain in the database but the post will be permanently removed.`}
        confirmLabel="Delete post"
        isPending={isPending}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
