"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail, Terminal, BookOpen } from "lucide-react";

interface FooterProps {
  year: number;
  onTerminalOpen: () => void;
}

export function SiteFooter({ year, onTerminalOpen }: FooterProps) {
  return (
    <footer className="relative border-t border-white/5 py-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + copy */}
          <div className="text-center md:text-left">
            <div className="font-display font-bold text-white/80 mb-1">
              Pranta Das
            </div>
            <div className="text-xs font-mono text-white/25 mb-1">
              © {year} · Crafted with precision & curiosity
            </div>
            {/* Bangladesh signature */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-mono text-white/20">
              <span>Made with</span>
              <span className="text-red-400/70" aria-hidden="true">
                ♥
              </span>
              <span>in</span>
              <span
                className="text-[#006A4E]/80 font-semibold"
                title="Bangladesh"
              >
                🇧🇩
              </span>
              <span className="text-white/30">Bangladesh</span>
            </div>
          </div>

          {/* Center links */}
          <nav aria-label="Social links" className="flex items-center gap-5">
            <Link
              href="https://github.com/Prantadas"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pranta Das on GitHub"
              className="text-white/30 hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="https://linkedin.com/in/pranta-das7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pranta Das on LinkedIn"
              className="text-white/30 hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="mailto:prantodas043@gmail.com"
              aria-label="Send email to Pranta Das"
              className="text-white/30 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
            </Link>
            <span className="w-px h-3.5 bg-white/10" aria-hidden="true" />
            <Link
              href="/blog"
              aria-label="Engineering blog by Pranta Das"
              className="text-white/30 hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
            </Link>
          </nav>

          {/* Terminal button */}
          <motion.button
            onClick={onTerminalOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open interactive terminal"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 text-white/30 hover:text-primary hover:border-primary/20 transition-all text-xs font-mono"
          >
            <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
            Open Terminal
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
