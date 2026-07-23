import { DEMO_BUSINESSES } from "@/lib/demo-data";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderBusinessOgImage,
} from "@/lib/og-image";

export const alt = "Fale conosco — Clima Forte";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const business = DEMO_BUSINESSES[0];
  return renderBusinessOgImage({
    name: business.name,
    city: business.city,
    state: business.state,
    primaryColor: business.primary_color,
    secondaryColor: business.secondary_color,
    services: ["WhatsApp", "Orçamento", "Contato"],
    badge: "Fale conosco",
  });
}
