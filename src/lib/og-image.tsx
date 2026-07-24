import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type OgBusiness = {
  name: string;
  city: string;
  state: string;
  primaryColor: string;
  secondaryColor: string;
  services?: string[];
  badge?: string;
  heroImagePath?: string | null;
  subtitle?: string;
  nicheLine?: string;
};

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function rgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

async function loadLocalImage(relativePath: string) {
  const clean = relativePath.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", clean);
  try {
    return await readFile(filePath);
  } catch {
    return null;
  }
}

export async function renderBusinessOgImage(business: OgBusiness) {
  const primary = business.primaryColor || "#0B3A66";
  const secondary = business.secondaryColor || "#1F6FB2";
  const services = (business.services ?? []).slice(0, 3);
  const badge = business.badge ?? "Orcamento no WhatsApp";
  const nicheLine =
    business.nicheLine ?? "Instalacao · Limpeza · Manutencao";
  const subtitle =
    business.subtitle ??
    `Ar-condicionado com atendimento rapido em ${business.city}`;
  const heroPath = business.heroImagePath || "/demo/hero-instalacao.png";
  const heroBytes = await loadLocalImage(heroPath);
  const heroSrc = heroBytes
    ? `data:image/png;base64,${heroBytes.toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          background: primary,
          color: "#ffffff",
        }}
      >
        {heroSrc ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={heroSrc}
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1200px",
              height: "630px",
              objectFit: "cover",
              objectPosition: "70% center",
            }}
          />
        ) : null}

        {/* Strong left panel for readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "720px",
            height: "630px",
            display: "flex",
            background: `linear-gradient(90deg, ${rgba(primary, 0.97)} 0%, ${rgba(primary, 0.9)} 58%, ${rgba(primary, 0.35)} 82%, transparent 100%)`,
          }}
        />

        {/* Soft bottom fade */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "180px",
            display: "flex",
            background: `linear-gradient(180deg, transparent 0%, ${rgba("#04111f", 0.55)} 100%)`,
          }}
        />

        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "40px",
            width: "320px",
            height: "320px",
            borderRadius: "999px",
            display: "flex",
            background: rgba(secondary, 0.35),
          }}
        />

        {/* Main copy block */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "56px",
            width: "640px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: rgba("#ffffff", 0.16),
                border: "1px solid rgba(255,255,255,0.28)",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              {business.name.slice(0, 1).toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                {business.city} - {business.state}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "18px",
                  opacity: 0.8,
                }}
              >
                {nicheLine}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 16px",
              borderRadius: "999px",
              background: "rgba(37, 211, 102, 0.2)",
              border: "1px solid rgba(37, 211, 102, 0.55)",
              color: "#D1FAE5",
              fontSize: "20px",
              fontWeight: 700,
              marginBottom: "18px",
            }}
          >
            {badge}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              marginBottom: "16px",
            }}
          >
            {business.name}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "30px",
              fontWeight: 500,
              lineHeight: 1.3,
              opacity: 0.95,
              maxWidth: "560px",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Rating chip */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: "48px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 18px",
            borderRadius: "999px",
            background: "rgba(4, 17, 31, 0.62)",
            border: "1px solid rgba(255,255,255,0.22)",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", color: "#FBBF24", fontWeight: 800 }}>
            5,0
          </div>
          <div style={{ display: "flex" }}>avaliacao</div>
        </div>

        {/* Bottom services */}
        <div
          style={{
            position: "absolute",
            left: "56px",
            bottom: "48px",
            display: "flex",
            gap: "12px",
          }}
        >
          {(services.length > 0
            ? services
            : ["Instalacao", "Limpeza", "Manutencao"]
          ).map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.24)",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div
          style={{
            position: "absolute",
            right: "48px",
            bottom: "48px",
            display: "flex",
            padding: "16px 22px",
            borderRadius: "18px",
            background: "#25D366",
            color: "#052e16",
            fontSize: "24px",
            fontWeight: 800,
          }}
        >
          Chamar no WhatsApp
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
