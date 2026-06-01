import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { PageView } from "@/lib/models/page-view";

export async function POST(req: NextRequest) {
  try {
    const { path, visitorId, referrer } = await req.json();

    if (!path || !visitorId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Skip admin and API routes
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }

    const dayKey = new Date().toISOString().split("T")[0];

    await connectDB();
    await PageView.create({ path, visitorId, referrer: referrer ?? "", dayKey });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
