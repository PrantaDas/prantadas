"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-6">
      <Sparkles className="w-3 h-3 text-primary" />
      <span className="text-xs font-mono text-primary/70 uppercase tracking-widest">
        {children}
      </span>
    </div>
  );
}

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "prantodas043@gmail.com",
    href: "mailto:prantodas043@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+8801708088432",
    href: "tel:+8801708088432",
  },
  { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh", href: null },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/Prantadas",
    href: "https://github.com/Prantadas",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/pranta-das7",
    href: "https://linkedin.com/in/pranta-das7",
  },
];

function FloatingInput({
  id,
  label,
  type = "text",
  placeholder,
  multiline = false,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const hasValue = value.length > 0;

  const baseClass = `w-full bg-transparent border rounded-xl px-4 text-sm text-white/80 outline-none transition-all duration-200 resize-none placeholder:text-white/20
    ${focused ? "border-primary/40 ring-1 ring-primary/10" : "border-white/8 hover:border-white/15"}`;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 font-mono text-xs ${
          focused || hasValue
            ? "-top-2 bg-[#060810] px-1 text-primary/70"
            : "top-3 text-white/30"
        }`}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          rows={4}
          className={`${baseClass} pt-3 pb-3`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          className={`${baseClass} h-12`}
        />
      )}
    </div>
  );
}

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, hook this up to an API route / email service
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32">
      {/* Background accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel>Contact</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Let's <span className="gradient-text-cyan">Connect</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            Open to new opportunities, collaborations, or just a conversation
            about code
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {contactLinks.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="group flex items-center gap-4 p-4 glass-card rounded-xl border border-white/5 hover:border-primary/15 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-4 h-4 text-primary/60" />
                </div>
                <div>
                  <div className="text-xs font-mono text-white/30 mb-0.5">
                    {label}
                  </div>
                  {href ? (
                    <Link
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-sm text-white/70 hover:text-primary transition-colors"
                    >
                      {value}
                    </Link>
                  ) : (
                    <span className="text-sm text-white/70">{value}</span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-card rounded-2xl border border-white/5 p-7">
              <h3 className="font-display text-lg font-semibold text-white/80 mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <FloatingInput
                    id="name"
                    label="Name"
                    placeholder="Your name"
                  />
                  <FloatingInput
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <FloatingInput
                  id="subject"
                  label="Subject"
                  placeholder="What's this about?"
                />
                <FloatingInput
                  id="message"
                  label="Message"
                  placeholder="Tell me about your project..."
                  multiline
                />

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-background font-semibold text-sm transition-all duration-200 hover:bg-primary/90 glow-cyan"
                >
                  {sent ? (
                    <>
                      <span className="text-background/80">✓</span>
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
