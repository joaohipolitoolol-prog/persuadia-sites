import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { DEMO_BUSINESSES } from "@/lib/demo-data";
import type {
  Business,
  BusinessFormData,
  BusinessFull,
  DashboardStats,
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "businesses.json");

async function ensureDataFile(): Promise<BusinessFull[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = (await fs.readFile(DATA_FILE, "utf-8")).trim();
    if (!raw) throw new Error("Arquivo vazio");
    const parsed = JSON.parse(raw) as BusinessFull[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("JSON inválido");
    }
    return parsed;
  } catch {
    const seed = structuredClone(DEMO_BUSINESSES);
    await fs.writeFile(DATA_FILE, JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  }
}

async function writeAll(businesses: BusinessFull[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(businesses, null, 2), "utf-8");
}

function formToBusiness(data: BusinessFormData, id: string): BusinessFull {
  const now = new Date().toISOString();

  return {
    id,
    name: data.name.trim(),
    slug: data.slug.trim(),
    description: data.description.trim() || null,
    whatsapp: data.whatsapp.trim(),
    instagram: data.instagram.trim() || null,
    email: data.email.trim() || null,
    city: data.city.trim(),
    state: data.state.trim(),
    address: data.address.trim() || null,
    opening_hours: data.opening_hours.trim() || null,
    primary_color: data.primary_color,
    secondary_color: data.secondary_color,
    logo_url: data.logo_url || null,
    hero_image_url: data.hero_image_url || null,
    status: data.status,
    is_demo: data.is_demo,
    published: data.published,
    created_at: now,
    updated_at: now,
    services: data.services
      .filter((s) => s.title.trim())
      .map((s, index) => ({
        id: randomUUID(),
        business_id: id,
        title: s.title.trim(),
        description: s.description.trim() || null,
        icon: null,
        position: index,
      })),
    reviews: data.reviews
      .filter((r) => r.customer_name.trim() && r.review.trim())
      .map((r, index) => ({
        id: randomUUID(),
        business_id: id,
        customer_name: r.customer_name.trim(),
        rating: r.rating,
        review: r.review.trim(),
        position: index,
      })),
    images: data.images
      .filter((i) => i.image_url.trim())
      .map((i, index) => ({
        id: randomUUID(),
        business_id: id,
        image_url: i.image_url.trim(),
        caption: i.caption.trim() || null,
        position: index,
      })),
    service_areas: data.service_areas
      .filter((a) => a.trim())
      .map((name, index) => ({
        id: randomUUID(),
        business_id: id,
        name: name.trim(),
        position: index,
      })),
  };
}

export async function localGetBusinessBySlug(
  slug: string
): Promise<BusinessFull | null> {
  const businesses = await ensureDataFile();
  const business = businesses.find((b) => b.slug === slug && b.published);
  return business ?? null;
}

export async function localGetBusinessById(
  id: string
): Promise<BusinessFull | null> {
  const businesses = await ensureDataFile();
  return businesses.find((b) => b.id === id) ?? null;
}

export async function localListBusinesses(): Promise<Business[]> {
  const businesses = await ensureDataFile();
  return businesses
    .map(({ services, reviews, images, service_areas, ...business }) => business)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export async function localGetDashboardStats(): Promise<DashboardStats> {
  const businesses = await localListBusinesses();
  return {
    total: businesses.length,
    demos: businesses.filter((b) => b.status === "demo").length,
    active: businesses.filter((b) => b.status === "ativo").length,
    negotiating: businesses.filter((b) => b.status === "negociacao").length,
    awaitingPayment: businesses.filter(
      (b) => b.status === "aguardando_pagamento"
    ).length,
    cancelled: businesses.filter((b) => b.status === "cancelado").length,
  };
}

export async function localSaveBusiness(
  data: BusinessFormData,
  id?: string
): Promise<{ id: string; slug: string }> {
  const businesses = await ensureDataFile();
  const businessId = id ?? randomUUID();
  const existing = id ? businesses.find((b) => b.id === id) : null;
  const next = formToBusiness(data, businessId);

  if (existing) {
    next.created_at = existing.created_at;
  }

  const without = businesses.filter((b) => b.id !== businessId);
  await writeAll([next, ...without]);

  return { id: businessId, slug: next.slug };
}

export async function localDeleteBusiness(id: string): Promise<void> {
  const businesses = await ensureDataFile();
  await writeAll(businesses.filter((b) => b.id !== id));
}

export async function localDuplicateBusiness(id: string): Promise<string> {
  const businesses = await ensureDataFile();
  const source = businesses.find((b) => b.id === id);
  if (!source) throw new Error("Empresa não encontrada");

  const newId = randomUUID();
  const baseSlug = `${source.slug}-copia`;
  let slug = baseSlug;
  let attempt = 1;

  while (businesses.some((b) => b.slug === slug)) {
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const copy: BusinessFull = {
    ...structuredClone(source),
    id: newId,
    name: `${source.name} (cópia)`,
    slug,
    status: "demo",
    is_demo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    services: source.services.map((s) => ({
      ...s,
      id: randomUUID(),
      business_id: newId,
    })),
    reviews: source.reviews.map((r) => ({
      ...r,
      id: randomUUID(),
      business_id: newId,
    })),
    images: source.images.map((i) => ({
      ...i,
      id: randomUUID(),
      business_id: newId,
    })),
    service_areas: source.service_areas.map((a) => ({
      ...a,
      id: randomUUID(),
      business_id: newId,
    })),
  };

  await writeAll([copy, ...businesses]);
  return newId;
}

export async function localSaveUpload(
  file: File,
  folder: string
): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const filepath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  return `/uploads/${folder}/${filename}`;
}
