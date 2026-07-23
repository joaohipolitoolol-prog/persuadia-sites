import { DEMO_BUSINESSES } from "@/lib/demo-data";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderBusinessOgImage,
} from "@/lib/og-image";

export const alt = "Clima Forte — ar-condicionado em Fortaleza";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const business = DEMO_BUSINESSES[0];
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
