import readingTime from "reading-time";
import { connectDB } from "./db";
import { BlogPostModel } from "./models/blog-post";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  tags: string[];
  readingTime: string;
  readingMinutes: number;
  featured?: boolean;
  coverImage?: string;
  excerpt: string;
  author: Author;
  content: string;
}

export interface Author {
  name: string;
  role: string;
  location: string;
  avatar: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export const AUTHOR: Author = {
  name: "Pranta Das",
  role: "Backend Developer & Team Lead",
  location: "Dhaka, Bangladesh 🇧🇩",
  avatar: "/photo.webp",
  twitter: "@prantadas",
  github: "https://github.com/Prantadas",
  linkedin: "https://linkedin.com/in/pranta-das7",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToPost(doc: any): BlogPost {
  const rt = readingTime(doc.content ?? "");
  return {
    slug: doc.slug,
    title: doc.title ?? doc.slug,
    description: doc.description ?? "",
    date: doc.date ?? "",
    updatedAt: doc.updatedAt,
    tags: doc.tags ?? [],
    readingTime: rt.text,
    readingMinutes: Math.ceil(rt.minutes),
    featured: doc.featured ?? false,
    coverImage: doc.coverImage,
    excerpt: doc.excerpt ?? doc.description ?? "",
    author: AUTHOR,
    content: doc.content ?? "",
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

const PUBLISHED = { status: "published" } as const;

export async function getAllSlugs(): Promise<string[]> {
  await connectDB();
  const docs = await BlogPostModel.find(PUBLISHED, { slug: 1, _id: 0 }).lean();
  return docs.map((d) => d.slug as string);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  await connectDB();
  const doc = await BlogPostModel.findOne({ slug, ...PUBLISHED }).lean();
  if (!doc) return null;
  return docToPost(doc);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  await connectDB();
  const docs = await BlogPostModel.find(PUBLISHED).sort({ date: -1 }).lean();
  return docs.map(docToPost);
}

export async function getFeaturedPost(): Promise<BlogPost | undefined> {
  await connectDB();
  const doc = await BlogPostModel.findOne({ featured: true, ...PUBLISHED }).lean();
  return doc ? docToPost(doc) : undefined;
}

export async function getRelatedPosts(
  slug: string,
  tags: string[],
  limit = 3,
): Promise<BlogPost[]> {
  await connectDB();
  const docs = await BlogPostModel.find({
    slug: { $ne: slug },
    tags: { $in: tags },
    ...PUBLISHED,
  })
    .sort({ date: -1 })
    .lean();

  return docs
    .map((d) => ({
      post: docToPost(d),
      score: (d.tags as string[]).filter((t) => tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export async function getAdjacentPosts(slug: string): Promise<{
  prev: BlogPost | null;
  next: BlogPost | null;
}> {
  const posts = await getAllBlogPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  };
}

export async function getCuratedPosts(slugs: string[]): Promise<BlogPost[]> {
  await connectDB();
  const docs = await BlogPostModel.find({ slug: { $in: slugs } }).lean();
  const map = new Map(docs.map((d) => [d.slug as string, docToPost(d)]));
  return slugs.map((s) => map.get(s)).filter(Boolean) as BlogPost[];
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  await connectDB();
  const result = await BlogPostModel.aggregate([
    { $match: PUBLISHED },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return result.map((r) => ({ tag: r._id as string, count: r.count as number }));
}
