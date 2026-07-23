import { BusinessPage } from "@/components/business/BusinessPage";
import { DEMO_BUSINESSES } from "@/lib/demo-data";
import { buildBusinessMetadata } from "@/lib/seo";

const demo = DEMO_BUSINESSES[0];

export const metadata = buildBusinessMetadata(demo, { path: "/" });

export default function HomePage() {
  return <BusinessPage business={demo} />;
}
