import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

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

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    updatedAt: data.updatedAt,
    tags: data.tags ?? [],
    readingTime: rt.text,
    readingMinutes: Math.ceil(rt.minutes),
    featured: data.featured ?? false,
    coverImage: data.coverImage,
    excerpt: data.excerpt ?? data.description ?? "",
    author: AUTHOR,
    content,
  };
}

export function getAllBlogPosts(): BlogPost[] {
  const slugs = getAllSlugs();
  const posts = slugs
    .map((slug) => getBlogPost(slug))
    .filter(Boolean) as BlogPost[];

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getFeaturedPost(): BlogPost | undefined {
  return getAllBlogPosts().find((p) => p.featured);
}

export function getRelatedPosts(
  slug: string,
  tags: string[],
  limit = 3,
): BlogPost[] {
  return getAllBlogPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => tags.includes(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getAdjacentPosts(slug: string): {
  prev: BlogPost | null;
  next: BlogPost | null;
} {
  const posts = getAllBlogPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  };
}

export function getCuratedPosts(slugs: string[]): BlogPost[] {
  const all = getAllBlogPosts();
  return slugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter(Boolean) as BlogPost[];
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllBlogPosts();
  const counts: Record<string, number> = {};
  posts.forEach((p) =>
    p.tags.forEach((t) => (counts[t] = (counts[t] ?? 0) + 1)),
  );
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
