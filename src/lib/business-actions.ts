"use client";

import { saveBusinessAction, uploadImageAction } from "@/app/admin/actions";
import type { BusinessFormData } from "@/lib/types";

export async function saveBusiness(
  data: BusinessFormData,
  id?: string
): Promise<{ id: string; slug: string }> {
  return saveBusinessAction(data, id);
}

export async function deleteBusiness(id: string): Promise<void> {
  const { deleteBusinessAction } = await import("@/app/admin/actions");
  await deleteBusinessAction(id);
}

export async function duplicateBusiness(id: string): Promise<string> {
  const { duplicateBusinessAction } = await import("@/app/admin/actions");
  return duplicateBusinessAction(id);
}

export async function uploadImage(
  file: File,
  bucket: "logos" | "business-images",
  folder: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  formData.append("folder", folder);
  return uploadImageAction(formData);
}
