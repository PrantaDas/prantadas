"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, description,
  confirmLabel = "Confirm",
  danger = false,
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          onClick={onCancel}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
              danger ? "bg-red-500/10 border border-red-500/20" : "bg-amber-400/10 border border-amber-400/20"
            }`}>
              <AlertTriangle className={`w-5 h-5 ${danger ? "text-red-400" : "text-amber-400"}`} />
            </div>

            <button onClick={onCancel} className="absolute top-4 right-4 text-white/52 hover:text-white/74 transition-colors">
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-semibold text-white/90 text-base mb-2">{title}</h3>
            <p className="text-sm text-white/65 leading-relaxed mb-6">{description}</p>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={onCancel}
                disabled={isPending}
                className="px-4 py-2 rounded-xl border border-white/10 text-sm font-mono text-white/68 hover:text-white/80 hover:border-white/20 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isPending}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  danger
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-background"
                }`}
              >
                {isPending ? "Processing…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
