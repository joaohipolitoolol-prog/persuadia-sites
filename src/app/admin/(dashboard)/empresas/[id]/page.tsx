import { notFound } from "next/navigation";
import { BusinessForm } from "@/components/admin/BusinessForm";
import { getBusinessById } from "@/lib/businesses";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditEmpresaPage({ params }: EditPageProps) {
  const { id } = await params;
  const business = await getBusinessById(id);

  if (!business) notFound();

  return <BusinessForm business={business} />;
}
