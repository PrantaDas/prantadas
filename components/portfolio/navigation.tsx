"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Terminal, Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "/blog", isPage: true },
];

interface NavProps {
  onTerminalOpen: () => void;
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

      // Active section detection
      const sections = navLinks.map((l) => l.href.slice(1));
      for (const id of sections.reverse()) {
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

  const scrollTo = (href: string) => {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
            ? "py-3 glass border-b border-white/5"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="container max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            aria-label="Pranta Das — Back to top"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors" />
              <span className="font-mono text-primary font-bold text-sm relative z-10">
                PD
              </span>
            </div>
            <span className="font-display font-semibold text-white/90 group-hover:text-white transition-colors">
              Pranta Das
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-1"
          >
            {navLinks.map((link) =>
              link.isPage ? (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={`Go to ${link.label} page`}
                  className="relative px-4 py-2 text-sm font-medium group"
                >
                  <span className="relative z-10 transition-colors duration-200 text-white/50 group-hover:text-white/90">
                    {link.label}
                  </span>
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  aria-label={`Navigate to ${link.label} section`}
                  aria-current={
                    activeSection === link.href.slice(1) ? "true" : undefined
                  }
                  className="relative px-4 py-2 text-sm font-medium group"
                >
                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      activeSection === link.href.slice(1)
                        ? "text-primary"
                        : "text-white/50 group-hover:text-white/90"
                    }`}
                  >
                    {link.label}
                  </span>
                  {activeSection === link.href.slice(1) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-primary/8"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                    />
                  )}
                </button>
              ),
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onTerminalOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open interactive terminal"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 text-sm font-mono text-primary"
            >
              <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">terminal</span>
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-40 glass flex flex-col items-center justify-center gap-6 md:hidden"
          >
            {navLinks.map((link, i) =>
              link.isPage ? (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-label={`Go to ${link.label} page`}
                    className="font-display text-3xl font-semibold text-white/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => scrollTo(link.href)}
                  aria-label={`Go to ${link.label} section`}
                  className="font-display text-3xl font-semibold text-white/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </motion.button>
              ),
            )}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06 }}
              onClick={() => {
                onTerminalOpen();
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 mt-4 px-6 py-3 rounded-xl border border-primary/30 text-primary font-mono"
            >
              <Terminal className="w-4 h-4" />
              Open Terminal
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
