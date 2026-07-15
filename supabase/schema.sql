-- Persuadia Sites — schema MVP
-- Execute no SQL Editor do Supabase

-- Extensões
create extension if not exists "pgcrypto";

-- Enum de status
do $$ begin
  create type business_status as enum (
    'demo',
    'negociacao',
    'aguardando_pagamento',
    'ativo',
    'cancelado'
  );
exception
  when duplicate_object then null;
end $$;

-- Empresas
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  whatsapp text not null,
  instagram text,
  email text,
  city text not null,
  state text not null default 'CE',
  address text,
  opening_hours text,
  primary_color text not null default '#0B3A66',
  secondary_color text not null default '#1F6FB2',
  logo_url text,
  hero_image_url text,
  status business_status not null default 'demo',
  is_demo boolean not null default true,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_slug_idx on public.businesses (slug);
create index if not exists businesses_status_idx on public.businesses (status);

-- Serviços
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  title text not null,
  description text,
  icon text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists services_business_id_idx on public.services (business_id);

-- Avaliações
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  customer_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  review text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists reviews_business_id_idx on public.reviews (business_id);

-- Imagens da galeria
create table if not exists public.business_images (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  image_url text not null,
  caption text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists business_images_business_id_idx on public.business_images (business_id);

-- Regiões atendidas
create table if not exists public.service_areas (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists service_areas_business_id_idx on public.service_areas (business_id);

-- Leads (captação — preparação futura)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  city text,
  phone text,
  whatsapp text,
  instagram text,
  website text,
  rating numeric(2,1),
  review_count int,
  last_review_date date,
  lead_score int default 0,
  contact_status text default 'novo',
  contact_date date,
  notes text,
  business_id uuid references public.businesses (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- RLS
alter table public.businesses enable row level security;
alter table public.services enable row level security;
alter table public.reviews enable row level security;
alter table public.business_images enable row level security;
alter table public.service_areas enable row level security;
alter table public.leads enable row level security;

-- Leitura pública: empresas publicadas
drop policy if exists "Public can read published businesses" on public.businesses;
create policy "Public can read published businesses"
  on public.businesses for select
  using (published = true);

drop policy if exists "Public can read services of published businesses" on public.services;
create policy "Public can read services of published businesses"
  on public.services for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = services.business_id and b.published = true
    )
  );

drop policy if exists "Public can read reviews of published businesses" on public.reviews;
create policy "Public can read reviews of published businesses"
  on public.reviews for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = reviews.business_id and b.published = true
    )
  );

drop policy if exists "Public can read images of published businesses" on public.business_images;
create policy "Public can read images of published businesses"
  on public.business_images for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_images.business_id and b.published = true
    )
  );

drop policy if exists "Public can read service areas of published businesses" on public.service_areas;
create policy "Public can read service areas of published businesses"
  on public.service_areas for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = service_areas.business_id and b.published = true
    )
  );

-- Admin autenticado: CRUD completo
drop policy if exists "Authenticated full access businesses" on public.businesses;
create policy "Authenticated full access businesses"
  on public.businesses for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated full access services" on public.services;
create policy "Authenticated full access services"
  on public.services for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated full access reviews" on public.reviews;
create policy "Authenticated full access reviews"
  on public.reviews for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated full access business_images" on public.business_images;
create policy "Authenticated full access business_images"
  on public.business_images for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated full access service_areas" on public.service_areas;
create policy "Authenticated full access service_areas"
  on public.service_areas for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated full access leads" on public.leads;
create policy "Authenticated full access leads"
  on public.leads for all
  to authenticated
  using (true)
  with check (true);

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('business-images', 'business-images', true)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "Public read logos" on storage.objects;
create policy "Public read logos"
  on storage.objects for select
  using (bucket_id = 'logos');

drop policy if exists "Authenticated upload logos" on storage.objects;
create policy "Authenticated upload logos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'logos');

drop policy if exists "Authenticated update logos" on storage.objects;
create policy "Authenticated update logos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'logos');

drop policy if exists "Authenticated delete logos" on storage.objects;
create policy "Authenticated delete logos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'logos');

drop policy if exists "Public read business images" on storage.objects;
create policy "Public read business images"
  on storage.objects for select
  using (bucket_id = 'business-images');

drop policy if exists "Authenticated upload business images" on storage.objects;
create policy "Authenticated upload business images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'business-images');

drop policy if exists "Authenticated update business images" on storage.objects;
create policy "Authenticated update business images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'business-images');

drop policy if exists "Authenticated delete business images" on storage.objects;
create policy "Authenticated delete business images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'business-images');
