"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
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

  const scrollTo = (href: string) => {
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            ? "py-3 bg-background/70 backdrop-blur-xl border-b border-white/[0.05]"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between min-w-0">
          {/* Logo */}
          <motion.a
            href="#"
            aria-label="Pranta Das — Back to top"
            className="flex items-center gap-2.5 group shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-7 h-7 flex items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <span className="font-mono text-primary font-bold text-xs">
                PD
              </span>
            </div>
            <span className="font-display font-semibold text-white/80 group-hover:text-white transition-colors text-sm tracking-wide hidden sm:inline">
              Pranta Das
            </span>
          </motion.a>

          {/* Desktop Nav — anchor links only */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-0.5"
          >
            {navLinks
              .filter((l) => !l.isPage)
              .map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  aria-label={`Navigate to ${link.label} section`}
                  aria-current={
                    activeSection === link.href.slice(1) ? "true" : undefined
                  }
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
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                    />
                  )}
                </button>
              ))}
          </nav>

          {/* Right: Blog CTA + mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/blog"
              aria-label="Go to engineering blog"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/35 transition-all duration-200 text-xs font-mono text-primary"
            >
              Blog
            </Link>

            <button
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
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
          <motion.div
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
