"use client";

import { useRef, useState, useCallback, useTransition } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { submitContactForm } from "@/app/actions/contact";
import {
  MapPin,
  Github,
  Linkedin,
  Mail,
  Send,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const MESSAGE_LIMIT = 1000;

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
    copyable: true,
    color: "text-primary/80 bg-primary/8 border-primary/15 group-hover:bg-primary/15",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: null,
    copyable: false,
    color: "text-amber-400 bg-amber-400/8 border-amber-400/15 group-hover:bg-amber-400/15",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/Prantadas",
    href: "https://github.com/Prantadas",
    copyable: false,
    color: "text-white/68 bg-white/5 border-white/10 group-hover:bg-white/10",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/pranta-das7",
    href: "https://linkedin.com/in/pranta-das7",
    copyable: false,
    color: "text-blue-400 bg-blue-400/8 border-blue-400/15 group-hover:bg-blue-400/15",
  },
];

// ─── Form types ───────────────────────────────────────────────────────────────
interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMPTY_FORM: FormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Please enter a valid email address";
  }
  if (!values.subject.trim()) {
    errors.subject = "Subject is required";
  } else if (values.subject.trim().length < 3) {
    errors.subject = "Subject must be at least 3 characters";
  }
  if (!values.message.trim()) {
    errors.message = "Message is required";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }
  return errors;
}

// ─── Floating input ───────────────────────────────────────────────────────────
function FloatingInput({
  id,
  label,
  type = "text",
  placeholder,
  multiline = false,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  multiline?: boolean;
  value: string;
  error?: string;
  onChange: (val: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const showError = !!error;
  const atLimit = multiline && value.length >= MESSAGE_LIMIT * 0.9;

  const borderClass = showError
    ? "border-red-400/50 ring-1 ring-red-400/20"
    : focused
      ? "border-primary/40 ring-1 ring-primary/10"
      : "border-white/8 hover:border-white/15";

  const baseClass = `w-full bg-transparent border rounded-xl px-4 text-sm text-white/80 outline-none transition-all duration-200 resize-none placeholder:text-white/48 ${borderClass}`;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 font-mono text-xs ${
          focused || hasValue
            ? `-top-2 bg-[#060810] px-1 ${showError ? "text-red-400/70" : "text-primary/70"}`
            : `top-3 ${showError ? "text-red-400/50" : "text-white/55"}`
        }`}
      >
        {label}
      </label>
      {multiline ? (
        <div className="relative">
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, MESSAGE_LIMIT))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ""}
            rows={4}
            aria-invalid={showError}
            aria-describedby={showError ? `${id}-error` : undefined}
            className={`${baseClass} pt-3.5 pb-7`}
          />
          <span
            className={`absolute bottom-2.5 right-3.5 text-[10px] font-mono transition-colors ${
              atLimit ? "text-amber-400/60" : "text-white/48"
            } ${focused || hasValue ? "opacity-100" : "opacity-0"}`}
          >
            {value.length}/{MESSAGE_LIMIT}
          </span>
        </div>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          aria-invalid={showError}
          aria-describedby={showError ? `${id}-error` : undefined}
          className={`${baseClass} h-12`}
        />
      )}
      {showError && (
        <motion.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400/80 font-mono"
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ─── Copyable contact link ────────────────────────────────────────────────────
function ContactLinkItem({
  icon: Icon,
  label,
  value,
  href,
  copyable,
  color,
  index,
  inView,
}: (typeof contactLinks)[0] & { index: number; inView: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: Math.min(0.08 + index * 0.035, 0.22) }}
      className="group flex items-center gap-4 p-4 glass-card rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300"
    >
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-mono text-white/55 mb-0.5">{label}</div>
        {href ? (
          <Link
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-sm text-white/65 hover:text-white/90 transition-colors truncate block"
          >
            {value}
          </Link>
        ) : (
          <span className="text-sm text-white/65 truncate block">{value}</span>
        )}
      </div>
      {copyable && (
        <button
          onClick={handleCopy}
          className="flex-shrink-0 w-7 h-7 rounded-lg border border-white/8 hover:border-white/20 bg-white/3 hover:bg-white/8 flex items-center justify-center transition-all duration-200"
          title={`Copy ${label}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check className="w-3 h-3 text-emerald-400" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="w-3 h-3 text-white/55" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}
    </motion.div>
  );
}

