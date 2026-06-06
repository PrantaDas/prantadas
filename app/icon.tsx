import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
          color: "#0a0a0a",
          fontSize: 140,
          fontWeight: 900,
          letterSpacing: -6,
          fontFamily: "system-ui, sans-serif",
          borderRadius: 36,
        }}
      >
        P
      </div>
    ),
    { ...size }
  );
}
