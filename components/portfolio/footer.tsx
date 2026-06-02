"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Send, Terminal, BookOpen } from "lucide-react";

interface FooterProps {
  year: number;
  onTerminalOpen: () => void;
}

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

const builtWith = [
  { name: "Next.js", color: "#fff" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "MongoDB", color: "#4db33d" },
  { name: "Tailwind", color: "#38bdf8" },
  { name: "Framer", color: "#9b8afb" },
];

export function SiteFooter({ year, onTerminalOpen }: FooterProps) {
  return (
    <footer className="relative border-t border-white/5 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container max-w-6xl mx-auto px-6 py-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand column */}
          <div>
            <div className="font-display font-bold text-white/80 text-lg mb-2">
              Pranta Das
            </div>
            <p className="text-xs text-white/30 font-mono leading-relaxed mb-4 max-w-[200px]">
              Backend developer building scalable systems from Dhaka,
              Bangladesh.
            </p>
            <div className="flex items-center gap-3">
              {[
                {
                  href: "https://github.com/Prantadas",
                  icon: Github,
                  label: "GitHub",
                },
                {
                  href: "https://linkedin.com/in/pranta-das7",
                  icon: Linkedin,
                  label: "LinkedIn",
                },
                {
                  href: "#contact",
                  icon: Send,
                  label: "Contact",
                },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center text-white/30 hover:text-primary hover:border-primary/25 hover:bg-primary/5 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
              Navigation
            </div>
            <nav
              className="grid grid-cols-2 gap-x-4 gap-y-2"
              aria-label="Footer navigation"
            >
              {navLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector(href)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-sm text-white/35 hover:text-primary transition-colors font-mono"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/blog"
                className="text-sm text-white/35 hover:text-primary transition-colors font-mono flex items-center gap-1.5"
              >
                <BookOpen className="w-3 h-3" />
                Blog
              </Link>
            </nav>
          </div>

          {/* Built with column */}
          <div>
            <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
              Built with
            </div>
            <div className="flex flex-wrap gap-2">
              {builtWith.map(({ name, color }) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg border border-white/8 bg-white/3 text-white/40 hover:text-white/65 transition-colors"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  {name}
                </span>
              ))}
            </div>
            <motion.button
              onClick={onTerminalOpen}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Open interactive terminal"
              className="mt-4 flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/8 text-white/30 hover:text-primary hover:border-primary/20 transition-all text-xs font-mono"
            >
              <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              Open Terminal
            </motion.button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
          <div className="text-xs font-mono text-white/70">
            © {year} Pranta Das · Crafted with precision &amp; curiosity
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/70">
            <span>Made with</span>
            <span className="text-red-400/60">♥</span>
            <span>in</span>
            <span>🇧🇩</span>
            <span>Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
