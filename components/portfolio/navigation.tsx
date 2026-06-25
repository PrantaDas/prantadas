"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "/blog", isPage: true },
];

// Mobile drawer + footer surface these alongside navLinks. Keeping the main
// nav lean while still letting curious visitors discover them.
const SECONDARY_LINKS: { label: string; href: string }[] = [
  { label: "Now", href: "/now" },
  { label: "Uses", href: "/uses" },
];

interface NavProps {
  onTerminalOpen?: () => void;
}

export function Navigation({ onTerminalOpen }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navLinks
        .filter((l) => !l.isPage)
        .map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const hireMeClick = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-background/90 border-b border-white/[0.05]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between min-w-0">
          {/* Logo */}
          <motion.a
            href="#"
            aria-label="PD — Pranta Das, back to top"
            className="flex items-center gap-2.5 group shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-7 h-7 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <span className="font-mono text-primary font-bold text-xs">PD</span>
            </div>
            <span className="font-display font-semibold text-white/80 group-hover:text-white transition-colors text-sm tracking-wide hidden sm:inline">
              Pranta Das
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.isPage ? (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={`Go to ${link.label} page`}
                  className="group relative ml-1.5 pl-3.5 inline-flex items-center gap-1 px-3.5 py-2 text-xs font-mono uppercase tracking-widest text-primary/70 hover:text-primary transition-colors duration-200 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3.5 before:w-px before:bg-white/10"
                >
                  {link.label}
                  <ArrowUpRight
                    className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  aria-label={`Navigate to ${link.label} section`}
                  aria-current={activeSection === link.href.slice(1) ? "true" : undefined}
                  className="relative px-3.5 py-2 text-xs font-mono uppercase tracking-widest group"
                >
                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      activeSection === link.href.slice(1)
                        ? "text-primary"
                        : "text-white/40 group-hover:text-white/80"
                    }`}
                  >
                    {link.label}
                  </span>
                  {activeSection === link.href.slice(1) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-md bg-primary/8"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </button>
              ),
            )}
          </nav>

          {/* Right: Hire Me + mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Hire Me CTA */}
            <motion.button
              onClick={hireMeClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-background font-semibold text-xs transition-all duration-200 hover:bg-primary/90 glow-cyan"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-background/80" />
              </span>
              Hire Me
            </motion.button>

            <button
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          style={{ scaleX }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary/0 via-primary to-primary/0 origin-left"
        />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop — closes menu on click */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[39] bg-black/20"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              key="mobile-nav"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              id="mobile-nav"
              aria-label="Mobile navigation"
              className="fixed inset-0 z-40 overflow-hidden bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-5 lg:hidden"
            >
              {navLinks.map((link, i) =>
                link.isPage ? (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.055 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-label={`Go to ${link.label} page`}
                      className="font-display text-2xl font-semibold text-primary"
                    >
                      {link.label} ↗
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.055 }}
                    onClick={() => scrollTo(link.href)}
                    aria-label={`Go to ${link.label} section`}
                    className="font-display text-2xl font-semibold text-white/75 hover:text-white transition-colors"
                  >
                    {link.label}
                  </motion.button>
                ),
              )}

              {/* Secondary page links — smaller, below the main list */}
              <div className="mt-2 flex items-center gap-5">
                {SECONDARY_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (navLinks.length + i) * 0.055 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-label={`Go to ${link.label} page`}
                      className="font-mono text-xs uppercase tracking-widest text-white/45 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Hire Me in mobile menu */}
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + SECONDARY_LINKS.length) * 0.055 }}
                onClick={hireMeClick}
                className="mt-2 px-8 py-3 rounded-xl bg-primary text-background font-bold text-lg glow-cyan"
              >
                Hire Me
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
