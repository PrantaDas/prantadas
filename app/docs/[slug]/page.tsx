import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { getAllDocSlugs, getDoc, getAllDocs } from "@/lib/docs";
import {
  useMDXComponents,
  Note,
  Warning,
  Tip,
  Danger,
} from "@/components/blog/mdx-components";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { BlogFooter } from "@/components/blog/blog-footer";
import { Package, Github, ExternalLink, ArrowLeft } from "lucide-react";

const BASE_URL = "https://prantadas.dev";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};

  const url = `${BASE_URL}/docs/${slug}`;

  return {
    title: `${doc.title} — Documentation`,
    description: doc.description,
    keywords: doc.tags,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "article",
      url,
      title: `${doc.title} — Documentation`,
      description: doc.description,
      siteName: "Pranta Das",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} — Documentation`,
      description: doc.description,
      creator: "@PrantaD62436311",
      site: "@PrantaD62436311",
    },
    alternates: { canonical: url },
  };
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["anchor"] },
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: true,
          defaultLang: "typescript",
        },
      ],
    ],
  },
};

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const components = useMDXComponents({ Note, Warning, Tip, Danger });

  // TechArticle / SoftwareSourceCode structured data
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${doc.title} — Documentation`,
    description: doc.description,
    author: {
      "@type": "Person",
      name: "Pranta Das",
      url: BASE_URL,
    },
    url: `${BASE_URL}/docs/${slug}`,
    mainEntityOfPage: `${BASE_URL}/docs/${slug}`,
    keywords: doc.tags.join(", "),
    inLanguage: "en-US",
    about: {
      "@type": "SoftwareSourceCode",
      name: doc.package,
      programmingLanguage: doc.language,
      codeRepository: doc.repoUrl || undefined,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Docs", item: `${BASE_URL}/docs` },
      {
        "@type": "ListItem",
        position: 3,
        name: doc.title,
        item: `${BASE_URL}/docs/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
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
                <Link
                  href="/docs"
                  className="hover:text-white/74 transition-colors"
                >
                  Docs
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                className="text-white/68 truncate max-w-[220px]"
                aria-current="page"
              >
                {doc.title}
              </li>
            </ol>
          </nav>

          <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
            {/* Main column */}
            <div>
              <header className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-5">
                  <Package className="w-3 h-3 text-primary" />
                  <span className="text-xs font-mono text-primary/70 uppercase tracking-widest">
                    Package Docs
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] font-bold text-white leading-tight mb-4">
                  {doc.title}
                </h1>
                <p className="text-white/68 text-base md:text-lg leading-relaxed mb-6">
                  {doc.description}
                </p>

                {/* Meta + external links */}
                <div className="flex flex-wrap items-center gap-3 py-5 border-y border-white/8">
                  <span className="text-[10px] font-mono px-2 py-1 rounded border border-blue-400/20 bg-blue-400/10 text-blue-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {doc.language}
                  </span>
                  <span className="text-xs font-mono text-white/62">
                    {doc.readingTime}
                  </span>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <a
                      href={doc.npmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-white/8 text-white/72 hover:border-primary/30 hover:text-primary transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      npm
                    </a>
                    {doc.repoUrl && (
                      <a
                        href={doc.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-white/8 text-white/72 hover:border-primary/30 hover:text-primary transition-all"
                      >
                        <Github className="w-3 h-3" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {/* Install command */}
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3 font-mono text-sm">
                  <span className="text-primary/60 select-none">$</span>
                  <span className="text-white/80">npm install {doc.package}</span>
                </div>
              </header>

              {/* MDX body */}
              <article className="max-w-none">
                <MDXRemote
                  source={doc.content}
                  options={mdxOptions as never}
                  components={components as never}
                />
              </article>

              {/* Footer nav */}
              <div className="mt-14 pt-8 border-t border-white/6">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 text-sm font-mono text-white/68 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All documentation
                </Link>
              </div>
            </div>

            {/* Sticky ToC sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-5rem)] flex flex-col">
                <TableOfContents content={doc.content} />
              </div>
            </aside>
          </div>
        </div>

        <BlogFooter widthClass="max-w-5xl" />
      </main>
    </>
  );
}
