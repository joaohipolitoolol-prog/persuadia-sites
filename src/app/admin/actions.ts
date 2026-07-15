"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminCredentials, isLocalMode } from "@/lib/config";
import {
  localDeleteBusiness,
  localDuplicateBusiness,
  localSaveBusiness,
  localSaveUpload,
} from "@/lib/local-store";
import { createClient } from "@/lib/supabase/server";
import type { BusinessFormData } from "@/lib/types";

const SESSION_COOKIE = "persuadia_admin";

export async function loginAction(email: string, password: string) {
  if (isLocalMode()) {
    const creds = getAdminCredentials();
    if (email !== creds.email || password !== creds.password) {
      return { error: "E-mail ou senha inválidos." };
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-mail ou senha inválidos." };
  return { success: true };
}

export async function logoutAction() {
  if (isLocalMode()) {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    redirect("/admin/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveBusinessAction(data: BusinessFormData, id?: string) {
  if (isLocalMode()) {
    return localSaveBusiness(data, id);
  }

  const supabase = await createClient();
  const payload = {
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
  };

  let businessId = id;

  if (businessId) {
    const { error } = await supabase
      .from("businesses")
      .update(payload)
      .eq("id", businessId);
    if (error) throw new Error(error.message);

    await Promise.all([
      supabase.from("services").delete().eq("business_id", businessId),
      supabase.from("reviews").delete().eq("business_id", businessId),
      supabase.from("business_images").delete().eq("business_id", businessId),
      supabase.from("service_areas").delete().eq("business_id", businessId),
    ]);
  } else {
    const { data: inserted, error } = await supabase
      .from("businesses")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    businessId = inserted.id;
  }

  const services = data.services
    .filter((s) => s.title.trim())
    .map((s, index) => ({
      business_id: businessId!,
      title: s.title.trim(),
      description: s.description.trim() || null,
      position: index,
    }));

  const reviews = data.reviews
    .filter((r) => r.customer_name.trim() && r.review.trim())
    .map((r, index) => ({
      business_id: businessId!,
      customer_name: r.customer_name.trim(),
      rating: r.rating,
      review: r.review.trim(),
      position: index,
    }));

  const images = data.images
    .filter((i) => i.image_url.trim())
    .map((i, index) => ({
      business_id: businessId!,
      image_url: i.image_url.trim(),
      caption: i.caption.trim() || null,
      position: index,
    }));

  const areas = data.service_areas
    .filter((a) => a.trim())
    .map((name, index) => ({
      business_id: businessId!,
      name: name.trim(),
      position: index,
    }));

  if (services.length) {
    const { error } = await supabase.from("services").insert(services);
    if (error) throw new Error(error.message);
  }
  if (reviews.length) {
    const { error } = await supabase.from("reviews").insert(reviews);
    if (error) throw new Error(error.message);
  }
  if (images.length) {
    const { error } = await supabase.from("business_images").insert(images);
    if (error) throw new Error(error.message);
  }
  if (areas.length) {
    const { error } = await supabase.from("service_areas").insert(areas);
    if (error) throw new Error(error.message);
  }

  return { id: businessId!, slug: payload.slug };
}

export async function deleteBusinessAction(id: string) {
  if (isLocalMode()) {
    await localDeleteBusiness(id);
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("businesses").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function duplicateBusinessAction(id: string) {
  if (isLocalMode()) {
    return localDuplicateBusiness(id);
  }

  const supabase = await createClient();
  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !business) {
    throw new Error(error?.message ?? "Empresa não encontrada");
  }

  const baseSlug = `${business.slug}-copia`;
  let slug = baseSlug;
  let attempt = 1;

  while (true) {
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  const { id: _id, created_at: _c, updated_at: _u, ...rest } = business;

  const { data: inserted, error: insertError } = await supabase
    .from("businesses")
    .insert({
      ...rest,
      name: `${business.name} (cópia)`,
      slug,
      status: "demo",
      is_demo: true,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    throw new Error(insertError?.message ?? "Falha ao duplicar");
  }

  const [services, reviews, images, areas] = await Promise.all([
    supabase.from("services").select("*").eq("business_id", id),
    supabase.from("reviews").select("*").eq("business_id", id),
    supabase.from("business_images").select("*").eq("business_id", id),
    supabase.from("service_areas").select("*").eq("business_id", id),
  ]);

  if (services.data?.length) {
    await supabase.from("services").insert(
      services.data.map(({ id: _sid, business_id: _bid, ...s }) => ({
        ...s,
        business_id: inserted.id,
      }))
    );
  }
  if (reviews.data?.length) {
    await supabase.from("reviews").insert(
      reviews.data.map(({ id: _rid, business_id: _bid, ...r }) => ({
        ...r,
        business_id: inserted.id,
      }))
    );
  }
  if (images.data?.length) {
    await supabase.from("business_images").insert(
      images.data.map(({ id: _iid, business_id: _bid, ...img }) => ({
        ...img,
        business_id: inserted.id,
      }))
    );
  }
  if (areas.data?.length) {
    await supabase.from("service_areas").insert(
      areas.data.map(({ id: _aid, business_id: _bid, ...a }) => ({
        ...a,
        business_id: inserted.id,
      }))
    );
  }

  return inserted.id;
}

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "general";
  const bucket = formData.get("bucket") as "logos" | "business-images" | null;

  if (!file) throw new Error("Arquivo não enviado");

  if (isLocalMode()) {
    return localSaveUpload(file, bucket ?? folder);
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket ?? "business-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket ?? "business-images").getPublicUrl(path);
  return data.publicUrl;
}
