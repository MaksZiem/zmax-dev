import { ImageResponse } from "next/og";

export const alt = "Maksymilian Ziembicki – Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#3ccf91";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          padding: "0 96px",
          background: "#0a0a0b",
          color: "#ededef",
        }}
      >
        <svg width="280" height="280" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="14" fill="#131315" stroke="#232327" strokeWidth="1" />
          <polygon
            points="18,16 46,16 46,22.5 27.8,41.5 46,41.5 46,48 18,48 18,41.5 36.2,22.5 18,22.5"
            fill={ACCENT}
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>Maksymilian</div>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>Ziembicki</div>
          <div style={{ marginTop: 28, fontSize: 40, color: ACCENT }}>Full-Stack Developer</div>
          <div style={{ marginTop: 14, fontSize: 28, color: "#9a9aa3" }}>TypeScript · NestJS · Next.js · AI</div>
          <div style={{ marginTop: 44, fontSize: 26, color: "#9a9aa3" }}>zmax-dev.pl</div>
        </div>
      </div>
    ),
    size,
  );
}
