"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useMDXComponents } from "@/components/blog/mdx-components";
import { Note, Warning, Tip, Danger } from "@/components/blog/mdx-components";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { BlogCard } from "@/components/blog/blog-card";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Github,
  Linkedin,
  Mail,
  Tag,
  RefreshCw,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface BlogPostClientProps {
  post: BlogPost;
  mdxSource: MDXRemoteSerializeResult;
  related: BlogPost[];
  prev: BlogPost | null;
  next: BlogPost | null;
}

export function BlogPostClient({
  post,
  mdxSource,
  related,
  prev,
  next,
}: BlogPostClientProps) {
  const components = useMDXComponents({ Note, Warning, Tip, Danger });

  const formattedDate = post.date
    ? format(new Date(post.date), "MMMM d, yyyy")
    : "";
  const formattedUpdated = post.updatedAt
    ? format(new Date(post.updatedAt), "MMMM d, yyyy")
    : null;

  return (
    <>
      <ReadingProgress />

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm font-mono text-white/30">
            <li>
              <Link href="/" className="hover:text-white/60 transition-colors">
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
              className="text-white/50 truncate max-w-[200px]"
              aria-current="page"
            >
              {post.title}
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12 lg:items-start">
          {/* Main content */}
          <div>
            {/* Post header */}
            <header className="mb-10">
              {/* Tags */}
              <div
                className="flex flex-wrap gap-2 mb-5"
                role="list"
                aria-label="Post tags"
              >
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    role="listitem"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/8 border border-primary/15 text-primary/70 text-xs font-mono"
                  >
                    <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-[2.6rem] font-bold text-white leading-tight mb-5">
                {post.title}
              </h1>

              <p className="text-white/55 text-base md:text-lg leading-relaxed mb-7">
                {post.description}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 py-4 border-y border-white/6">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white/80">
                      {post.author.name}
                    </div>
                    <div className="text-xs text-white/35 font-mono">
                      {post.author.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 ml-auto text-xs font-mono text-white/30">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    <time dateTime={new Date(post.date).toISOString()}>
                      {formattedDate}
                    </time>
                  </span>
                  {formattedUpdated && (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                      Updated {formattedUpdated}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {post.readingTime}
                  </span>
                </div>
              </div>
            </header>

            {/* MDX Article body */}
            <article
              className="prose-blog max-w-none"
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              <meta
                itemProp="datePublished"
                content={new Date(post.date).toISOString()}
              />
              <meta itemProp="author" content={post.author.name} />
              <MDXRemote {...mdxSource} components={components} />
            </article>

            {/* Author card */}
            <div className="mt-12 p-5 rounded-2xl border border-white/8 bg-white/3 flex flex-col sm:flex-row gap-5 items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.author.avatar}
                alt={post.author.name}
                width={56}
                height={56}
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
                  Backend Developer & Team Lead building scalable systems and
                  sharing engineering insights from Dhaka, Bangladesh.
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
                    className="text-white/30 hover:text-white/70 transition-colors"
                  >
                    <Github className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href={post.author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Pranta Das on LinkedIn"
                    className="text-white/30 hover:text-white/70 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href="mailto:prantodas043@gmail.com"
                    aria-label="Email Pranta Das"
                    className="text-white/30 hover:text-white/70 transition-colors"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </div>

            {/* Prev / Next navigation */}
            {(prev || next) && (
              <nav
                aria-label="Article navigation"
                className="mt-10 grid sm:grid-cols-2 gap-4"
              >
                {prev && (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className="group flex flex-col gap-2 p-4 rounded-xl border border-white/6 hover:border-white/12 transition-colors"
                  >
                    <span className="flex items-center gap-1.5 text-xs font-mono text-white/30 group-hover:text-white/50 transition-colors">
                      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      Previous
                    </span>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors line-clamp-2 leading-snug">
                      {prev.title}
                    </span>
                  </Link>
                )}
                {next && (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="group flex flex-col gap-2 p-4 rounded-xl border border-white/6 hover:border-white/12 transition-colors sm:ml-auto sm:text-right"
                  >
                    <span className="flex items-center gap-1.5 text-xs font-mono text-white/30 group-hover:text-white/50 transition-colors sm:justify-end">
                      Next
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors line-clamp-2 leading-snug">
                      {next.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}

            {/* Related posts */}
            {related.length > 0 && (
              <section aria-label="Related articles" className="mt-12">
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

          {/* Sidebar — TOC */}
          <aside className="hidden lg:block sticky top-20">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </div>
    </>
  );
}
