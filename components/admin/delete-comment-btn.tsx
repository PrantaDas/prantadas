"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteComment } from "@/app/actions/admin";
import { ConfirmDialog } from "./confirm-dialog";

export function DeleteCommentBtn({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, start] = useTransition();
  const router = useRouter();

  const confirm = () => {
    start(async () => {
      await deleteComment(id);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Delete comment"
        className="p-2 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDialog
        open={open}
        danger
        title="Delete comment"
        description={`Delete ${name}'s comment? This also removes their avatar from image storage and cannot be undone.`}
        confirmLabel="Delete"
        isPending={isPending}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
