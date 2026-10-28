import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/constants";

export const alt = "Mai Tri Thanh — Fullstack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette mirrors app/globals.css: navy ink, cool paper, marigold accent.
const NAVY = "#161e45";
const PAPER = "#f4f6fb";
const MARIGOLD = "#f5b731";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: NAVY,
        color: PAPER,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 640,
          height: 640,
          right: -120,
          top: -10,
          borderRadius: 999,
          background: MARIGOLD,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 250,
          fontWeight: 700,
          letterSpacing: -14,
          color: NAVY,
          paddingRight: 100,
        }}
      >
        MT
      </div>
      <div
        style={{
          position: "absolute",
          width: 640,
          height: 640,
          right: -60,
          top: 50,
          borderRadius: 999,
          border: `2px solid ${PAPER}`,
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 60,
          display: "flex",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 3,
        }}
      >
        MAI TRI THANH
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 190,
          display: "flex",
          flexDirection: "column",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -5,
          lineHeight: 1.02,
        }}
      >
        <span>Building</span>
        <span style={{ color: MARIGOLD }}>better web.</span>
        <span style={{ marginTop: 28, fontSize: 28, fontWeight: 400, letterSpacing: 0, color: "#b4bbd6" }}>
          Fullstack Developer · Next.js / React / Laravel
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: 72,
          display: "flex",
          alignItems: "center",
          fontSize: 24,
          color: MARIGOLD,
        }}
      >
        {new URL(SITE_URL).host} ↗
      </div>
    </div>,
    size,
  );
}
