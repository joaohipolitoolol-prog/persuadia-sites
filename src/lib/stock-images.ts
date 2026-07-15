/** Imagens reais geradas para demonstração — locais em /public/demo */
export const STOCK = {
  hero: "/demo/hero-instalacao.png",
  gallery: [
    "/demo/galeria-instalacao.png",
    "/demo/galeria-manutencao.png",
    "/demo/galeria-limpeza.png",
    "/demo/galeria-split.png",
    "/demo/galeria-comercial.png",
    "/demo/galeria-tecnico.png",
  ],
} as const;

export function getDefaultHeroImage(): string {
  return STOCK.hero;
}

export function getDefaultGalleryImages(): Array<{
  url: string;
  caption: string;
}> {
  const captions = [
    "Instalação de split",
    "Manutenção preventiva",
    "Limpeza e higienização",
    "Ar-condicionado residencial",
    "Atendimento comercial",
    "Equipe técnica",
  ];
  return STOCK.gallery.map((url, i) => ({
    url,
    caption: captions[i] ?? "Serviço",
  }));
}

/** Troca SVGs antigos e Unsplash quebrado pelas fotos reais. */
export function normalizeImageUrl(
  url: string | null,
  fallback: string
): string {
  if (!url) return fallback;

  if (url.includes(".svg")) {
    const name = url.split("/").pop() ?? "";
    if (name.includes("hero")) return STOCK.hero;
    if (name.includes("instalacao")) return STOCK.gallery[0];
    if (name.includes("manutencao")) return STOCK.gallery[1];
    if (name.includes("limpeza")) return STOCK.gallery[2];
    if (name.includes("split")) return STOCK.gallery[3];
    if (name.includes("comercial")) return STOCK.gallery[4];
    if (name.includes("tecnico")) return STOCK.gallery[5];
    return fallback;
  }

  if (url.includes("unsplash.com")) {
    const idx = Math.abs(hash(url)) % STOCK.gallery.length;
    return STOCK.gallery[idx];
  }

  if (url.startsWith("/demo/")) return url;
  return url;
}

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return h;
}
