"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/comment";
import { BlogPostModel } from "@/lib/models/blog-post";
import { PageView } from "@/lib/models/page-view";

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function adminLogin(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  const validEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password || email !== validEmail || password !== validPassword) {
    return { error: "Invalid email or password" };
  }

  const jar = await cookies();
  jar.set("admin_token", process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function adminLogout() {
  const jar = await cookies();
  jar.delete("admin_token");
  redirect("/admin");
}

// ── Comments ──────────────────────────────────────────────────────────────────
export interface AdminComment {
  id: string;
  slug: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  createdAt: string;
}

export async function getAllCommentsAdmin(): Promise<AdminComment[]> {
  await connectDB();
  const docs = await Comment.find({}).sort({ createdAt: -1 }).lean().exec();
  return docs.map((d) => ({
    id: String(d._id),
    slug: d.slug as string,
    name: d.name as string,
    email: d.email as string,
    message: d.message as string,
    rating: d.rating as number,
    createdAt: (d.createdAt as Date).toISOString(),
  }));
}

export async function deleteComment(id: string): Promise<void> {
  await connectDB();
  await Comment.findByIdAndDelete(id);
  revalidatePath("/admin/dashboard/comments");
}

// ── Blog upload ───────────────────────────────────────────────────────────────
export interface CreatePostInput {
  title: string;
  description: string;
  excerpt: string;
  date: string;
  tags: string;
  featured: boolean;
  status: "published" | "draft";
  content: string;
}

export interface ParsedMDX {
  title: string;
  description: string;
  excerpt: string;
  date: string;
  tags: string;
  featured: boolean;
  content: string;
}

export async function parseMDXContent(raw: string): Promise<ParsedMDX> {
  const { data, content } = matter(raw.trim());
  const tags = Array.isArray(data.tags)
    ? data.tags.join(", ")
    : typeof data.tags === "string"
      ? data.tags
      : "";

  const today = new Date().toISOString().split("T")[0];
  const rawDate = data.date;
  const dateStr =
    rawDate instanceof Date
      ? rawDate.toISOString().split("T")[0]
      : typeof rawDate === "string"
        ? rawDate
        : today;

  return {
    title: data.title ?? "",
    description: data.description ?? "",
    excerpt: data.excerpt ?? data.description ?? "",
    date: dateStr,
    tags,
    featured: data.featured ?? false,
    content: content.trim(),
  };
}

export interface CreatePostResult {
  success: boolean;
  slug?: string;
  error?: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createBlogPost(
  input: CreatePostInput,
): Promise<CreatePostResult> {
  if (!input.title || !input.content) {
    return { success: false, error: "Title and content are required." };
  }

  const slug = slugify(input.title);
  const tagsArray = input.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await connectDB();

  const existing = await BlogPostModel.findOne({ slug });
  if (existing) {
    return { success: false, error: `A post with slug "${slug}" already exists.` };
  }

  await BlogPostModel.create({
    slug,
    title: input.title,
    description: input.description,
    date: input.date,
    tags: tagsArray,
    featured: input.featured,
    status: input.status ?? "published",
    excerpt: input.excerpt,
    content: input.content,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  return { success: true, slug };
}

export interface EditPostInput {
  title: string;
  description: string;
  excerpt: string;
  date: string;
  tags: string;
  featured: boolean;
  status: "published" | "draft";
  content: string;
}

export async function getPostForEdit(slug: string): Promise<(EditPostInput & { slug: string }) | null> {
  await connectDB();
  const doc = await BlogPostModel.findOne({ slug }).lean();
  if (!doc) return null;
  return {
    slug: doc.slug as string,
    title: doc.title as string,
    description: doc.description as string ?? "",
    excerpt: doc.excerpt as string ?? "",
    date: doc.date as string,
    tags: Array.isArray(doc.tags) ? (doc.tags as string[]).join(", ") : "",
    featured: doc.featured as boolean ?? false,
    status: (doc.status ?? "published") as "published" | "draft",
    content: doc.content as string,
  };
}

export async function updateBlogPost(
  slug: string,
  input: EditPostInput,
): Promise<CreatePostResult> {
  if (!input.title || !input.content) {
    return { success: false, error: "Title and content are required." };
  }
  await connectDB();
  const tagsArray = input.tags.split(",").map((t) => t.trim()).filter(Boolean);
  await BlogPostModel.findOneAndUpdate(
    { slug },
    {
      title: input.title,
      description: input.description,
      excerpt: input.excerpt,
      date: input.date,
      tags: tagsArray,
      featured: input.featured,
      status: input.status,
      content: input.content,
    },
  );
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/dashboard/blog/manage");
  return { success: true, slug };
}

// ── Post management ───────────────────────────────────────────────────────────
export interface AdminPost {
  slug: string;
  title: string;
  date: string;
  status: "published" | "draft";
  featured: boolean;
  tags: string[];
}

export async function getAllPostsAdmin(): Promise<AdminPost[]> {
  await connectDB();
  const docs = await BlogPostModel.find(
    {},
    { slug: 1, title: 1, date: 1, status: 1, featured: 1, tags: 1 },
  )
    .sort({ date: -1 })
    .lean();

  return docs.map((d) => ({
    slug: d.slug as string,
    title: d.title as string,
    date: d.date as string,
    status: (d.status ?? "published") as "published" | "draft",
    featured: d.featured as boolean,
    tags: d.tags as string[],
  }));
}

export async function togglePostStatus(slug: string): Promise<void> {
  await connectDB();
  const doc = await BlogPostModel.findOne({ slug });
  if (!doc) return;
  doc.status = doc.status === "published" ? "draft" : "published";
  await doc.save();
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/dashboard/blog/manage");
}

export async function deletePost(slug: string): Promise<void> {
  await connectDB();
  await BlogPostModel.deleteOne({ slug });
  revalidatePath("/blog");
  revalidatePath("/admin/dashboard/blog/manage");
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export type AnalyticsPeriod = "week" | "month" | "year";

export interface ChartPoint { label: string; views: number; visitors: number }
export interface TopPage { path: string; views: number }
export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  topPages: TopPage[];
  chart: ChartPoint[];
}

export async function getAnalytics(period: AnalyticsPeriod): Promise<AnalyticsData> {
  await connectDB();

  const now = new Date();

  // Date range — use UTC getters so keys match the UTC-based dayKey values in DB
  const utcNowY = now.getUTCFullYear();
  const utcNowM = now.getUTCMonth();
  const utcNowD = now.getUTCDate();

  let from: Date;
  if (period === "week")        from = new Date(Date.UTC(utcNowY, utcNowM, utcNowD - 6));
  else if (period === "month")  from = new Date(Date.UTC(utcNowY, utcNowM, utcNowD - 29));
  else                          from = new Date(Date.UTC(utcNowY - 1, utcNowM, utcNowD));

  const fromKey  = from.toISOString().split("T")[0];
  const todayKey = now.toISOString().split("T")[0];

  const [allDocs, todayDocs] = await Promise.all([
    PageView.find({ dayKey: { $gte: fromKey } }).lean(),
    PageView.find({ dayKey: todayKey }).lean(),
  ]);

  const totalViews = allDocs.length;
  const uniqueVisitors = new Set(allDocs.map((d) => d.visitorId as string)).size;
  const todayViews = todayDocs.length;

  // Top pages
  const pageCounts: Record<string, number> = {};
  for (const d of allDocs) {
    const p = d.path as string;
    pageCounts[p] = (pageCounts[p] ?? 0) + 1;
  }
  const topPages: TopPage[] = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, views]) => ({ path, views }));

  // Build chart buckets — use UTC throughout to match how dayKey is stored
  // (track route uses new Date().toISOString().split("T")[0] which is UTC)
  const utcY = now.getUTCFullYear();
  const utcM = now.getUTCMonth();
  const utcD = now.getUTCDate();

  const chart: ChartPoint[] = [];

  if (period === "week") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.UTC(utcY, utcM, utcD - i));
      const key = d.toISOString().split("T")[0];
      const dayDocs = allDocs.filter((x) => x.dayKey === key);
      chart.push({
        label: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
        views: dayDocs.length,
        visitors: new Set(dayDocs.map((x) => x.visitorId as string)).size,
      });
    }
  } else if (period === "month") {
    for (let w = 3; w >= 0; w--) {
      const weekStart = new Date(Date.UTC(utcY, utcM, utcD - w * 7 - 6));
      const weekEnd   = new Date(Date.UTC(utcY, utcM, utcD - w * 7));
      const startKey  = weekStart.toISOString().split("T")[0];
      const endKey    = weekEnd.toISOString().split("T")[0];
      const weekDocs  = allDocs.filter((x) => x.dayKey >= startKey && x.dayKey <= endKey);
      chart.push({
        label: `W${4 - w}`,
        views: weekDocs.length,
        visitors: new Set(weekDocs.map((x) => x.visitorId as string)).size,
      });
    }
  } else {
    // Last 12 months — build month keys in UTC so they match stored dayKeys
    for (let m = 11; m >= 0; m--) {
      const d = new Date(Date.UTC(utcY, utcM - m, 1));
      const monthKey = d.toISOString().slice(0, 7); // "YYYY-MM" in UTC
      const monthDocs = allDocs.filter((x) => (x.dayKey as string).startsWith(monthKey));
      chart.push({
        label: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
        views: monthDocs.length,
        visitors: new Set(monthDocs.map((x) => x.visitorId as string)).size,
      });
    }
  }

  return { totalViews, uniqueVisitors, todayViews, topPages, chart };
}

// ── Migration: filesystem MDX → MongoDB ──────────────────────────────────────

export interface MigrateResult {
  migrated: string[];
  skipped: string[];
  errors: { slug: string; error: string }[];
}

export async function migrateBlogs(): Promise<MigrateResult> {
  const BLOG_DIR = path.join(process.cwd(), "content", "blog");
  const result: MigrateResult = { migrated: [], skipped: [], errors: [] };

  if (!fs.existsSync(BLOG_DIR)) {
    return result;
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"));

  await connectDB();

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    try {
      const existing = await BlogPostModel.findOne({ slug });
      if (existing) {
        result.skipped.push(slug);
        continue;
      }

      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);

      await BlogPostModel.create({
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: typeof data.date === "string" ? data.date : String(data.date ?? ""),
        updatedAt: data.updatedAt,
        tags: Array.isArray(data.tags) ? data.tags : [],
        featured: data.featured ?? false,
        status: "published",
        coverImage: data.coverImage,
        excerpt: data.excerpt ?? data.description ?? "",
        content,
      });

      result.migrated.push(slug);
    } catch (err) {
      result.errors.push({
        slug,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  return result;
}
