import { getAllBlogPosts } from "@/lib/blog";
import { NextResponse } from "next/server";

const BASE_URL = "https://prantadas.vercel.app";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getAllBlogPosts();

  const items = posts
    .map((post) => {
      const postUrl = `${BASE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const tags = post.tags
        .map((t) => `<category>${escapeXml(t)}</category>`)
        .join("");

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>prantodas043@gmail.com (Pranta Das)</author>
      ${tags}
      <content:encoded><![CDATA[${post.excerpt}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  const lastBuildDate =
    posts.length > 0
      ? new Date(posts[0].date).toUTCString()
      : new Date().toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pranta Das — Engineering Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Technical deep dives on TypeScript, Node.js, distributed systems, Web3, and software architecture by Pranta Das — Backend Engineer from Dhaka, Bangladesh.</description>
    <language>en-US</language>
    <managingEditor>prantodas043@gmail.com (Pranta Das)</managingEditor>
    <webMaster>prantodas043@gmail.com (Pranta Das)</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/photo.webp</url>
      <title>Pranta Das — Engineering Blog</title>
      <link>${BASE_URL}/blog</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
