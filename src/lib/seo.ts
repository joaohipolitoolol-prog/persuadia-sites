import type { Metadata } from "next";
import type { Business } from "@/lib/types";

const SITE_NAME = "Persuadia Sites";

export function getSiteUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (fromEnv) {
    const host = fromEnv.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}

export function businessSeoPath(business: Pick<Business, "slug" | "is_demo">) {
  // Home mostra o primeiro demo; demos ficam em /demo/[slug]
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
  const title =
    options?.titleSuffix != null
      ? `${options.titleSuffix} | ${business.name}`
      : `${business.name} | Ar-condicionado em ${business.city}`;

  const description =
    business.description?.trim() ||
    `Instalação, limpeza e manutenção de ar-condicionado em ${business.city} — ${business.state}. Orçamento rápido pelo WhatsApp.`;

  const url = `${getSiteUrl()}${path}`;

  return {
    title,
    description,
    applicationName: SITE_NAME,
    authors: [{ name: business.name }],
    creator: business.name,
    keywords: [
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
          alt: `${business.name} — ar-condicionado em ${business.city}`,
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
