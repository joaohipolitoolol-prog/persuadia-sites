-- Dados de demonstração — 3 empresas no mesmo template
-- Execute após schema.sql

-- Limpa demos anteriores (opcional em ambiente novo)
delete from public.businesses where slug in ('clima-forte', 'ar-polar', 'climatiza-ceara');

-- 1) Clima Forte
with b as (
  insert into public.businesses (
    name, slug, description, whatsapp, instagram, email,
    city, state, address, opening_hours,
    primary_color, secondary_color, hero_image_url,
    status, is_demo, published
  ) values (
    'Clima Forte',
    'clima-forte',
    null,
    '5585999999999',
    'climafortefortaleza',
    'contato@climaforte.demo',
    'Fortaleza',
    'CE',
    'Av. Beira Mar, 1000 — Aldeota (demonstração)',
    'Seg a Sáb · 8h às 18h',
    '#0B3A66',
    '#1F6FB2',
    'https://images.unsplash.com/photo-1631545806609-8cdb8bc6f6e1?auto=format&fit=crop&w=1600&q=80',
    'demo',
    true,
    true
  )
  returning id
)
insert into public.services (business_id, title, description, position)
select id, title, description, position from b,
(values
  ('Instalação de ar-condicionado', 'Instalação residencial e comercial com acabamento limpo.', 0),
  ('Limpeza e higienização', 'Limpeza completa para melhorar o ar e o rendimento.', 1),
  ('Manutenção preventiva', 'Visitas periódicas para evitar paradas e consumo alto.', 2),
  ('Manutenção corretiva', 'Diagnóstico e reparo quando o equipamento falha.', 3),
  ('Recarga de gás', 'Recarga com verificação de vazamentos.', 4),
  ('Atendimento empresarial', 'Contratos e visitas em horários comerciais.', 5)
) as s(title, description, position);

with b as (select id from public.businesses where slug = 'clima-forte')
insert into public.reviews (business_id, customer_name, rating, review, position)
select id, customer_name, rating, review, position from b,
(values
  ('Ana Souza', 5, '[DEMONSTRAÇÃO] Atendimento rápido e serviço bem feito na instalação do split.', 0),
  ('Carlos Mendes', 5, '[DEMONSTRAÇÃO] Limpeza deixa o ar bem melhor. Recomendo.', 1),
  ('Juliana Rocha', 4, '[DEMONSTRAÇÃO] Pontuais e explicaram o orçamento com clareza.', 2)
) as r(customer_name, rating, review, position);

