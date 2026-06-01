"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { SmoothScroll } from "@/components/portfolio/smooth-scroll";
import { Navigation } from "@/components/portfolio/navigation";
import { HeroSection } from "@/components/portfolio/hero";
import { AboutSection } from "@/components/portfolio/about";
import { SkillsSection } from "@/components/portfolio/skills";
import { ExperienceSection } from "@/components/portfolio/experience";
import { CertificationsSection } from "@/components/portfolio/certifications";
import { ContactSection } from "@/components/portfolio/contact";
import { SiteFooter } from "@/components/portfolio/footer";
import { Terminal } from "@/components/portfolio/terminal";
import { ScrollToTop } from "@/components/portfolio/scroll-to-top";
import { ProjectsSection } from "@/components/portfolio/projects";
import { MatrixRain } from "@/components/portfolio/matrix-rain";
import { ShortcutsModal } from "@/components/portfolio/shortcuts-modal";
import {
  FeaturedArticlesSection,
  type ArticleSummary,
} from "@/components/portfolio/featured-articles";

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  category: string;
  priority: number;
}

interface PortfolioClientProps {
  repositories: Repository[];
  year: number;
  articles: ArticleSummary[];
}

function SectionDivider() {
  return (
    <div className="container max-w-6xl mx-auto px-6 pointer-events-none" aria-hidden="true">
      <div className="relative h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-[3px] w-[6px] h-[6px] rounded-full bg-primary/20 border border-primary/15" />
      </div>
    </div>
  );
}

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

// G + key navigation map
const G_JUMP: Record<string, string> = {
  h: "hero", p: "projects", s: "skills",
  e: "experience", c: "contact", a: "about",
};

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function PortfolioClient({ repositories, year, articles }: PortfolioClientProps) {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [matrixOpen, setMatrixOpen]   = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const konamiRef = useRef<string[]>([]);
  const gModeRef  = useRef(false); // waiting for second key after G

  const openMatrix = useCallback(() => {
    setTerminalOpen(false);
    setMatrixOpen(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isTyping =
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        (active as HTMLElement)?.isContentEditable;

      // Always handle Escape
      if (e.key === "Escape") {
        if (matrixOpen)    { setMatrixOpen(false); return; }
        if (shortcutsOpen) { setShortcutsOpen(false); return; }
        if (terminalOpen)  { setTerminalOpen(false); return; }
      }

      if (isTyping) return;

      // Backtick → terminal
      if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setTerminalOpen((p) => !p);
        return;
      }

      // ? → shortcuts modal (shift+/ = ?)
      if (e.key === "?" && !matrixOpen && !terminalOpen) {
        e.preventDefault();
        setShortcutsOpen((p) => !p);
        return;
      }

      // M → Matrix rain
      if (e.key === "m" && !matrixOpen && !terminalOpen && !shortcutsOpen) {
        e.preventDefault();
        openMatrix();
        return;
      }

      // G-mode jump navigation
      if (e.key.toLowerCase() === "g" && !gModeRef.current) {
        gModeRef.current = true;
        setTimeout(() => { gModeRef.current = false; }, 1500);
        return;
      }
      if (gModeRef.current) {
        gModeRef.current = false;
        const target = G_JUMP[e.key.toLowerCase()];
        if (target) { e.preventDefault(); scrollTo(target); }
        return;
      }

      // Konami code
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
      if (konamiRef.current.join(",") === KONAMI.join(",")) {
        konamiRef.current = [];
        openMatrix();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [terminalOpen, matrixOpen, shortcutsOpen, openMatrix]);

  return (
    <div className="relative min-h-screen bg-background noise-overlay">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <SmoothScroll />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,212,255,0.06),transparent)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.05),transparent_70%)]" />
      </div>

      <Navigation
        onTerminalOpen={() => setTerminalOpen(true)}
        onShortcutsOpen={() => setShortcutsOpen(true)}
      />

      <main id="main-content" className="relative z-10" tabIndex={-1}>
        <HeroSection />
        <SectionDivider />
        <AboutSection />
        <SectionDivider />
        <ProjectsSection repositories={repositories} />
        <SectionDivider />
        <CertificationsSection />
        <SectionDivider />
        <SkillsSection />
        <SectionDivider />
        <ExperienceSection />
        <SectionDivider />
        <FeaturedArticlesSection articles={articles} />
        <SectionDivider />
        <ContactSection />
      </main>

      <SiteFooter year={year} onTerminalOpen={() => setTerminalOpen(true)} />

      <Terminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onMatrixTrigger={openMatrix}
      />

      <ScrollToTop />

      {/* Overlays */}
      <AnimatePresence>
        {matrixOpen && <MatrixRain key="matrix" onClose={() => setMatrixOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {shortcutsOpen && <ShortcutsModal key="shortcuts" onClose={() => setShortcutsOpen(false)} />}
      </AnimatePresence>

      {/* Keyboard hints */}
      {!terminalOpen && !matrixOpen && (
        <div className="fixed bottom-6 left-6 hidden lg:flex items-center gap-3 text-white/20 text-xs font-mono pointer-events-none select-none z-40">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-white/10 text-[10px]">`</kbd>
            terminal
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-white/10 text-[10px]">?</kbd>
            shortcuts
          </span>
        </div>
      )}
    </div>
  );
}
