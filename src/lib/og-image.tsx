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

export function renderBusinessOgImage(business: OgBusiness) {
  const primary = business.primaryColor || "#0B3A66";
  const secondary = business.secondaryColor || "#1F6FB2";
  const services = (business.services ?? []).slice(0, 3);
  const badge = business.badge ?? "Orçamento no WhatsApp";

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
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 55%, #061525 100%)`,
          color: "white",
        }}
      >
        {/* Atmosphere */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: `radial-gradient(ellipse at 18% 20%, ${rgba("#ffffff", 0.18)} 0%, transparent 42%), radial-gradient(ellipse at 88% 78%, ${rgba("#7dd3fc", 0.22)} 0%, transparent 45%)`,
          }}
        />

        {/* Soft grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.12,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Decorative AC silhouette block */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: 70,
            width: 420,
            height: 420,
            borderRadius: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 36,
            background: rgba("#ffffff", 0.1),
            border: `1px solid ${rgba("#ffffff", 0.22)}`,
            transform: "rotate(8deg)",
          }}
        >
          <div
            style={{
              display: "flex",
              height: 18,
              borderRadius: 999,
              background: rgba("#ffffff", 0.35),
              width: "70%",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  height: 10,
                  borderRadius: 999,
                  background: rgba("#ffffff", 0.18 + i * 0.04),
                  width: `${88 - i * 8}%`,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 999,
                background: rgba("#7dd3fc", 0.55),
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 12,
                  borderRadius: 999,
                  background: rgba("#ffffff", 0.35),
                  display: "flex",
                }}
              />
              <div
                style={{
                  width: 90,
                  height: 10,
                  borderRadius: 999,
                  background: rgba("#ffffff", 0.22),
                  display: "flex",
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "54px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 16,
                background: rgba("#ffffff", 0.16),
                border: `1px solid ${rgba("#ffffff", 0.28)}`,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: -0.5,
              }}
            >
              {business.name.slice(0, 1).toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 999,
                background: rgba("#ffffff", 0.14),
                border: `1px solid ${rgba("#ffffff", 0.22)}`,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              {badge}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2.2,
              }}
            >
              {business.name}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 34,
                fontWeight: 500,
                opacity: 0.92,
                lineHeight: 1.25,
              }}
            >
              Ar-condicionado em {business.city} — {business.state}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                opacity: 0.82,
                lineHeight: 1.35,
                maxWidth: 680,
              }}
            >
              Instalação · Limpeza · Manutenção · Atendimento rápido
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
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
                    background: rgba("#061525", 0.35),
                    border: `1px solid ${rgba("#ffffff", 0.22)}`,
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
                gap: 10,
                fontSize: 20,
                opacity: 0.72,
                fontWeight: 500,
              }}
            >
              Site profissional · Persuadia
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
    }
  );
}
