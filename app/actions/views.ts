"use server";

import { connectDB } from "@/lib/db";
import { PageView } from "@/lib/models/page-view";

/** Unique visitor count for one blog post */
export async function getPostViews(slug: string): Promise<number> {
  try {
    await connectDB();
    const ids = await PageView.distinct("visitorId", { path: `/blog/${slug}` });
    return ids.length;
  } catch {
    return 0;
  }
}

/** Unique visitor counts for every post — used on the blog listing page */
export async function getAllPostViews(): Promise<Record<string, number>> {
  try {
    await connectDB();
    const rows = await PageView.aggregate<{ _id: string; count: number }>([
      { $match: { path: { $regex: "^/blog/[^/]+$" } } },
      { $group: { _id: "$path", visitors: { $addToSet: "$visitorId" } } },
      { $project: { _id: 1, count: { $size: "$visitors" } } },
    ]);
    return Object.fromEntries(
      rows.map(({ _id, count }) => [_id.replace("/blog/", ""), count]),
    );
  } catch {
    return {};
  }
}
