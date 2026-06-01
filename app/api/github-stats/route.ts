import { NextResponse } from "next/server";

export const revalidate = 3600; // cache for 1 hour

interface GitHubEvent {
  type: string;
  created_at: string;
  payload?: { commits?: unknown[] };
}

export async function GET() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "prantadas-portfolio",
    };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      "https://api.github.com/users/Prantadas/events?per_page=100",
      { headers, next: { revalidate: 3600 } },
    );

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const events: GitHubEvent[] = await res.json();
    const pushEvents = events.filter((e) => e.type === "PushEvent");

    // Unique days that had at least one push (UTC dates)
    const days = new Set(pushEvents.map((e) => e.created_at.slice(0, 10)));

    // Commits today
    const today = new Date().toISOString().slice(0, 10);
    const todayCommits = pushEvents
      .filter((e) => e.created_at.startsWith(today))
      .reduce((sum, e) => sum + (e.payload?.commits?.length ?? 1), 0);

    // Consecutive-day streak (working backwards from today or yesterday)
    let streak = 0;
    const cursor = new Date();
    // If nothing today, start from yesterday
    if (!days.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);

    for (let i = 0; i < 90; i++) {
      const key = cursor.toISOString().slice(0, 10);
      if (!days.has(key)) break;
      streak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    return NextResponse.json({ streak, todayCommits });
  } catch {
    return NextResponse.json({ streak: 0, todayCommits: 0 });
  }
}
