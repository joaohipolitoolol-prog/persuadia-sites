import { ContactPageView } from "@/components/business/ContactPageView";
import { DEMO_BUSINESSES } from "@/lib/demo-data";
import { buildBusinessMetadata } from "@/lib/seo";

const demo = DEMO_BUSINESSES[0];

export const metadata = buildBusinessMetadata(demo, {
  path: "/contato",
  titleSuffix: "Fale conosco",
});

export default function ContatoPage() {
  return <ContactPageView business={demo} />;
}
