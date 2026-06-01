"use server";

import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/comment";
import { generateCommentAvatar } from "@/lib/avatar";
import { revalidatePath } from "next/cache";

const commentSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters").max(50),
  email:   z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Comment must be at least 10 characters").max(1000),
  rating:  z.number().int().min(1, "Please select a rating").max(5),
});

export type CommentInput = z.infer<typeof commentSchema>;

export interface CommentData {
  id: string;
  name: string;
  message: string;
  rating: number;
  avatar?: string;
  createdAt: string;
}

export interface ActionResult {
  success: boolean;
  duplicate?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof CommentInput, string>>;
  avatar?: string;
}

export async function submitComment(
  slug: string,
  input: CommentInput,
  visitorId?: string,
): Promise<ActionResult> {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: ActionResult["fieldErrors"] = {};
    for (const [field, messages] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[field as keyof CommentInput] = messages?.[0];
    }
    return { success: false, fieldErrors };
  }

  await connectDB();

  if (visitorId) {
    const existing = await Comment.exists({ slug, visitorId });
    if (existing) return { success: false, duplicate: true, error: "You've already commented on this post." };
  }

  const avatarResult = await generateCommentAvatar(parsed.data.name);

  try {
    await Comment.create({
      slug,
      ...parsed.data,
      ...(avatarResult  ? { avatar: avatarResult.url, avatarId: avatarResult.imageId } : {}),
      ...(visitorId     ? { visitorId } : {}),
    });
    revalidatePath(`/blog/${slug}`);
    return { success: true, avatar: avatarResult?.url };
  } catch {
    return { success: false, error: "Failed to save comment. Please try again." };
  }
}

export async function getComments(slug: string): Promise<CommentData[]> {
  try {
    await connectDB();
    const docs = await Comment.find({ slug }).sort({ createdAt: -1 }).lean().exec();
    return docs.map((d) => ({
      id:        String(d._id),
      name:      d.name as string,
      message:   d.message as string,
      rating:    d.rating as number,
      avatar:    d.avatar as string | undefined,
      createdAt: (d.createdAt as Date).toISOString(),
    }));
  } catch {
    return [];
  }
}
