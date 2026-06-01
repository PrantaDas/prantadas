"use server";

import { connectDB } from "@/lib/db";
import { Reaction, type ReactionType } from "@/lib/models/reaction";
import { revalidatePath } from "next/cache";

export interface ReactionCounts {
  likes: number;
  dislikes: number;
  userVote: ReactionType | null;
}

export async function getReactions(
  slug: string,
  voterId: string,
): Promise<ReactionCounts> {
  try {
    await connectDB();
    const [likes, dislikes, existing] = await Promise.all([
      Reaction.countDocuments({ slug, type: "like" }),
      Reaction.countDocuments({ slug, type: "dislike" }),
      Reaction.findOne({ slug, voterId }).lean(),
    ]);
    return {
      likes,
      dislikes,
      userVote: existing ? (existing.type as ReactionType) : null,
    };
  } catch {
    return { likes: 0, dislikes: 0, userVote: null };
  }
}

export async function toggleReaction(
  slug: string,
  voterId: string,
  type: ReactionType,
): Promise<ReactionCounts> {
  await connectDB();

  const existing = await Reaction.findOne({ slug, voterId });

  if (existing) {
    if (existing.type === type) {
      // Same button clicked again — remove vote
      await Reaction.deleteOne({ _id: existing._id });
    } else {
      // Switch vote
      existing.type = type;
      await existing.save();
    }
  } else {
    await Reaction.create({ slug, voterId, type });
  }

  revalidatePath(`/blog/${slug}`);
  return getReactions(slug, voterId);
}
