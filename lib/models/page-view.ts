import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPageView extends Document {
  path: string;
  visitorId: string;
  referrer: string;
  dayKey: string; // "YYYY-MM-DD"
  createdAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
  {
    path: { type: String, required: true, index: true },
    visitorId: { type: String, required: true, index: true },
    referrer: { type: String, default: "" },
    dayKey: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

export const PageView: Model<IPageView> =
  mongoose.models.PageView ??
  mongoose.model<IPageView>("PageView", PageViewSchema);
