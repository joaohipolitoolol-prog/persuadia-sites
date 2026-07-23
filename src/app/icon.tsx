import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
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
          background: "linear-gradient(145deg, #0B3A66 0%, #1F6FB2 100%)",
          borderRadius: 96,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 340,
            height: 220,
            borderRadius: 36,
            background: "rgba(255,255,255,0.14)",
            border: "2px solid rgba(255,255,255,0.28)",
            gap: 16,
            padding: 28,
          }}
        >
          <div
            style={{
              width: "62%",
              height: 16,
              borderRadius: 999,
              background: "rgba(255,255,255,0.55)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: "88%",
              height: 10,
              borderRadius: 999,
              background: "rgba(125,211,252,0.7)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: "78%",
              height: 10,
              borderRadius: 999,
              background: "rgba(255,255,255,0.28)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: "70%",
              height: 10,
              borderRadius: 999,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
