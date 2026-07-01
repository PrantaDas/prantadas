import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllDocs } from "@/lib/docs";

const BASE_URL = "https://prantadas.dev";

// Stable fallback for routes whose content rarely changes. Bump when you make a
// meaningful edit to /now, /uses, or /docs. Avoid `new Date()` in a sitemap —
// a lastmod that changes on every revalidate is noise Google learns to ignore.
const STATIC_LASTMOD = new Date("2026-07-01");

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts().catch(() => []);

  // Newest post date drives the freshness of the home + blog-index pages.
  const latestPost = posts.reduce<Date>((max, p) => {
    const d = new Date(p.updatedAt ?? p.date);
    return d > max ? d : max;
  }, STATIC_LASTMOD);

  const docs = getAllDocs();
  const docEntries: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: `${BASE_URL}/docs/${doc.slug}`,
    lastModified: STATIC_LASTMOD,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.date),
    changeFrequency: "monthly",
    priority: 0.8,
    images: [`${BASE_URL}/blog/${post.slug}/opengraph-image`],
  }));

  // Tag archives are intentionally excluded — they're noindexed (thin/duplicate
  // hubs) and advertising them in the sitemap only wastes crawl budget.

  return [
    {
      url: BASE_URL,
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/now`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/uses`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...docEntries,
    ...blogEntries,
  ];
}
