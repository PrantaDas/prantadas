import { ImageResponse } from "next/og";

export const alt = "Pranta Das — Backend Developer & Team Lead";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#07090d",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(0,212,255,0.18) 0%, transparent 55%), radial-gradient(circle at 85% 80%, rgba(124,58,237,0.22) 0%, transparent 55%)",
          color: "#e6edf3",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              backgroundImage:
                "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              color: "#0a0a0a",
            }}
          >
            P
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: -0.5,
              display: "flex",
            }}
          >
            prantadas.dev
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: "#f8fafc",
              display: "flex",
            }}
          >
            Pranta Das
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 500,
              color: "#cbd5e1",
              letterSpacing: -1,
              display: "flex",
            }}
          >
            Backend Developer{" "}
            <span style={{ color: "#475569", margin: "0 18px" }}>·</span> Team
            Lead
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              "Node.js",
              "TypeScript",
              "NestJS",
              "PostgreSQL",
              "Redis",
              "Distributed Systems",
            ].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "12px 22px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,212,255,0.35)",
                  backgroundColor: "rgba(0,212,255,0.08)",
                  color: "#67e8f9",
                  fontSize: 24,
                  fontWeight: 500,
                  display: "flex",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
            paddingTop: 24,
            borderTop: "1px solid rgba(148,163,184,0.18)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#94a3b8",
              display: "flex",
            }}
          >
            Dhaka, Bangladesh · 3+ years building production platforms
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#00d4ff",
              fontWeight: 600,
              display: "flex",
            }}
          >
            github.com/Prantadas
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
