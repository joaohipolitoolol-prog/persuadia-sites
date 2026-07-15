import type { Metadata } from "next";
import { ContactPageView } from "@/components/business/ContactPageView";
import { DEMO_BUSINESSES } from "@/lib/demo-data";

const demo = DEMO_BUSINESSES[0];

export const metadata: Metadata = {
  title: `Fale conosco | ${demo.name}`,
  description: `Entre em contato com a ${demo.name} em ${demo.city}. Solicite orçamento pelo WhatsApp.`,
};

export default function ContatoPage() {
  return <ContactPageView business={demo} />;
}
