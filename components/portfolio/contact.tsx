"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

const EMPTY_FORM: FormValues = { name: "", email: "", subject: "", message: "" };

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

  const borderClass = showError
    ? "border-red-400/50 ring-1 ring-red-400/20"
    : focused
    ? "border-primary/40 ring-1 ring-primary/10"
    : "border-white/8 hover:border-white/15";

  const baseClass = `w-full bg-transparent border rounded-xl px-4 text-sm text-white/80 outline-none transition-all duration-200 resize-none placeholder:text-white/20 ${borderClass}`;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none z-10 font-mono text-xs ${
          focused || hasValue
            ? `-top-2 bg-[#060810] px-1 ${showError ? "text-red-400/70" : "text-primary/70"}`
            : `top-3 ${showError ? "text-red-400/50" : "text-white/30"}`
        }`}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          rows={4}
          aria-invalid={showError}
          aria-describedby={showError ? `${id}-error` : undefined}
          className={`${baseClass} pt-3.5 pb-3`}
        />
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

// ─── Contact section ─────────────────────────────────────────────────────────
export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback(
    (field: keyof FormValues) => (val: string) => {
      setValues((prev) => ({ ...prev, [field]: val }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      // Clear error for this field as user types
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, email: true, subject: true, message: true });

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      // Simulate API call — wire to your email service here
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));

      toast.success("Message sent!", {
        description: "Thanks for reaching out. I'll get back to you soon.",
        duration: 5000,
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      });

      // Reset form
      setValues(EMPTY_FORM);
      setTouched({});
      setErrors({});
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again or reach out via email directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Show errors only for touched fields
  const visibleErrors: FormErrors = {
    name: touched.name ? errors.name : undefined,
    email: touched.email ? errors.email : undefined,
    subject: touched.subject ? errors.subject : undefined,
    message: touched.message ? errors.message : undefined,
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
          {/* Left: Contact links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
          >
            {contactLinks.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="group flex items-center gap-4 p-4 glass-card rounded-xl border border-white/5 hover:border-primary/15 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-4 h-4 text-primary/60" />
                </div>
                <div className="min-w-0">
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
                      className="text-sm text-white/70 hover:text-primary transition-colors truncate block"
                    >
                      {value}
                    </Link>
                  ) : (
                    <span className="text-sm text-white/70 truncate block">
                      {value}
                    </span>
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
            <div className="glass-card rounded-2xl border border-white/5 p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold text-white/80 mb-6">
                Send a Message
              </h3>

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

                <p className="text-center text-[11px] text-white/20 font-mono">
                  * Required fields
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
