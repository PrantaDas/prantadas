import mongoose, { Schema, type Document, type Model } from "mongoose";

export type ReactionType = "like" | "dislike";

export interface IReaction extends Document {
  slug: string;
  voterId: string;
  type: ReactionType;
  createdAt: Date;
}

const ReactionSchema = new Schema<IReaction>(
  {
    slug: { type: String, required: true, index: true },
    voterId: { type: String, required: true },
    type: { type: String, enum: ["like", "dislike"], required: true },
  },
  { timestamps: true },
);

// One vote per voter per post
ReactionSchema.index({ slug: 1, voterId: 1 }, { unique: true });

export const Reaction: Model<IReaction> =
  mongoose.models.Reaction ??
  mongoose.model<IReaction>("Reaction", ReactionSchema);
