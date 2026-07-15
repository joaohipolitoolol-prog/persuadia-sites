import type { ServiceArea } from "@/lib/types";

type ServiceAreasSectionProps = {
  areas: ServiceArea[];
  city: string;
  state?: string;
  address?: string | null;
  primaryColor: string;
};

function mapsEmbedUrl(city: string, state: string, address?: string | null) {
  const query = address?.trim()
    ? `${address}, ${city}, ${state}, Brasil`
    : `${city}, ${state}, Brasil`;
  // Formato clássico de embed do Google Maps (sem API key)
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=pt-BR&z=12&ie=UTF8&iwloc=&output=embed`;
}

function mapsSearchUrl(place: string, city: string, state: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, ${city}, ${state}, Brasil`)}`;
}

export function ServiceAreasSection({
  areas,
  city,
  state = "CE",
  address,
  primaryColor,
}: ServiceAreasSectionProps) {
  const list = areas.length
    ? areas
    : [{ id: "fallback", business_id: "", name: city, position: 0 }];

  const primary = list.find((a) => a.name === city) ?? list[0];

  return (
    <section id="regioes" className="border-b border-black/5 bg-[#f7f8fa]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Regiões atendidas
          </h2>
          <p className="mt-2 text-slate-600">
            Atendimento em {city} e municípios da Grande Fortaleza. Veja a
            cobertura no mapa.
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-black/5">
            <div className="relative aspect-[16/11] w-full bg-slate-100 sm:aspect-[16/10]">
              <iframe
                title={`Mapa de atendimento — ${city}`}
                src={mapsEmbedUrl(city, state, address)}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {/* Fallback visual caso o iframe seja bloqueado pelo navegador */}
              <noscript>
                <a
                  href={mapsSearchUrl(city, city, state)}
                  className="absolute inset-0 flex items-center justify-center bg-slate-100 text-sm font-medium text-slate-700"
                >
                  Abrir mapa no Google Maps
                </a>
              </noscript>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-500">
                Mapa interativo · Google Maps
              </p>
              <a
                href={mapsSearchUrl(city, city, state)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold hover:underline"
                style={{ color: primaryColor }}
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Municípios cobertos
            </p>
            <ul className="mt-4 space-y-2">
              {list.map((area, index) => {
                const isHub = area.name === primary.name;
                return (
                  <li key={area.id}>
                    <a
                      href={mapsSearchUrl(area.name, area.name, state)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">
                          {area.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {isHub ? "Base principal" : "Ver no mapa"}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-slate-400">
                        Maps →
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
