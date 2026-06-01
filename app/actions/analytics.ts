"use server";

import { connectDB } from "@/lib/db";
import { PageView } from "@/lib/models/page-view";

export async function trackPageView(
  pathname: string,
  visitorId: string,
  referrer?: string,
): Promise<void> {
  try {
    await connectDB();
    const dayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    await PageView.create({
      path: pathname,
      visitorId,
      referrer: referrer || "",
      dayKey,
    });
  } catch {
    // silently ignore tracking errors (e.g. duplicate key)
  }
}
