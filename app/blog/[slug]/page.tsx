import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import {
  getAllSlugs,
  getBlogPost,
  getRelatedPosts,
  getAdjacentPosts,
} from "@/lib/blog";
import {
  useMDXComponents,
  Note,
  Warning,
  Tip,
  Danger,
} from "@/components/blog/mdx-components";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { BlogCard } from "@/components/blog/blog-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import { LikeButton } from "@/components/blog/like-button";
import { CommentSection } from "@/components/blog/comment-section";
import { getComments } from "@/app/actions/comments";
import { getPostViews } from "@/app/actions/views";
import { getPostRating, getRatingDistribution } from "@/app/actions/ratings";
import { BookmarkButton } from "@/components/blog/bookmark-button";
import { ReadingList } from "@/components/blog/reading-list";
import { ReadCompletion } from "@/components/blog/read-completion";
import { FloatingCommentButton } from "@/components/blog/floating-comment-button";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { BlogFooter } from "@/components/blog/blog-footer";
import { EngagementModal } from "@/components/blog/engagement-modal";
import { RatingDistribution } from "@/components/blog/rating-distribution";
import { ViewCountDisplay } from "@/components/blog/view-count-display";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Github,
  Linkedin,
  Send,
  MessageSquare,
  Star,
  Tag,
} from "lucide-react";

