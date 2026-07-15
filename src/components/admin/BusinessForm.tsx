"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { saveBusiness, uploadImage } from "@/lib/business-actions";
import {
  BUSINESS_STATUS_LABELS,
  type BusinessFormData,
  type BusinessFull,
  type BusinessStatus,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

const DEFAULT_SERVICES = [
  "Instalação de ar-condicionado",
  "Limpeza e higienização",
  "Manutenção preventiva",
  "Manutenção corretiva",
  "Recarga de gás",
  "Atendimento empresarial",
];

function emptyForm(): BusinessFormData {
  return {
    name: "",
    slug: "",
    description: "",
    whatsapp: "",
    instagram: "",
    email: "",
    city: "",
    state: "CE",
    address: "",
    opening_hours: "Seg a Sáb · 8h às 18h",
    primary_color: "#0B3A66",
    secondary_color: "#1F6FB2",
    logo_url: "",
    hero_image_url: "",
    status: "demo",
    is_demo: true,
    published: true,
    services: DEFAULT_SERVICES.map((title) => ({
      title,
      description: "",
    })),
    reviews: [
      { customer_name: "", rating: 5, review: "" },
      { customer_name: "", rating: 5, review: "" },
      { customer_name: "", rating: 5, review: "" },
    ],
    images: [],
    service_areas: ["Fortaleza", "Caucaia", "Maracanaú", "Eusébio", "Aquiraz"],
  };
}

function fromBusiness(business: BusinessFull): BusinessFormData {
  return {
    name: business.name,
    slug: business.slug,
    description: business.description ?? "",
    whatsapp: business.whatsapp,
    instagram: business.instagram ?? "",
    email: business.email ?? "",
    city: business.city,
    state: business.state,
    address: business.address ?? "",
    opening_hours: business.opening_hours ?? "",
    primary_color: business.primary_color,
    secondary_color: business.secondary_color,
    logo_url: business.logo_url ?? "",
    hero_image_url: business.hero_image_url ?? "",
    status: business.status,
    is_demo: business.is_demo,
    published: business.published,
    services: business.services.length
      ? business.services.map((s) => ({
          title: s.title,
          description: s.description ?? "",
        }))
      : emptyForm().services,
    reviews: business.reviews.length
      ? business.reviews.map((r) => ({
          customer_name: r.customer_name,
          rating: r.rating,
          review: r.review,
        }))
      : emptyForm().reviews,
    images: business.images.map((i) => ({
      image_url: i.image_url,
      caption: i.caption ?? "",
    })),
    service_areas: business.service_areas.length
      ? business.service_areas.map((a) => a.name)
      : emptyForm().service_areas,
  };
}

type BusinessFormProps = {
  business?: BusinessFull;
};

export function BusinessForm({ business }: BusinessFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BusinessFormData>(() =>
    business ? fromBusiness(business) : emptyForm()
  );
  const [slugManual, setSlugManual] = useState(Boolean(business));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewHref = useMemo(
    () => (form.slug ? `/demo/${form.slug}` : null),
    [form.slug]
  );

  function update<K extends keyof BusinessFormData>(
    key: K,
    value: BusinessFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManual ? prev.slug : slugify(name),
    }));
  }

  async function handleUpload(
    file: File,
    field: "logo_url" | "hero_image_url" | "gallery"
  ) {
    setUploading(field);
    setError(null);
    try {
      const folder = form.slug || "temp";
      if (field === "logo_url") {
        const url = await uploadImage(file, "logos", folder);
        update("logo_url", url);
      } else if (field === "hero_image_url") {
        const url = await uploadImage(file, "business-images", folder);
        update("hero_image_url", url);
      } else {
        const url = await uploadImage(file, "business-images", folder);
        setForm((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            { image_url: url, caption: "Foto do serviço" },
          ],
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setUploading(null);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!form.name.trim() || !form.slug.trim() || !form.whatsapp.trim() || !form.city.trim()) {
      setError("Preencha nome, slug, WhatsApp e cidade.");
      setLoading(false);
      return;
    }

    try {
      const result = await saveBusiness(form, business?.id);
      setMessage("Empresa salva com sucesso.");
      router.push(`/admin/empresas/${result.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {business ? "Editar empresa" : "Nova empresa"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Preencha os dados e gere a prévia automaticamente.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {previewHref && business ? (
            <Link
              href={previewHref}
              target="_blank"
              className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Visualizar prévia
            </Link>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Salvando..." : business ? "Salvar alterações" : "Gerar prévia"}
          </button>
        </div>
      </div>

      {message ? (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-5 space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Dados principais</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome da empresa">
            <input
              value={form.name}
              onChange={(e) => onNameChange(e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Slug do site">
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                update("slug", slugify(e.target.value));
              }}
              className={inputClass}
              required
            />
          </Field>
          <Field label="WhatsApp (com DDI)">
            <input
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              className={inputClass}
              placeholder="5585999999999"
              required
            />
          </Field>
          <Field label="Instagram">
            <input
              value={form.instagram}
              onChange={(e) => update("instagram", e.target.value)}
              className={inputClass}
              placeholder="usuario"
            />
          </Field>
          <Field label="E-mail">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Cidade">
            <input
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Estado">
            <input
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className={inputClass}
              maxLength={2}
            />
          </Field>
          <Field label="Horário de funcionamento">
            <input
              value={form.opening_hours}
              onChange={(e) => update("opening_hours", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Endereço" className="sm:col-span-2">
            <input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Descrição (opcional)" className="sm:col-span-2">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className={`${inputClass} min-h-24`}
              placeholder="Se vazio, usamos o texto padrão com nome e cidade."
            />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Aparência e status</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Cor principal">
            <input
              type="color"
              value={form.primary_color}
              onChange={(e) => update("primary_color", e.target.value)}
              className="h-11 w-full cursor-pointer rounded-md border border-slate-300 bg-white p-1"
            />
          </Field>
          <Field label="Cor secundária">
            <input
              type="color"
              value={form.secondary_color}
              onChange={(e) => update("secondary_color", e.target.value)}
              className="h-11 w-full cursor-pointer rounded-md border border-slate-300 bg-white p-1"
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value as BusinessStatus)}
              className={inputClass}
            >
              {Object.entries(BUSINESS_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <div className="space-y-3 pt-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_demo}
                onChange={(e) => update("is_demo", e.target.checked)}
              />
              Mostrar aviso de demonstração
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update("published", e.target.checked)}
              />
              Página publicada
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <UploadField
            label="Logo"
            uploading={uploading === "logo_url"}
            preview={form.logo_url}
            onFile={(file) => handleUpload(file, "logo_url")}
            onClear={() => update("logo_url", "")}
          />
          <UploadField
            label="Imagem principal (hero)"
            uploading={uploading === "hero_image_url"}
            preview={form.hero_image_url}
            onFile={(file) => handleUpload(file, "hero_image_url")}
            onClear={() => update("hero_image_url", "")}
          />
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Serviços</h2>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                services: [...prev.services, { title: "", description: "" }],
              }))
            }
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-700"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>
        <div className="space-y-3">
          {form.services.map((service, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1.2fr_auto]">
              <input
                value={service.title}
                onChange={(e) => {
                  const services = [...form.services];
                  services[index] = { ...service, title: e.target.value };
                  update("services", services);
                }}
                className={inputClass}
                placeholder="Título"
              />
              <input
                value={service.description}
                onChange={(e) => {
                  const services = [...form.services];
                  services[index] = { ...service, description: e.target.value };
                  update("services", services);
                }}
                className={inputClass}
                placeholder="Descrição curta"
              />
              <button
                type="button"
                onClick={() =>
                  update(
                    "services",
                    form.services.filter((_, i) => i !== index)
                  )
                }
                className="rounded-md p-2 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Regiões atendidas</h2>
          <button
            type="button"
            onClick={() =>
              update("service_areas", [...form.service_areas, ""])
            }
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-700"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {form.service_areas.map((area, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={area}
                onChange={(e) => {
                  const areas = [...form.service_areas];
                  areas[index] = e.target.value;
                  update("service_areas", areas);
                }}
                className={inputClass}
                placeholder="Cidade"
              />
              <button
                type="button"
                onClick={() =>
                  update(
                    "service_areas",
                    form.service_areas.filter((_, i) => i !== index)
                  )
                }
                className="rounded-md p-2 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Avaliações</h2>
          <button
            type="button"
            onClick={() =>
              update("reviews", [
                ...form.reviews,
                { customer_name: "", rating: 5, review: "" },
              ])
            }
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-700"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>
        <div className="space-y-4">
          {form.reviews.map((review, index) => (
            <div key={index} className="rounded-md border border-slate-200 p-3 space-y-2">
              <div className="grid gap-2 sm:grid-cols-[1fr_120px_auto]">
                <input
                  value={review.customer_name}
                  onChange={(e) => {
                    const reviews = [...form.reviews];
                    reviews[index] = {
                      ...review,
                      customer_name: e.target.value,
                    };
                    update("reviews", reviews);
                  }}
                  className={inputClass}
                  placeholder="Nome do cliente"
                />
                <select
                  value={review.rating}
                  onChange={(e) => {
                    const reviews = [...form.reviews];
                    reviews[index] = {
                      ...review,
                      rating: Number(e.target.value),
                    };
                    update("reviews", reviews);
                  }}
                  className={inputClass}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} estrelas
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "reviews",
                      form.reviews.filter((_, i) => i !== index)
                    )
                  }
                  className="rounded-md p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={review.review}
                onChange={(e) => {
                  const reviews = [...form.reviews];
                  reviews[index] = { ...review, review: e.target.value };
                  update("reviews", reviews);
                }}
                className={`${inputClass} min-h-20`}
                placeholder="Texto da avaliação (não invente avaliações reais)"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Galeria</h2>
          <label className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-700">
            <Upload className="h-4 w-4" />
            {uploading === "gallery" ? "Enviando..." : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file, "gallery");
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {!form.images.length ? (
          <p className="text-sm text-slate-500">
            Nenhuma imagem ainda. Faça upload ou cole URLs depois.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {form.images.map((image, index) => (
              <div key={index} className="rounded-md border border-slate-200 p-2">
                <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded bg-slate-100">
                  <Image
                    src={image.image_url}
                    alt={image.caption || "Preview"}
                    fill
                    className="object-cover"
                  />
                </div>
                <input
                  value={image.caption}
                  onChange={(e) => {
                    const images = [...form.images];
                    images[index] = { ...image, caption: e.target.value };
                    update("images", images);
                  }}
                  className={inputClass}
                  placeholder="Legenda"
                />
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "images",
                      form.images.filter((_, i) => i !== index)
                    )
                  }
                  className="mt-2 text-xs font-medium text-red-600"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end gap-2 pb-8">
        <Link
          href="/admin"
          className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Salvando..." : business ? "Salvar alterações" : "Gerar prévia"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function UploadField({
  label,
  uploading,
  preview,
  onFile,
  onClear,
}: {
  label: string;
  uploading: boolean;
  preview: string;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-700">{label}</p>
      {preview ? (
        <div className="mb-2 relative h-28 w-full overflow-hidden rounded-md bg-slate-100">
          <Image src={preview} alt={label} fill className="object-cover" />
        </div>
      ) : null}
      <div className="flex gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Upload className="h-4 w-4" />
          {uploading ? "Enviando..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
              e.target.value = "";
            }}
          />
        </label>
        {preview ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Remover
          </button>
        ) : null}
      </div>
    </div>
  );
}
