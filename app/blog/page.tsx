import type { Metadata } from "next";
import { getAllBlogPosts, getAllTags, getFeaturedPost } from "@/lib/blog";
import { BlogClient } from "@/components/blog/blog-client";
import { BlogFooter } from "@/components/blog/blog-footer";
import { getAllPostViews } from "@/app/actions/views";
import { getAllPostRatings } from "@/app/actions/ratings";

const BASE_URL = "https://prantadas.dev";

export const metadata: Metadata = {
  title: "Blog — Engineering Articles & Technical Writing",
  description:
    "Technical deep dives by Pranta Das — TypeScript, Node.js, distributed systems, Web3, and software architecture from a Backend Engineer in Dhaka, Bangladesh.",
  openGraph: {
    title: "Blog — Pranta Das | Engineering Articles",
    description:
      "Production-grade technical writing on TypeScript, Node.js, distributed systems, and software architecture.",
    url: `${BASE_URL}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Pranta Das | Engineering Articles",
    description:
      "Production-grade technical writing on TypeScript, Node.js, and distributed systems.",
  },
  alternates: {
    canonical: `${BASE_URL}/blog`,
    types: {
      "application/rss+xml": `${BASE_URL}/api/rss`,
    },
  },
};

export default async function BlogPage() {
  const [posts, tags, featuredPost, viewCounts, ratings] = await Promise.all([
    getAllBlogPosts(),
    getAllTags(),
    getFeaturedPost(),
    getAllPostViews(),
    getAllPostRatings(),
  ]);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Pranta Das — Engineering Blog",
    url: `${BASE_URL}/blog`,
    description:
      "Technical deep dives by Pranta Das — TypeScript, Node.js, distributed systems, Web3, and software architecture.",
    inLanguage: "en-US",
    author: { "@type": "Person", name: "Pranta Das", url: BASE_URL },
    publisher: { "@type": "Person", name: "Pranta Das", url: BASE_URL },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `${BASE_URL}/blog/${p.slug}`,
      datePublished: new Date(p.date).toISOString(),
      dateModified: new Date(p.updatedAt ?? p.date).toISOString(),
      author: { "@type": "Person", name: "Pranta Das", url: BASE_URL },
      keywords: p.tags.join(", "),
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: posts.length,
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/blog/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <main className="min-h-screen bg-background noise-overlay">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <BlogClient posts={posts} tags={tags} featuredPost={featuredPost} viewCounts={viewCounts} ratings={ratings} />
      <BlogFooter widthClass="max-w-6xl" />
    </main>
  );
}