const BASE_URL = "https://prantadas.vercel.app";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  const url = `${BASE_URL}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author.name, url: BASE_URL }],
    keywords: post.tags,
    category: post.tags[0] ?? "Engineering",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName: "Pranta Das — Engineering Blog",
      locale: "en_US",
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : new Date(post.date).toISOString(),
      authors: [`${BASE_URL}/about`],
      tags: post.tags,
      section: post.tags[0] ?? "Engineering",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@PrantaD62436311",
      site: "@PrantaD62436311",
    },
    alternates: {
      canonical: url,
      types: { "application/rss+xml": `${BASE_URL}/api/rss` },
    },
    other: {
      "article:reading_time": post.readingTime,
    },
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const [related, { prev, next }, comments, viewCount, rating, distribution] = await Promise.all([
    getRelatedPosts(slug, post.tags, 3),
    getAdjacentPosts(slug),
    getComments(slug),
    getPostViews(slug),
    getPostRating(slug),
    getRatingDistribution(slug),
  ]);

  const formattedDate = post.date
    ? format(new Date(post.date), "MMMM d, yyyy")
    : "";
  // Only surface "Updated" when the edit is genuinely newer than publication.
  const isUpdated =
    !!post.updatedAt &&
    new Date(post.updatedAt).getTime() > new Date(post.date).getTime();
  const formattedUpdated = isUpdated
    ? format(new Date(post.updatedAt!), "MMM d, yyyy")
    : null;

  const components = useMDXComponents({ Note, Warning, Tip, Danger });

  // BlogPosting structured data
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : new Date(post.date).toISOString(),
    author: {
      "@type": "Person",
      name: "Pranta Das",
      url: BASE_URL,
      jobTitle: "Backend Developer & Team Lead",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "BD",
      },
    },
    publisher: {
      "@type": "Person",
      name: "Pranta Das",
      url: BASE_URL,
    },
    url: `${BASE_URL}/blog/${slug}`,
    mainEntityOfPage: `${BASE_URL}/blog/${slug}`,
    image: `${BASE_URL}/opengraph-image.png`,
    keywords: post.tags.join(", "),
    wordCount: post.content.split(/\s+/).length,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "Blog",
      name: "Pranta Das — Engineering Blog",
      url: `${BASE_URL}/blog`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${BASE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${BASE_URL}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-background noise-overlay">
        <ReadingProgress />
        <ReadCompletion slug={post.slug} title={post.title} />
        <FloatingCommentButton commentCount={comments.length} />
        <ScrollToTop />
        <EngagementModal slug={post.slug} title={post.title} />
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center justify-between gap-4"
          >
            <ol className="flex items-center gap-2 text-sm font-mono text-white/50 min-w-0">
              <li>
                <Link
                  href="/"
                  className="hover:text-white/60 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white/60 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                className="text-white/50 truncate max-w-[220px]"
                aria-current="page"
              >
                {post.title}
              </li>
            </ol>
            <ReadingList />
          </nav>

          <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
            {/* Main column */}
            <div>
              <header className="mb-10">
                {/* Title first — most important thing on the page */}
                <h1 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] font-bold text-white leading-tight mb-4">
                  {post.title}
                </h1>
                <p className="text-white/50 text-base md:text-lg leading-relaxed mb-6">
                  {post.description}
                </p>

                {/* Byline — identity + dateline (left), engagement (right) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-5 border-y border-white/8 mb-5">
                  {/* Identity + dateline */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white/90 leading-tight">
                        {post.author.name}
                      </div>
                      <div className="mt-1 flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs font-mono text-white/55">
                        <time dateTime={new Date(post.date).toISOString()}>
                          {formattedDate}
                        </time>
                        <span className="text-white/25" aria-hidden="true">·</span>
                        <span>{post.readingTime}</span>
                        {formattedUpdated && (
                          <>
                            <span className="text-white/25" aria-hidden="true">·</span>
                            <span className="text-white/45">Updated {formattedUpdated}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center gap-4 sm:ml-auto pl-[3.375rem] sm:pl-0 text-xs font-mono">
                    <ViewCountDisplay initialCount={viewCount} />
                    {rating.count > 0 && (
                      <span
                        className="flex items-center gap-1.5 text-white/55"
                        title={`${rating.avg.toFixed(1)} / 5 from ${rating.count} rating${rating.count !== 1 ? "s" : ""}`}
                      >
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        <span className="text-yellow-400/85">{rating.avg.toFixed(1)}</span>
                        <span className="text-white/40">({rating.count})</span>
                      </span>
                    )}
                    {comments.length > 0 && (
                      <a
                        href="#comments"
                        className="flex items-center gap-1.5 text-white/55 hover:text-primary transition-colors"
                        aria-label={`Jump to ${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                        {comments.length}
                      </a>
                    )}
                  </div>
                </div>

                {/* Tags — after metadata so title is the first thing readers see */}
                <div
                  className="flex flex-wrap gap-2"
                  role="list"
                  aria-label="Post tags"
                >
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag)}`}
                      role="listitem"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/4 border border-white/8 text-white/40 text-xs font-mono hover:bg-primary/8 hover:border-primary/20 hover:text-primary/80 transition-colors"
                    >
                      <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </header>

              {/* MDX article body */}
              <article
                className="max-w-none"
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                <meta
                  itemProp="datePublished"
                  content={new Date(post.date).toISOString()}
                />
                <meta itemProp="author" content={post.author.name} />
                <MDXRemote
                  source={post.content}
                  options={mdxOptions as any}
                  components={components as any}
                />
              </article>

              {/* Like + Bookmark + Share */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-2">
                  <LikeButton slug={post.slug} />
                  <BookmarkButton slug={post.slug} title={post.title} />
                </div>
                <ShareButtons title={post.title} slug={post.slug} />
              </div>

              {/* Author card */}
              <div className="mt-12 p-5 rounded-2xl border border-white/8 bg-white/3 flex flex-col sm:flex-row gap-5 items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="w-14 h-14 rounded-full object-cover border border-white/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-white/90 mb-0.5">
                    {post.author.name}
                  </div>
                  <div className="text-xs font-mono text-primary/60 mb-2">
                    {post.author.role} · {post.author.location}
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed mb-3">
                    Backend Developer &amp; Team Lead building scalable systems
                    and sharing engineering insights from Dhaka, Bangladesh.
                  </p>
                  <nav
                    aria-label="Author social links"
                    className="flex items-center gap-3"
                  >
                    <a
                      href={post.author.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Pranta Das on GitHub"
                      className="text-white/50 hover:text-white/70 transition-colors"
                    >
                      <Github className="w-4 h-4" aria-hidden="true" />
                    </a>
                    <a
                      href={post.author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Pranta Das on LinkedIn"
                      className="text-white/50 hover:text-white/70 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" aria-hidden="true" />
                    </a>
                    <Link
                      href="/#contact"
                      aria-label="Contact Pranta Das"
                      className="text-white/50 hover:text-white/70 transition-colors"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </nav>
                </div>
              </div>

              {/* Rating distribution */}
              {rating.count > 0 && <RatingDistribution rating={rating} distribution={distribution} />}

              {/* Comments — placed here so readers can react without scrolling past "more reading" */}
              <CommentSection slug={post.slug} initialComments={comments} />

              {/* Prev / Next navigation */}
              {(prev || next) && (
                <nav
                  aria-label="Article navigation"
                  className="mt-10 grid sm:grid-cols-2 gap-3"
                >
                  {prev ? (
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="group flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/2 hover:border-primary/25 hover:bg-primary/4 transition-all duration-200"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-mono text-white/55 group-hover:text-primary/70 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        Previous
                      </span>
                      <span className="text-sm font-medium text-white/65 group-hover:text-white/90 transition-colors line-clamp-2 leading-snug">
                        {prev.title}
                      </span>
                    </Link>
                  ) : <div />}
                  {next && (
                    <Link
                      href={`/blog/${next.slug}`}
                      className="group flex flex-col gap-2 p-4 rounded-xl border border-white/10 bg-white/2 hover:border-primary/25 hover:bg-primary/4 transition-all duration-200 sm:text-right"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-mono text-white/55 group-hover:text-primary/70 transition-colors sm:justify-end">
                        Next
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-medium text-white/65 group-hover:text-white/90 transition-colors line-clamp-2 leading-snug">
                        {next.title}
                      </span>
                    </Link>
                  )}
                </nav>
              )}

              {/* Related posts */}
              {related.length > 0 && (
                <section aria-label="Related articles" className="mt-14 pt-10 border-t border-white/6">
                  <h2 className="font-display text-lg font-semibold text-white/70 mb-5">
                    Related Articles
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {related.map((p) => (
                      <BlogCard key={p.slug} post={p} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sticky ToC sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-5rem)] flex flex-col">
                <TableOfContents
                  content={post.content}
                  commentCount={comments.length}
                />
              </div>
            </aside>
          </div>
        </div>

        <BlogFooter widthClass="max-w-5xl" />
      </main>
    </>
  );
}
