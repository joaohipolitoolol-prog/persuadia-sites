import type { CSSProperties } from "react";
import type { BusinessFull } from "@/lib/types";
import {
  getAboutHeadline,
  getBenefits,
  getHeroHeadline,
  getHeroSupport,
} from "@/lib/business-copy";
import {
  buildWhatsAppUrl,
  defaultWhatsAppMessage,
} from "@/lib/utils";
import {
  getDefaultGalleryImages,
  getDefaultHeroImage,
  normalizeImageUrl,
} from "@/lib/stock-images";
import { AboutSection } from "./AboutSection";
import { BenefitsSection } from "./BenefitsSection";
import { BusinessFooter } from "./BusinessFooter";
import { BusinessHeader } from "./BusinessHeader";
import { BusinessHero } from "./BusinessHero";
import { ClaraAssistant } from "./ClaraAssistant";
import { ContactSection } from "./ContactSection";
import { DemoBanner } from "./DemoBanner";
import { GallerySection } from "./GallerySection";
import { QuoteSection } from "./QuoteSection";
import { ReviewsSection } from "./ReviewsSection";
import { ServiceAreasSection } from "./ServiceAreasSection";
import { ServicesSection } from "./ServicesSection";

type BusinessPageProps = {
  business: BusinessFull;
  homeHref?: string;
};

function normalizeBusiness(business: BusinessFull): BusinessFull {
  const galleryDefaults = getDefaultGalleryImages();

  return {
    ...business,
    hero_image_url: normalizeImageUrl(
      business.hero_image_url,
      getDefaultHeroImage()
    ),
    images: business.images.map((img, i) => ({
      ...img,
      image_url: normalizeImageUrl(
        img.image_url,
        galleryDefaults[i]?.url ?? galleryDefaults[0].url
      ),
    })),
  };
}

export function BusinessPage({
  business: raw,
  homeHref = "/",
}: BusinessPageProps) {
  const business = normalizeBusiness(raw);
  const whatsappUrl = buildWhatsAppUrl(
    business.whatsapp,
    defaultWhatsAppMessage(business.name)
  );

  return (
    <div
      className="min-h-screen bg-white text-slate-900"
      style={
        {
          "--business-primary": business.primary_color,
          "--business-secondary": business.secondary_color,
        } as CSSProperties
      }
    >
      {business.is_demo ? <DemoBanner /> : null}
      <BusinessHeader
        name={business.name}
        logoUrl={business.logo_url}
        whatsapp={business.whatsapp}
        whatsappUrl={whatsappUrl}
        primaryColor={business.primary_color}
        secondaryColor={business.secondary_color}
        homeHref={homeHref}
      />
      <main>
        <BusinessHero
          name={business.name}
          city={business.city}
          headline={getHeroHeadline(business)}
          description={getHeroSupport(business)}
          heroImageUrl={business.hero_image_url}
          whatsappUrl={whatsappUrl}
          primaryColor={business.primary_color}
        />
        <BenefitsSection
          primaryColor={business.primary_color}
          items={getBenefits(business)}
        />
        <ServicesSection
          services={business.services}
          primaryColor={business.primary_color}
        />
        <QuoteSection
          name={business.name}
          city={business.city}
          whatsappUrl={whatsappUrl}
          primaryColor={business.primary_color}
        />
        <AboutSection
          name={business.name}
          city={business.city}
          description={business.description}
          headline={getAboutHeadline(business)}
          primaryColor={business.primary_color}
        />
        <GallerySection
          images={business.images}
          isDemo={business.is_demo}
          primaryColor={business.primary_color}
        />
        <ReviewsSection
          reviews={business.reviews}
          primaryColor={business.primary_color}
        />
        <ServiceAreasSection
          areas={business.service_areas}
          city={business.city}
          state={business.state}
          address={business.address}
          primaryColor={business.primary_color}
        />
        <ContactSection
          name={business.name}
          address={business.address}
          openingHours={business.opening_hours}
          city={business.city}
          state={business.state}
          whatsapp={business.whatsapp}
          whatsappUrl={whatsappUrl}
          email={business.email}
          instagram={business.instagram}
          primaryColor={business.primary_color}
        />
      </main>
      <BusinessFooter
        name={business.name}
        city={business.city}
        state={business.state}
        whatsapp={business.whatsapp}
        instagram={business.instagram}
        email={business.email}
      />
      <ClaraAssistant
        businessName={business.name}
        city={business.city}
        state={business.state}
        whatsapp={business.whatsapp}
        openingHours={business.opening_hours}
        address={business.address}
        serviceAreas={business.service_areas.map((a) => a.name)}
        services={business.services.map((s) => s.title)}
        primaryColor={business.primary_color}
      />
    </div>
  );
}
