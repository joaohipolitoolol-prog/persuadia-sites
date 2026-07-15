import { isLocalMode } from "@/lib/config";
import { DEMO_BUSINESSES } from "@/lib/demo-data";
import {
  localGetBusinessById,
  localGetBusinessBySlug,
  localGetDashboardStats,
  localListBusinesses,
} from "@/lib/local-store";
import { createClient } from "@/lib/supabase/server";
import type {
  Business,
  BusinessFull,
  BusinessImage,
  DashboardStats,
  Review,
  Service,
  ServiceArea,
} from "@/lib/types";

async function getSupabaseBusinessBySlug(slug: string): Promise<BusinessFull | null> {
  const supabase = await createClient();

  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !business) return null;

  const [servicesRes, reviewsRes, imagesRes, areasRes] = await Promise.all([
    supabase.from("services").select("*").eq("business_id", business.id).order("position"),
    supabase.from("reviews").select("*").eq("business_id", business.id).order("position"),
    supabase.from("business_images").select("*").eq("business_id", business.id).order("position"),
    supabase.from("service_areas").select("*").eq("business_id", business.id).order("position"),
  ]);

  return {
    ...(business as Business),
    services: (servicesRes.data ?? []) as Service[],
    reviews: (reviewsRes.data ?? []) as Review[],
    images: (imagesRes.data ?? []) as BusinessImage[],
    service_areas: (areasRes.data ?? []) as ServiceArea[],
  };
}

async function getSupabaseBusinessById(id: string): Promise<BusinessFull | null> {
  const supabase = await createClient();

  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !business) return null;

  const [servicesRes, reviewsRes, imagesRes, areasRes] = await Promise.all([
    supabase.from("services").select("*").eq("business_id", business.id).order("position"),
    supabase.from("reviews").select("*").eq("business_id", business.id).order("position"),
    supabase.from("business_images").select("*").eq("business_id", business.id).order("position"),
    supabase.from("service_areas").select("*").eq("business_id", business.id).order("position"),
  ]);

  return {
    ...(business as Business),
    services: (servicesRes.data ?? []) as Service[],
    reviews: (reviewsRes.data ?? []) as Review[],
    images: (imagesRes.data ?? []) as BusinessImage[],
    service_areas: (areasRes.data ?? []) as ServiceArea[],
  };
}

export async function getBusinessBySlug(slug: string): Promise<BusinessFull | null> {
  if (isLocalMode()) {
    try {
      const business = await localGetBusinessBySlug(slug);
      if (business) return business;
    } catch {
      // fallback abaixo
    }
    return DEMO_BUSINESSES.find((b) => b.slug === slug && b.published) ?? null;
  }
  return getSupabaseBusinessBySlug(slug);
}

export async function getBusinessById(id: string): Promise<BusinessFull | null> {
  if (isLocalMode()) return localGetBusinessById(id);
  return getSupabaseBusinessById(id);
}

export async function listBusinesses(): Promise<Business[]> {
  if (isLocalMode()) return localListBusinesses();

  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as Business[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (isLocalMode()) return localGetDashboardStats();

  const businesses = await listBusinesses();
  return {
    total: businesses.length,
    demos: businesses.filter((b) => b.status === "demo").length,
    active: businesses.filter((b) => b.status === "ativo").length,
    negotiating: businesses.filter((b) => b.status === "negociacao").length,
    awaitingPayment: businesses.filter((b) => b.status === "aguardando_pagamento").length,
    cancelled: businesses.filter((b) => b.status === "cancelado").length,
  };
}
