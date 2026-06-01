import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IComment extends Document {
  slug: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    slug: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true },
);

export const Comment: Model<IComment> =
  mongoose.models.Comment ?? mongoose.model<IComment>("Comment", CommentSchema);
