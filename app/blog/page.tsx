import type { Metadata } from "next";
import { getAllBlogPosts, getAllTags, getFeaturedPost } from "@/lib/blog";
import { BlogClient } from "@/components/blog/blog-client";

const BASE_URL = "https://prantadas.vercel.app";

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
    images: [{ url: "/photo.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Pranta Das | Engineering Articles",
    description:
      "Production-grade technical writing on TypeScript, Node.js, and distributed systems.",
    images: ["/photo.webp"],
  },
  alternates: {
    canonical: `${BASE_URL}/blog`,
    types: {
      "application/rss+xml": `${BASE_URL}/api/rss`,
    },
  },
};

export default async function BlogPage() {
  const [posts, tags, featuredPost] = await Promise.all([
    getAllBlogPosts(),
    getAllTags(),
    getFeaturedPost(),
  ]);

  return (
    <main className="min-h-screen bg-background noise-overlay">
      <BlogClient posts={posts} tags={tags} featuredPost={featuredPost} />
    </main>
  );
}
