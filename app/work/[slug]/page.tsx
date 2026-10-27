import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Globe,
  Layers,
  Lightbulb,
  Server,
  Sparkles,
  Wrench,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { BlogFooter } from "@/components/blog/blog-footer";

const BASE_URL = "https://prantadas.dev";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  const url = `${BASE_URL}/work/${slug}`;
  const title = `${study.name} — Case Study`;

  return {
    title,
    description: study.summary,
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url,
      title,
      description: study.tagline,
      siteName: "Pranta Das",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: study.tagline,
      creator: "@PrantaD62436311",
      site: "@PrantaD62436311",
    },
    alternates: { canonical: url },
  };
}

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-3 font-display text-2xl md:text-3xl font-bold text-white mb-6">
      <span className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </span>
      {children}
    </h2>
  );
}

const linkClass =
  "inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-white/8 text-white/72 hover:border-primary/30 hover:text-primary transition-all";

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const others = caseStudies.filter((c) => c.slug !== slug);

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: study.name,
    description: study.summary,
    applicationCategory: study.category,
    operatingSystem: study.platforms.join(", "),
    url: study.links.website,
    sameAs: [study.links.appStore, study.links.playStore].filter(Boolean),
    creator: { "@type": "Person", name: "Pranta Das", url: BASE_URL },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Work", item: `${BASE_URL}/#projects` },
      {
        "@type": "ListItem",
        position: 3,
        name: study.name,
        item: `${BASE_URL}/work/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-background noise-overlay">
        <ReadingProgress />
        <ScrollToTop />
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm font-mono text-white/68 min-w-0">
              <li>
                <Link href="/" className="hover:text-white/74 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#projects" className="hover:text-white/74 transition-colors">
                  Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white/68 truncate max-w-[220px]" aria-current="page">
                {study.name}
              </li>
            </ol>
          </nav>

          {/* Hero */}
          <header className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-5">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-mono text-primary/70 uppercase tracking-widest">
                Case Study · {study.category}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              {study.name}
            </h1>
            <p className="gradient-text-cyan font-display text-lg md:text-xl font-semibold mb-6">
              {study.tagline}
            </p>
            <p className="text-white/68 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
              {study.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 py-5 border-y border-white/8">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white/72">
                <Briefcase className="w-3.5 h-3.5 text-primary/70" />
                {study.role}
              </span>
              <span className="text-white/20" aria-hidden="true">·</span>
              <span className="text-xs font-mono text-white/62">{study.period}</span>
              <span className="text-white/20" aria-hidden="true">·</span>
              <span className="text-xs font-mono text-white/62">
                {study.platforms.join(" · ")}
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                {study.links.website && (
                  <a href={study.links.website} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <Globe className="w-3 h-3" />
                    Website
                  </a>
                )}
                {study.links.appStore && (
                  <a href={study.links.appStore} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <FaApple className="w-3 h-3" />
                    App Store
                  </a>
                )}
                {study.links.playStore && (
                  <a href={study.links.playStore} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <FaGooglePlay className="w-3 h-3" />
                    Google Play
                  </a>
                )}
              </div>
            </div>

            {/* Quick facts */}
            <dl className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {study.facts.map((f) => (
                <div key={f.label} className="glass-card rounded-xl border border-white/5 p-4">
                  <dt className="text-[10px] font-mono uppercase tracking-wider text-primary/60 mb-1.5">
                    {f.label}
                  </dt>
                  <dd className="text-sm text-white/85 font-medium leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="space-y-16">
            {/* Context */}
            <section>
              <SectionHeading icon={Lightbulb}>The problem</SectionHeading>
              <div className="space-y-4 max-w-3xl">
                {study.context.map((p, i) => (
                  <p key={i} className="text-white/68 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* Role */}
            <section>
              <SectionHeading icon={Briefcase}>My role</SectionHeading>
              <ul className="grid sm:grid-cols-2 gap-3">
                {study.responsibilities.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/[0.02] p-4"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/72 leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Features */}
            <section>
              <SectionHeading icon={Layers}>What the product does</SectionHeading>
              <div className="grid md:grid-cols-2 gap-4">
                {study.features.map((f) => (
                  <div
                    key={f.title}
                    className="glass-card rounded-xl border border-white/5 hover:border-primary/15 transition-colors p-5"
                  >
                    <h3 className="font-display font-semibold text-white/90 mb-2">{f.title}</h3>
                    <p className="text-sm text-white/62 leading-relaxed">{f.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Architecture */}
            <section>
              <SectionHeading icon={Server}>Architecture</SectionHeading>
              <p className="text-white/68 leading-relaxed max-w-3xl mb-6">
                {study.architecture.intro}
              </p>
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 md:p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {study.architecture.components.map((c, i) => (
                    <div
                      key={c.name}
                      className="relative rounded-xl border border-primary/15 bg-primary/[0.04] p-4"
                    >
                      <span className="text-[10px] font-mono text-primary/50">
                        0{i + 1}
                      </span>
                      <h3 className="font-display font-semibold text-white/90 mt-1 mb-2">
                        {c.name}
                      </h3>
                      <p className="text-xs text-white/62 leading-relaxed">{c.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-white/55 border-t border-white/6 pt-4">
                  {study.stack
                    .find((s) => s.group === "Data")
                    ?.items.map((item) => (
                      <span key={item} className="px-2 py-1 rounded-md border border-white/8 bg-white/[0.03]">
                        {item}
                      </span>
                    ))}
                </div>
              </div>
            </section>

            {/* Engineering decisions */}
            <section>
              <SectionHeading icon={Wrench}>Engineering highlights</SectionHeading>
              <ol className="space-y-3">
                {study.engineering.map((e, i) => (
                  <li
                    key={e.title}
                    className="relative rounded-xl border border-white/6 bg-white/[0.02] p-5 pl-14"
                  >
                    <span className="absolute left-5 top-5 font-mono text-sm text-primary/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-semibold text-white/90 mb-1.5">{e.title}</h3>
                    <p className="text-sm text-white/62 leading-relaxed">{e.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Stack */}
            <section>
              <SectionHeading icon={Layers}>Tech stack</SectionHeading>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {study.stack.map((s) => (
                  <div key={s.group} className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
                    <h3 className="text-[10px] font-mono uppercase tracking-wider text-primary/60 mb-3">
                      {s.group}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {s.items.map((item) => (
                        <span
                          key={item}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/4 border border-white/8 text-white/70"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Takeaways */}
            <section>
              <SectionHeading icon={Lightbulb}>What I took away</SectionHeading>
              <div className="space-y-3 max-w-3xl">
                {study.takeaways.map((t) => (
                  <blockquote
                    key={t}
                    className="border-l-2 border-primary/40 pl-4 text-white/72 leading-relaxed"
                  >
                    {t}
                  </blockquote>
                ))}
              </div>
            </section>
          </div>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-white/6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-mono text-white/68 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All projects
            </Link>
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/work/${o.slug}`}
                className="text-sm font-mono text-white/68 hover:text-primary transition-colors"
              >
                Next: {o.name} →
              </Link>
            ))}
          </div>
        </div>

        <BlogFooter widthClass="max-w-5xl" />
      </main>
    </>
  );
}
