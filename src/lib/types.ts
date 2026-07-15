export type BusinessStatus =
  | "demo"
  | "negociacao"
  | "aguardando_pagamento"
  | "ativo"
  | "cancelado";

export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  demo: "Demonstração",
  negociacao: "Em negociação",
  aguardando_pagamento: "Aguardando pagamento",
  ativo: "Cliente ativo",
  cancelado: "Cancelado",
};

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  whatsapp: string;
  instagram: string | null;
  email: string | null;
  city: string;
  state: string;
  address: string | null;
  opening_hours: string | null;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  hero_image_url: string | null;
  status: BusinessStatus;
  is_demo: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  position: number;
}

export interface Review {
  id: string;
  business_id: string;
  customer_name: string;
  rating: number;
  review: string;
  position: number;
}

export interface BusinessImage {
  id: string;
  business_id: string;
  image_url: string;
  caption: string | null;
  position: number;
}

export interface ServiceArea {
  id: string;
  business_id: string;
  name: string;
  position: number;
}

export interface BusinessFull extends Business {
  services: Service[];
  reviews: Review[];
  images: BusinessImage[];
  service_areas: ServiceArea[];
}

export interface ServiceInput {
  title: string;
  description: string;
}

export interface ReviewInput {
  customer_name: string;
  rating: number;
  review: string;
}

export interface ImageInput {
  image_url: string;
  caption: string;
}

export interface BusinessFormData {
  name: string;
  slug: string;
  description: string;
  whatsapp: string;
  instagram: string;
  email: string;
  city: string;
  state: string;
  address: string;
  opening_hours: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  hero_image_url: string;
  status: BusinessStatus;
  is_demo: boolean;
  published: boolean;
  services: ServiceInput[];
  reviews: ReviewInput[];
  images: ImageInput[];
  service_areas: string[];
}

export interface DashboardStats {
  total: number;
  demos: number;
  active: number;
  negotiating: number;
  awaitingPayment: number;
  cancelled: number;
}
