import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  tags: string[];
  featured: boolean;
  status: "published" | "draft";
  coverImage?: string;
  excerpt: string;
  content: string;
  createdAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: String, required: true },
    updatedAt: { type: String },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["published", "draft"], default: "published", index: true },
    coverImage: { type: String },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

export const BlogPostModel: Model<IBlogPost> =
  mongoose.models.BlogPost ??
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