with b as (select id from public.businesses where slug = 'clima-forte')
insert into public.business_images (business_id, image_url, caption, position)
select id, image_url, caption, position from b,
(values
  ('https://images.unsplash.com/photo-1631545806609-8cdb8bc6f6e1?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 0),
  ('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 1),
  ('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 2),
  ('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 3),
  ('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 4),
  ('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 5)
) as i(image_url, caption, position);

with b as (select id from public.businesses where slug = 'clima-forte')
insert into public.service_areas (business_id, name, position)
select id, name, position from b,
(values
  ('Fortaleza', 0),
  ('Caucaia', 1),
  ('Maracanaú', 2),
  ('Eusébio', 3),
  ('Aquiraz', 4)
) as a(name, position);

-- 2) Ar Polar
with b as (
  insert into public.businesses (
    name, slug, description, whatsapp, instagram, email,
    city, state, address, opening_hours,
    primary_color, secondary_color, hero_image_url,
    status, is_demo, published
  ) values (
    'Ar Polar',
    'ar-polar',
    null,
    '5585988888888',
    'arpolarce',
    'contato@arpolar.demo',
    'Fortaleza',
    'CE',
    'Rua dos Técnicos, 220 — Montese (demonstração)',
    'Seg a Sex · 8h às 17h30',
    '#0F4C5C',
    '#5C9EAD',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80',
    'demo',
    true,
    true
  )
  returning id
)
insert into public.services (business_id, title, description, position)
select id, title, description, position from b,
(values
  ('Instalação de ar-condicionado', 'Instalação com alinhamento e teste de funcionamento.', 0),
  ('Limpeza e higienização', 'Higienização de filtros, serpentinas e drenos.', 1),
  ('Manutenção preventiva', 'Plano simples para residências e comércios.', 2),
  ('Manutenção corretiva', 'Reparo de vazamentos, ruídos e falhas elétricas.', 3),
  ('Recarga de gás', 'Recarga com medição de pressão.', 4),
  ('Atendimento empresarial', 'Atendimento em escritórios e lojas.', 5)
) as s(title, description, position);

with b as (select id from public.businesses where slug = 'ar-polar')
insert into public.reviews (business_id, customer_name, rating, review, position)
select id, customer_name, rating, review, position from b,
(values
  ('Pedro Lima', 5, '[DEMONSTRAÇÃO] Equipe organizada e serviço sem sujeira na casa.', 0),
  ('Mariana Alves', 5, '[DEMONSTRAÇÃO] Orçamento claro e prazo cumprido.', 1),
  ('Rafael Costa', 4, '[DEMONSTRAÇÃO] Resolveram um vazamento rápido.', 2)
) as r(customer_name, rating, review, position);

with b as (select id from public.businesses where slug = 'ar-polar')
insert into public.business_images (business_id, image_url, caption, position)
select id, image_url, caption, position from b,
(values
  ('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 0),
  ('https://images.unsplash.com/photo-1631545806609-8cdb8bc6f6e1?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 1),
  ('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 2),
  ('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 3),
  ('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 4),
  ('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 5)
) as i(image_url, caption, position);

with b as (select id from public.businesses where slug = 'ar-polar')
insert into public.service_areas (business_id, name, position)
select id, name, position from b,
(values
  ('Fortaleza', 0),
  ('Maracanaú', 1),
  ('Pacajus', 2),
  ('Itaitinga', 3),
  ('Eusébio', 4)
) as a(name, position);

-- 3) Climatiza Ceará
with b as (
  insert into public.businesses (
    name, slug, description, whatsapp, instagram, email,
    city, state, address, opening_hours,
    primary_color, secondary_color, hero_image_url,
    status, is_demo, published
  ) values (
    'Climatiza Ceará',
    'climatiza-ceara',
    null,
    '5585977777777',
    'climatizaceara',
    'contato@climatizaceara.demo',
    'Caucaia',
    'CE',
    'Av. Central, 450 — Centro (demonstração)',
    'Seg a Sáb · 7h30 às 18h',
    '#1B4332',
    '#40916C',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1600&q=80',
    'negociacao',
    true,
    true
  )
  returning id
)
insert into public.services (business_id, title, description, position)
select id, title, description, position from b,
(values
  ('Instalação de ar-condicionado', 'Instalação residencial e comercial na região.', 0),
  ('Limpeza e higienização', 'Serviço completo para splits e cassete.', 1),
  ('Manutenção preventiva', 'Manutenção planejada para reduzir imprevistos.', 2),
  ('Manutenção corretiva', 'Conserto com diagnóstico transparente.', 3),
  ('Recarga de gás', 'Recarga com teste de estanqueidade.', 4),
  ('Atendimento empresarial', 'Contratos para clínicas, lojas e escritórios.', 5)
) as s(title, description, position);

with b as (select id from public.businesses where slug = 'climatiza-ceara')
insert into public.reviews (business_id, customer_name, rating, review, position)
select id, customer_name, rating, review, position from b,
(values
  ('Fernanda Dias', 5, '[DEMONSTRAÇÃO] Fizeram a manutenção do escritório no horário combinado.', 0),
  ('Bruno Nogueira', 5, '[DEMONSTRAÇÃO] Bom custo-benefício e atendimento educado.', 1),
  ('Camila Ferreira', 4, '[DEMONSTRAÇÃO] Instalação correta e explicação clara do uso.', 2)
) as r(customer_name, rating, review, position);

with b as (select id from public.businesses where slug = 'climatiza-ceara')
insert into public.business_images (business_id, image_url, caption, position)
select id, image_url, caption, position from b,
(values
  ('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 0),
  ('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 1),
  ('https://images.unsplash.com/photo-1631545806609-8cdb8bc6f6e1?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 2),
  ('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 3),
  ('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 4),
  ('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80', 'Imagem genérica de demonstração — será trocada', 5)
) as i(image_url, caption, position);

with b as (select id from public.businesses where slug = 'climatiza-ceara')
insert into public.service_areas (business_id, name, position)
select id, name, position from b,
(values
  ('Caucaia', 0),
  ('Fortaleza', 1),
  ('São Gonçalo do Amarante', 2),
  ('Maracanaú', 3),
  ('Paracuru', 4)
) as a(name, position);
