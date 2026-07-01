"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";

const shortcuts = [
  {
    group: "Navigation",
    items: [
      { keys: ["`"],    description: "Open / close terminal" },
      { keys: ["Esc"],  description: "Close any overlay" },
    ],
  },
  {
    group: "Global",
    items: [
      { keys: ["?"],                description: "Show this shortcuts panel" },
      { keys: ["G", "H"],           description: "Jump to Hero" },
      { keys: ["G", "P"],           description: "Jump to Projects" },
      { keys: ["G", "S"],           description: "Jump to Skills" },
      { keys: ["G", "E"],           description: "Jump to Experience" },
      { keys: ["G", "C"],           description: "Jump to Contact" },
    ],
  },
  {
    group: "Easter Eggs",
    items: [
      { keys: ["M"], description: "Trigger Matrix rain" },
    ],
  },
];

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded border border-white/15 bg-white/5 text-[10px] font-mono text-white/74">
      {children}
    </kbd>
  );
}

interface ShortcutsModalProps {
  onClose: () => void;
}

export function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "?") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9990] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm glass-card rounded-2xl border border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-primary/60" />
            <span className="text-sm font-semibold text-white/80">Keyboard Shortcuts</span>
          </div>
          <button onClick={onClose} className="text-white/55 hover:text-white/70 transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 space-y-5">
          {shortcuts.map((group) => (
            <div key={group.group}>
              <div className="text-[10px] font-mono text-white/55 uppercase tracking-widest mb-3">
                {group.group}
              </div>
              <div className="space-y-2.5">
                {group.items.map((item) => (
                  <div key={item.description} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-white/72">{item.description}</span>

                    {/* Konami gets a compact single badge */}
                    {item.keys[0] === "konami" ? (
                      <kbd className="flex-shrink-0 px-2 py-0.5 rounded border border-white/15 bg-white/5 text-[10px] font-mono text-white/68 tracking-wider">
                        ↑↑↓↓←→←→BA
                      </kbd>
                    ) : item.keys.length === 1 ? (
                      <Kbd>{item.keys[0]}</Kbd>
                    ) : (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Kbd>{item.keys[0]}</Kbd>
                        <span className="text-[10px] font-mono text-white/52">then</span>
                        <Kbd>{item.keys[1]}</Kbd>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4 space-y-2 text-center border-t border-white/5 pt-4">
          <span className="text-[11px] font-mono text-white/48">
            Press <Kbd>?</Kbd> or <Kbd>Esc</Kbd> to close
          </span>
          <p className="text-[10px] font-mono text-white/45">
            psst — there&apos;s also a secret 10-key combo 👀
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