// ─── Contact section ─────────────────────────────────────────────────────────
export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const submitting = isPending;

  const setField = useCallback(
    (field: keyof FormValues) => (val: string) => {
      setValues((prev) => ({ ...prev, [field]: val }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      const result = await submitContactForm(values);

      if (result.success) {
        toast.success("Message sent!", {
          description: "Thanks for reaching out. I'll get back to you soon — check your inbox for a confirmation.",
          duration: 6000,
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        });
        setValues(EMPTY_FORM);
        setTouched({});
      } else {
        toast.error("Failed to send", {
          description: result.error ?? "Please try again or email me directly.",
        });
      }
    });
  };

  const visibleErrors: FormErrors = {
    name: touched.name ? errors.name : undefined,
    email: touched.email ? errors.email : undefined,
    subject: touched.subject ? errors.subject : undefined,
    message: touched.message ? errors.message : undefined,
  };

  return (
    <section id="contact" ref={ref} className="relative py-16 md:py-24">
      {/* Background accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <SectionLabel>Contact</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Let's <span className="gradient-text-cyan">Connect</span>
          </h2>
          <p className="text-white/62 max-w-lg mx-auto">
            Open to new opportunities, collaborations, or just a conversation
            about code
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Status + Contact links */}
          <div className="space-y-3">
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.32, delay: 0.06 }}
              className="flex items-center justify-between p-4 glass-card rounded-xl border border-emerald-400/15 bg-emerald-400/3 mb-5"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex" />
                  <motion.span
                    className="absolute inset-0 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-emerald-400/90">Available for opportunities</div>
                  <div className="text-xs text-white/55 font-mono mt-0.5">Open to full-time & freelance roles</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-white/52 bg-white/4 border border-white/8 rounded-lg px-2.5 py-1">
                <Zap className="w-3 h-3" />
                Active
              </div>
            </motion.div>

            {contactLinks.map((link, i) => (
              <ContactLinkItem key={link.label} {...link} index={i} inView={inView} />
            ))}

            {/* Response time */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.28, duration: 0.32 }}
              className="flex items-center gap-2 pt-1 pl-1"
            >
              <Clock className="w-3 h-3 text-white/48" />
              <span className="text-xs font-mono text-white/52">
                Typical response within 24 hours
              </span>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              {/* Form card header */}
              <div className="px-6 pt-6 pb-5 border-b border-white/5 bg-white/2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-semibold text-white/80">
                      Send a Message
                    </h3>
                    <p className="text-xs text-white/55 font-mono mt-0.5">
                      I read every message personally
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5"
                  aria-label="Contact form"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FloatingInput
                      id="contact-name"
                      label="Name *"
                      placeholder="Your name"
                      value={values.name}
                      error={visibleErrors.name}
                      onChange={setField("name")}
                    />
                    <FloatingInput
                      id="contact-email"
                      label="Email *"
                      type="email"
                      placeholder="you@example.com"
                      value={values.email}
                      error={visibleErrors.email}
                      onChange={setField("email")}
                    />
                  </div>
                  <FloatingInput
                    id="contact-subject"
                    label="Subject *"
                    placeholder="What's this about?"
                    value={values.subject}
                    error={visibleErrors.subject}
                    onChange={setField("subject")}
                  />
                  <FloatingInput
                    id="contact-message"
                    label="Message *"
                    placeholder="Tell me about your project..."
                    multiline
                    value={values.message}
                    error={visibleErrors.message}
                    onChange={setField("message")}
                  />

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-background font-semibold text-sm transition-all duration-200 hover:bg-primary/90 glow-cyan disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-[11px] text-white/48 font-mono">
                    * Required fields
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
