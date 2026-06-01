import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { getAllBlogPosts, getAllTags } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";

const BASE_URL = "https://prantadas.vercel.app";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const allPosts = await getAllBlogPosts();
  const posts = allPosts.filter((p) => p.tags.includes(decoded));
  if (posts.length === 0) return {};

  const count = posts.length;
  return {
    title: `#${decoded} — Blog`,
    description: `${count} article${count > 1 ? "s" : ""} tagged with "${decoded}" by Pranta Das.`,
    openGraph: {
      title: `#${decoded} — Pranta Das Blog`,
      description: `${count} article${count > 1 ? "s" : ""} tagged with "${decoded}".`,
      url: `${BASE_URL}/blog/tag/${tag}`,
      type: "website",
      images: [{ url: "/photo.webp", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `#${decoded} — Pranta Das Blog`,
      description: `${count} article${count > 1 ? "s" : ""} tagged with "${decoded}".`,
      images: ["/photo.webp"],
    },
    alternates: { canonical: `${BASE_URL}/blog/tag/${tag}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const allPosts = await getAllBlogPosts();
  const posts = allPosts.filter((p) => p.tags.includes(decoded));

  if (posts.length === 0) notFound();

  return (
    <main className="min-h-screen bg-background noise-overlay">
      {/* Nav */}
      <nav
        className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-md"
        aria-label="Blog navigation"
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/45 hover:text-white/80 transition-colors text-sm font-mono group"
            aria-label="Back to blog"
          >
            <ArrowLeft
              className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Blog
          </Link>
          <span className="text-white/20 text-xs font-mono tracking-widest uppercase">
            Tag
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/8 border border-primary/15 text-primary text-sm font-mono mb-5">
            <Tag className="w-3.5 h-3.5" aria-hidden="true" />
            {decoded}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            Articles tagged &ldquo;{decoded}&rdquo;
          </h1>
          <p className="text-white/35 font-mono text-sm">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </p>
        </header>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-14 pt-8 border-t border-white/6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-mono text-white/35 hover:text-white/65 transition-colors group"
          >
            <ArrowLeft
              className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            All articles
          </Link>
        </div>
      </div>
    </main>
  );
}
