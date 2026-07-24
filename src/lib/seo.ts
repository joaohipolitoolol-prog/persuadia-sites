import type { Metadata } from "next";
import { isHeavyVehicleBusiness } from "@/lib/business-copy";
import type { Business } from "@/lib/types";

const SITE_NAME = "Persuadia Sites";

export function getSiteUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (fromEnv) {
    const host = fromEnv
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}

export function businessSeoPath(business: Pick<Business, "slug" | "is_demo">) {
  if (business.slug === "clima-forte") return "/";
  return `/demo/${business.slug}`;
}

export function buildBusinessMetadata(
  business: Pick<
    Business,
    | "name"
    | "slug"
    | "city"
    | "state"
    | "description"
    | "is_demo"
    | "primary_color"
  >,
  options?: { path?: string; titleSuffix?: string }
): Metadata {
  const path = options?.path ?? businessSeoPath(business);
  const heavy = isHeavyVehicleBusiness(business);

  const title =
    options?.titleSuffix != null
      ? `${options.titleSuffix} | ${business.name}`
      : heavy
        ? `${business.name} | Refrigeração de veículos pesados em ${business.city}`
        : `${business.name} | Ar-condicionado em ${business.city}`;

  const description =
    business.description?.trim() ||
    (heavy
      ? `Refrigeração e ar-condicionado de caminhões, ônibus e máquinas em ${business.city} — ${business.state}. Orçamento rápido pelo WhatsApp.`
      : `Instalação, limpeza e manutenção de ar-condicionado em ${business.city} — ${business.state}. Orçamento rápido pelo WhatsApp.`);

  const url = `${getSiteUrl()}${path}`;

  return {
    title,
    description,
    applicationName: SITE_NAME,
    authors: [{ name: business.name }],
    creator: business.name,
    keywords: heavy
      ? [
          "refrigeração",
          "ar-condicionado",
          "caminhões",
          "ônibus",
          "máquinas",
          "veículos pesados",
          business.city,
          business.state,
          business.name,
          "WhatsApp",
        ]
      : [
          "ar-condicionado",
          "instalação",
          "limpeza",
          "manutenção",
          business.city,
          business.state,
          business.name,
          "orçamento",
          "WhatsApp",
        ],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: business.name,
      title,
      description,
      images: [
        {
          url: path === "/" ? "/opengraph-image" : `${path}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${business.name} — ${business.city}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [path === "/" ? "/twitter-image" : `${path}/twitter-image`],
    },
    other: {
      "theme-color": business.primary_color,
    },
  };
}
