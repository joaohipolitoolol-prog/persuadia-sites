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
    services: business.services.slice(0, 3).map((s) => {
      const word = s.title.split(" ")[0];
      return word.charAt(0).toUpperCase() + word.slice(1);
    }),
    badge: "Peça orçamento no WhatsApp",
  });
}
