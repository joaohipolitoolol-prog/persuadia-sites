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
  const badge = business.badge ?? "Orçamento no WhatsApp";
  const heroPath = business.heroImagePath || "/demo/hero-instalacao.png";
  const heroBytes = await loadLocalImage(heroPath);
  const heroSrc = heroBytes
    ? `data:image/png;base64,${heroBytes.toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          background: primary,
          color: "white",
        }}
      >
        {/* Full-bleed photo */}
        {heroSrc ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={heroSrc}
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}

        {/* Brand gradient wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `linear-gradient(105deg, ${rgba(primary, 0.94)} 0%, ${rgba(primary, 0.82)} 42%, ${rgba(secondary, 0.45)} 72%, ${rgba("#061525", 0.25)} 100%)`,
          }}
        />

        {/* Cool light bloom */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `radial-gradient(ellipse at 85% 20%, ${rgba("#7dd3fc", 0.28)} 0%, transparent 40%), radial-gradient(ellipse at 10% 90%, ${rgba("#ffffff", 0.12)} 0%, transparent 35%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "48px 56px",
          }}
        >
          {/* Top row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background: rgba("#ffffff", 0.16),
                  border: `1px solid ${rgba("#ffffff", 0.3)}`,
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                {business.name.slice(0, 1).toUpperCase()}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 20,
                    fontWeight: 600,
                    opacity: 0.85,
                    letterSpacing: 0.3,
                  }}
                >
                  {business.city} · {business.state}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 18,
                    opacity: 0.7,
                  }}
                >
                  Instalação · Limpeza · Manutenção
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 18px",
                borderRadius: 999,
                background: rgba("#061525", 0.45),
                border: `1px solid ${rgba("#ffffff", 0.22)}`,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#FBBF24",
                  fontWeight: 800,
                }}
              >
                5,0
              </div>
              <div style={{ display: "flex" }}>avaliacao dos clientes</div>
            </div>
          </div>

          {/* Hero copy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 780,
              marginTop: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "10px 16px",
                borderRadius: 999,
                background: rgba("#25D366", 0.22),
                border: "1px solid rgba(37, 211, 102, 0.55)",
                color: "#D1FAE5",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              {badge}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 76,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: -2.4,
                textShadow: "0 10px 40px rgba(0,0,0,0.35)",
              }}
            >
              {business.name}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.3,
                opacity: 0.95,
                maxWidth: 700,
              }}
            >
              Ar-condicionado com atendimento rápido em {business.city}
            </div>
          </div>

          {/* Bottom CTA row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {(services.length > 0
                ? services
                : ["Instalação", "Limpeza", "Manutenção"]
              ).map((label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    padding: "12px 18px",
                    borderRadius: 999,
                    background: rgba("#ffffff", 0.12),
                    border: `1px solid ${rgba("#ffffff", 0.24)}`,
                    fontSize: 22,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 22px",
                borderRadius: 18,
                background: "#25D366",
                color: "#052e16",
                fontSize: 24,
                fontWeight: 800,
                boxShadow: "0 12px 30px rgba(37, 211, 102, 0.35)",
              }}
            >
              Chamar no WhatsApp
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
