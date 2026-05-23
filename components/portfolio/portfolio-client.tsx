"use client";

import { useState, useEffect } from "react";
import { CustomCursor } from "@/components/portfolio/cursor";
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
import { ProjectsSection } from "@/components/portfolio/projects";

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
}

export function PortfolioClient({ repositories, year }: PortfolioClientProps) {
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Toggle terminal with backtick key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const active = document.activeElement;
        if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA")
          return;
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
      if (e.key === "Escape" && terminalOpen) {
        setTerminalOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [terminalOpen]);

  return (
    <div className="relative min-h-screen bg-background noise-overlay custom-cursor-active">
      <SmoothScroll />
      <CustomCursor />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,212,255,0.06),transparent)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.05),transparent_70%)]" />
      </div>

      <Navigation onTerminalOpen={() => setTerminalOpen(true)} />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection repositories={repositories} />
        <CertificationsSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      <SiteFooter year={year} onTerminalOpen={() => setTerminalOpen(true)} />

      {/* Floating terminal */}
      <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

      {/* Keyboard hint */}
      {!terminalOpen && (
        <div className="fixed bottom-6 left-6 hidden lg:flex items-center gap-2 text-white/20 text-xs font-mono pointer-events-none select-none z-40">
          <kbd className="px-1.5 py-0.5 rounded border border-white/10 text-[10px]">
            `
          </kbd>
          <span>terminal</span>
        </div>
      )}
    </div>
  );
}
