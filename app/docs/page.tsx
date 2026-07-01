import type { Metadata } from "next";
import Link from "next/link";
import { getAllDocs } from "@/lib/docs";
import { BlogFooter } from "@/components/blog/blog-footer";
import { Package, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

const BASE_URL = "https://prantadas.dev";

export const metadata: Metadata = {
  title: "Documentation — Open Source Packages",
  description:
    "Guides and API references for the open-source npm packages I maintain — banglapay (Bangladeshi payment gateways) and al-quran-sdk (Quran.com API).",
  alternates: { canonical: `${BASE_URL}/docs` },
  openGraph: {
    title: "Documentation — Pranta Das",
    description:
      "Guides and API references for the open-source npm packages I maintain.",
    url: `${BASE_URL}/docs`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation — Pranta Das",
    description: "API references for my open-source npm packages.",
  },
};

export default function DocsIndexPage() {
  const docs = getAllDocs();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Documentation",
    url: `${BASE_URL}/docs`,
    hasPart: docs.map((d) => ({
      "@type": "TechArticle",
      name: d.title,
      description: d.description,
      url: `${BASE_URL}/docs/${d.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <main className="min-h-screen bg-background noise-overlay">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-white/68 hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-5">
              <BookOpen className="w-3 h-3 text-primary" />
              <span className="text-xs font-mono text-primary/70 uppercase tracking-widest">
                Documentation
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Package <span className="gradient-text-cyan">Docs</span>
            </h1>
            <p className="text-white/62 max-w-xl">
              Guides and API references for the open-source npm packages I build
              and maintain.
            </p>
          </header>

          {/* Doc cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {docs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                className="group relative glass-card rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-300 overflow-hidden p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-primary/70" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-white/90 truncate">
                      {doc.title}
                    </h2>
                  </div>
                  <span className="flex-shrink-0 text-[10px] font-mono px-2 py-1 rounded border border-blue-400/20 bg-blue-400/10 text-blue-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {doc.language}
                  </span>
                </div>

                <p className="text-white/62 text-sm leading-relaxed mb-5 line-clamp-3">
                  {doc.description}
                </p>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[11px] font-mono text-white/50">
                    npm i {doc.package}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-primary/60 group-hover:text-primary transition-colors">
                    Read docs
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <BlogFooter widthClass="max-w-5xl" />
      </main>
    </>
  );
}
