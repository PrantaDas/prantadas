import { ImageResponse } from "next/og";
import { getBlogPost } from "@/lib/blog";

export const runtime = "nodejs";
export const alt = "Pranta Das — Engineering Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  const title = post?.title ?? "Pranta Das — Engineering Blog";
  const description =
    post?.description ?? "Backend Developer & Team Lead writing about Node.js, TypeScript, and distributed systems.";
  const tags = post?.tags?.slice(0, 3) ?? [];
  const readingTime = post?.readingTime ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)",
          padding: 64,
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #00d4ff 0%, #a855f7 100%)",
          }}
        />

        {/* Top row: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              color: "#0a0a0a",
            }}
          >
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.2 }}>
              Pranta Das
            </div>
            <div style={{ fontSize: 16, color: "#00d4ff", fontFamily: "monospace" }}>
              prantadas.dev/blog
            </div>
          </div>
        </div>

        {/* Middle: title + description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            maxWidth: 1060,
          }}
        >
          <div
            style={{
              fontSize: title.length > 70 ? 56 : title.length > 40 ? 68 : 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: "#ffffff",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 980,
            }}
          >
            {description.length > 160 ? description.slice(0, 157) + "…" : description}
          </div>
        </div>

        {/* Bottom row: tags + reading time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  color: "#7fe6ff",
                  fontSize: 20,
                  fontFamily: "monospace",
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
          {readingTime && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 20,
                color: "rgba(255,255,255,0.45)",
                fontFamily: "monospace",
              }}
            >
              {readingTime}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
