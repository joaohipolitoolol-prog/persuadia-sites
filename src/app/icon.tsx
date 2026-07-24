import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Favicon padrão Persuadia — letra P, legível em 16px. */
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
          background: "linear-gradient(145deg, #0B3A66 0%, #1A6BB5 100%)",
          borderRadius: 112,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 420,
            height: 420,
            borderRadius: 96,
            background: "rgba(255,255,255,0.12)",
            border: "6px solid rgba(255,255,255,0.22)",
            color: "#ffffff",
            fontSize: 280,
            fontWeight: 800,
            letterSpacing: -12,
            lineHeight: 1,
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          }}
        >
          P
        </div>
      </div>
    ),
    { ...size }
  );
}
