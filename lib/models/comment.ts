import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IComment extends Document {
  slug: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  avatar?: string;
  avatarId?: string;   // imgbb image ID for deletion
  visitorId?: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    slug:      { type: String, required: true, index: true },
    name:      { type: String, required: true, trim: true, maxlength: 50 },
    email:     { type: String, required: true, trim: true, lowercase: true },
    message:   { type: String, required: true, trim: true, maxlength: 1000 },
    rating:    { type: Number, required: true, min: 1, max: 5 },
    avatar:    { type: String },
    avatarId:  { type: String },
    visitorId: { type: String, index: true },
  },
  { timestamps: true },
);

CommentSchema.index({ slug: 1, visitorId: 1 });

export const Comment: Model<IComment> =
  mongoose.models.Comment ?? mongoose.model<IComment>("Comment", CommentSchema);
