import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/businesses";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderBusinessOgImage,
} from "@/lib/og-image";

export const alt = "Ar-condicionado — orçamento no WhatsApp";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  return renderBusinessOgImage({
    name: business.name,
    city: business.city,
    state: business.state,
    primaryColor: business.primary_color,
    secondaryColor: business.secondary_color,
    services: ["Instalação", "Limpeza", "Manutenção"],
    badge: "Peça orçamento no WhatsApp",
    heroImagePath: business.hero_image_url,
  });
}
