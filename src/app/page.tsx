import type { Metadata } from "next";
import { BusinessPage } from "@/components/business/BusinessPage";
import { DEMO_BUSINESSES } from "@/lib/demo-data";

const demo = DEMO_BUSINESSES[0];

export const metadata: Metadata = {
  title: `${demo.name} | Ar-condicionado em ${demo.city}`,
  description: `Instalação e manutenção de ar-condicionado em ${demo.city}. Solicite orçamento pelo WhatsApp.`,
};

export default function HomePage() {
  return <BusinessPage business={demo} />;
}
