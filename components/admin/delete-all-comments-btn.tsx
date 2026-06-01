"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteAllComments } from "@/app/actions/admin";
import { ConfirmDialog } from "./confirm-dialog";

export function DeleteAllCommentsBtn({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, start] = useTransition();
  const router = useRouter();

  const confirm = () => {
    start(async () => {
      await deleteAllComments();
      setOpen(false);
      router.refresh();
    });
  };

  if (count === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/6 text-red-400/80 hover:bg-red-500/15 hover:border-red-500/35 hover:text-red-400 transition-all text-xs font-mono"
      >
        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        Delete all
      </button>

      <ConfirmDialog
        open={open}
        danger
        title="Delete all comments"
        description={`This will permanently delete all ${count} comment${count !== 1 ? "s" : ""} and remove their avatars from image storage. This cannot be undone.`}
        confirmLabel={`Delete all ${count}`}
        isPending={isPending}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
