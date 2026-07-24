import { notFound } from "next/navigation";
import { isHeavyVehicleBusiness } from "@/lib/business-copy";
import { getBusinessBySlug } from "@/lib/businesses";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderBusinessOgImage,
} from "@/lib/og-image";

export const alt = "Orcamento no WhatsApp";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  const heavy = isHeavyVehicleBusiness(business);

  return renderBusinessOgImage({
    name: business.name,
    city: business.city,
    state: business.state,
    primaryColor: business.primary_color,
    secondaryColor: business.secondary_color,
    services: heavy
      ? ["Caminhoes", "Onibus", "Maquinas"]
      : ["Instalacao", "Limpeza", "Manutencao"],
    badge: heavy
      ? "Refrigeracao de veiculos pesados"
      : "Peca orcamento no WhatsApp",
    nicheLine: heavy
      ? "Caminhoes · Onibus · Maquinas"
      : "Instalacao · Limpeza · Manutencao",
    subtitle: heavy
      ? `Refrigeracao e climatizacao de frota em ${business.city}`
      : `Ar-condicionado com atendimento rapido em ${business.city}`,
    heroImagePath: business.hero_image_url,
  });
}
