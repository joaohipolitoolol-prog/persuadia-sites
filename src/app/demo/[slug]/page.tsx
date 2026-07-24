import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessPage } from "@/components/business/BusinessPage";
import { getBusinessBySlug } from "@/lib/businesses";
import { buildBusinessMetadata } from "@/lib/seo";

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

  return buildBusinessMetadata(business, { path: `/demo/${slug}` });
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) notFound();

  return <BusinessPage business={business} homeHref={`/demo/${slug}`} />;
}
