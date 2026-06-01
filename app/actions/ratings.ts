"use server";

import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/comment";

export interface PostRating {
  avg: number;   // 0-5
  count: number; // number of ratings
}

/** Average rating for one post */
export async function getPostRating(slug: string): Promise<PostRating> {
  try {
    await connectDB();
    const [result] = await Comment.aggregate<{ avg: number; count: number }>([
      { $match: { slug } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    return result ? { avg: result.avg, count: result.count } : { avg: 0, count: 0 };
  } catch {
    return { avg: 0, count: 0 };
  }
}

/** Ratings for all posts — single aggregation for the listing page */
export async function getAllPostRatings(): Promise<Record<string, PostRating>> {
  try {
    await connectDB();
    const rows = await Comment.aggregate<{ _id: string; avg: number; count: number }>([
      { $group: { _id: "$slug", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    return Object.fromEntries(rows.map(({ _id, avg, count }) => [_id, { avg, count }]));
  } catch {
    return {};
  }
}

/** Rating distribution for one post — breakdown by star level */
export async function getRatingDistribution(slug: string): Promise<Record<number, number>> {
  try {
    await connectDB();
    const rows = await Comment.aggregate<{ _id: number; count: number }>([
      { $match: { slug } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rows.forEach(({ _id, count }) => {
      if (_id >= 1 && _id <= 5) dist[_id] = count;
    });
    return dist;
  } catch {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }
}
