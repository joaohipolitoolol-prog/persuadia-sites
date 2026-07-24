import type { Business } from "@/lib/types";

function haystack(business: Pick<Business, "name" | "slug" | "description">) {
  return `${business.name} ${business.slug} ${business.description ?? ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isHeavyVehicleBusiness(
  business: Pick<Business, "name" | "slug" | "description">
) {
  const h = haystack(business);
  return /misa|veiculo pesad|caminhao|onibus|maquina|refrigeracao de veiculo|transporte refriger/.test(
    h
  );
}

export function getHeroHeadline(
  business: Pick<Business, "name" | "slug" | "description" | "city">
) {
  if (isHeavyVehicleBusiness(business)) {
    return `Refrigeração e ar-condicionado de veículos pesados em ${business.city}`;
  }
  return `Instalação e manutenção de ar-condicionado em ${business.city}`;
}

export function getHeroSupport(
  business: Pick<Business, "name" | "slug" | "description" | "city">
) {
  if (business.description?.trim()) return business.description.trim();
  if (isHeavyVehicleBusiness(business)) {
    return `Especialistas em refrigeração e climatização de caminhões, ônibus e máquinas. Diagnóstico, manutenção e atendimento técnico com resposta rápida no WhatsApp.`;
  }
  return "Atendimento para residências, empresas e comércios. Solicite seu orçamento diretamente pelo WhatsApp.";
}

export function getAboutHeadline(
  business: Pick<Business, "name" | "slug" | "description">
) {
  if (isHeavyVehicleBusiness(business)) {
    return "Especialistas em refrigeração de frota e veículos pesados";
  }
  return "Uma empresa local focada em serviços bem feitos";
}

export type BenefitItem = {
  title: string;
  text: string;
  icon: "clock" | "wallet" | "home" | "map" | "truck" | "wrench";
};

export function getBenefits(
  business: Pick<Business, "name" | "slug" | "description">
): BenefitItem[] {
  if (isHeavyVehicleBusiness(business)) {
    return [
      {
        icon: "clock",
        title: "Atendimento rápido",
        text: "Resposta ágil pelo WhatsApp para reduzir tempo parado da frota.",
      },
      {
        icon: "wrench",
        title: "Diagnóstico técnico",
        text: "Avaliação precisa em unidades de refrigeração e climatização.",
      },
      {
        icon: "truck",
        title: "Caminhões, ônibus e máquinas",
        text: "Foco em veículos pesados e operação de transporte.",
      },
      {
        icon: "map",
        title: "Atendimento na região",
        text: "Cobertura na cidade e municípios próximos.",
      },
    ];
  }

  return [
    {
      icon: "clock",
      title: "Atendimento rápido",
      text: "Resposta ágil pelo WhatsApp para agendar sua visita.",
    },
    {
      icon: "wallet",
      title: "Orçamento sem compromisso",
      text: "Você entende o serviço e o valor antes de decidir.",
    },
    {
      icon: "home",
      title: "Residencial e empresarial",
      text: "Atendimento para casas, apartamentos, lojas e escritórios.",
    },
    {
      icon: "map",
      title: "Atendimento na região",
      text: "Cobertura na cidade e municípios próximos.",
    },
  ];
}
