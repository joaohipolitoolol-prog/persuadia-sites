# Persuadia Sites

Máquina de páginas para negócios locais de climatização.

**Já funciona localmente — sem configurar Supabase.**

## Início imediato

```bash
npm install
npm run dev
```

Abra:

| URL | O que é |
|-----|---------|
| http://localhost:3000 | Página inicial |
| http://localhost:3000/demo/clima-forte | Demo Clima Forte |
| http://localhost:3000/demo/ar-polar | Demo Ar Polar |
| http://localhost:3000/demo/climatiza-ceara | Demo Climatiza Ceará |
| http://localhost:3000/admin | Painel admin |

### Login do painel (modo local)

- **E-mail:** `admin@persuadia.local`
- **Senha:** `persuadia123`

No painel você pode cadastrar empresas, editar, duplicar, excluir e gerar prévias na hora.

## O que funciona agora

- 3 demonstrações prontas com template profissional
- Painel admin completo (CRUD)
- Upload de logo e fotos (salvos em `public/uploads/`)
- Botão WhatsApp com mensagem automática
- Faixa de demonstração (`is_demo`)
- Dados persistidos em `data/businesses.json`

## Modo local vs Supabase

Por padrão o sistema roda em **modo local** (`.env.local` já configurado).

Para produção com Supabase:

1. Crie projeto no Supabase
2. Execute `supabase/schema.sql` e `supabase/seed.sql`
3. Atualize `.env.local`:

```env
DATA_SOURCE=supabase
NEXT_PUBLIC_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

4. Crie usuário em Authentication

## Fluxo comercial

1. Cadastre empresa → **Gerar prévia**
2. Envie `/demo/slug` no WhatsApp
3. Após pagamento: `is_demo = false`, status `ativo`, conectar domínio

## Estrutura

```
src/app/demo/[slug]     → página pública
src/app/admin/          → painel
data/businesses.json    → banco local
public/uploads/         → imagens enviadas
supabase/               → SQL para produção
```
