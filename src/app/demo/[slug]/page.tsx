import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessPage } from "@/components/business/BusinessPage";
import { getBusinessBySlug } from "@/lib/businesses";

type DemoPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return { title: "Empresa não encontrada" };
  }

  return {
    title: `${business.name} | Ar-condicionado em ${business.city}`,
    description:
      business.description ||
      `Instalação e manutenção de ar-condicionado em ${business.city}. Solicite orçamento pelo WhatsApp.`,
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) notFound();

  return <BusinessPage business={business} />;
}
