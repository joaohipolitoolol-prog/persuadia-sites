import { SafeImage } from "./SafeImage";
import type { BusinessImage } from "@/lib/types";
import {
  getDefaultGalleryImages,
  normalizeImageUrl,
  STOCK,
} from "@/lib/stock-images";

type GallerySectionProps = {
  images: BusinessImage[];
  isDemo: boolean;
  primaryColor?: string;
};

export function GallerySection({
  images,
  isDemo,
  primaryColor = "#0B3A66",
}: GallerySectionProps) {
  const defaults = getDefaultGalleryImages();
  const list = (
    images.length
      ? images.slice(0, 6).map((img, i) => ({
          ...img,
          image_url: normalizeImageUrl(
            img.image_url,
            defaults[i]?.url ?? STOCK.gallery[0]
          ),
          caption: defaults[i]?.caption ?? img.caption,
        }))
      : defaults.map((d, i) => ({
          id: `default-${i}`,
          business_id: "",
          image_url: d.url,
          caption: d.caption,
          position: i,
        }))
  );

  return (
    <section id="galeria" className="border-b border-black/5 bg-[#f7f8fa]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Galeria
          </h2>
          <p className="mt-2 text-slate-600">
            {isDemo
              ? "Fotos ilustrativas dos serviços. Na versão final, usamos as imagens reais da empresa."
              : "Alguns dos trabalhos realizados pela equipe."}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {list.map((image) => (
            <figure
              key={image.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-200 ring-1 ring-black/5"
            >
              <SafeImage
                src={image.image_url}
                alt={image.caption || "Foto do serviço"}
                sizes="(max-width: 1024px) 50vw, 33vw"
                primaryColor={primaryColor}
                fallbackLabel={image.caption || "Serviço"}
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              {image.caption ? (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 pt-8 pb-3 text-xs font-medium text-white">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
