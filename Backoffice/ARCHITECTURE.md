# Plataforma SaaS Multi-Tenant — SmartHive Solutions Backoffice

## Contexto

Negócio de consultoria digital com múltiplos clientes (cave-lounge, porto-dos-ribeiros, cleaning-website, etc.). O objetivo é criar uma plataforma SaaS onde o admin (Miguel) gere todos os clientes, e cada cliente acede ao seu próprio painel para editar o conteúdo do website. O diretório `Backoffice/` está vazio e pronto para começar. O `platform-demo-next/` será usado como referência de UI/UX.

---

## Stack Recomendada

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Frontend | Next.js 15 (App Router, TypeScript) | Já usado nos outros projetos, SSR + SSG nativo |
| UI | Tailwind CSS + shadcn/ui | Consistente com os projetos existentes |
| Estado Global | Zustand | Simples, sem boilerplate do Redux |
| Backend API | Next.js Route Handlers (API Routes) | Monorepo sem servidor separado inicial |
| ORM | Prisma | Type-safe, migrations automáticas, excelente DX |
| Base de Dados | PostgreSQL (local: Docker; produção: Neon/Supabase) | Relacional, escalável, suporta RLS |
| Autenticação | NextAuth.js v5 (Auth.js) | JWT + sessions, fácil de expandir para 2FA/OAuth |
| Upload de Imagens | Local (dev) → Cloudflare R2 (prod) | Mais barato que S3, CDN global incluído |
| Email | Resend + React Email | Simples, moderno, bom free tier |
| Validação | Zod | Runtime + type inference, integra com Prisma |
| Deploy | Vercel (frontend) + Railway (PostgreSQL) | Zero-config, CI/CD automático via GitHub |
| Monitoring | Vercel Analytics + Sentry | Gratuito para começar |
| Futuro Billing | Stripe | Padrão da indústria para SaaS |

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET / CDN                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              VERCEL EDGE NETWORK                            │
│                                                             │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │  Backoffice     │    │   Client Websites (Static)   │   │
│  │  (Next.js 15)   │    │   cave-lounge.vercel.app     │   │
│  │  /admin/*       │    │   cleaning.vercel.app        │   │
│  │  /dashboard/*   │    │   porto-ribeiros.vercel.app  │   │
│  │  /api/*         │    │   (rebuilt on Publish click) │   │
│  └────────┬────────┘    └──────────────────────────────┘   │
└───────────┼─────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────┐
│              DATABASE LAYER (Railway / Neon)                │
│                                                             │
│   PostgreSQL                  Cloudflare R2                 │
│   ├── tenants                 └── /images/{tenantId}/...    │
│   ├── users                                                 │
│   ├── sessions                                              │
│   ├── plans                                                 │
│   ├── subscriptions                                         │
│   ├── websites                                              │
│   ├── website_contents                                      │
│   ├── media_files                                           │
│   ├── events                                                │
│   ├── social_links                                          │
│   └── audit_logs                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrutura de Pastas

```
Backoffice/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx                  ← AdminLayout com sidebar
│   │   ├── dashboard/page.tsx          ← métricas globais
│   │   ├── clients/
│   │   │   ├── page.tsx               ← lista de clientes
│   │   │   ├── new/page.tsx           ← criar cliente
│   │   │   └── [tenantId]/page.tsx    ← editar cliente
│   │   ├── plans/page.tsx             ← gestão de planos
│   │   └── logs/page.tsx              ← audit logs
│   ├── (client)/
│   │   ├── layout.tsx                  ← ClientLayout com sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── website/
│   │   │   ├── page.tsx               ← editor de conteúdo
│   │   │   ├── images/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   └── social/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── admin/
│       │   ├── tenants/route.ts
│       │   ├── tenants/[id]/route.ts
│       │   └── impersonate/route.ts
│       ├── client/
│       │   ├── website/route.ts
│       │   ├── images/route.ts
│       │   ├── events/route.ts
│       │   └── publish/route.ts
│       └── webhooks/
│           └── stripe/route.ts
├── components/
│   ├── ui/                            ← shadcn/ui components
│   ├── admin/                         ← componentes admin
│   │   ├── AdminSidebar.tsx
│   │   ├── ClientCard.tsx
│   │   ├── MetricsGrid.tsx
│   │   └── ImpersonateButton.tsx
│   └── client/                        ← componentes cliente
│       ├── ClientSidebar.tsx
│       ├── ContentEditor.tsx
│       ├── ImageUploader.tsx
│       ├── EventForm.tsx
│       └── PublishButton.tsx
├── lib/
│   ├── auth.ts                        ← NextAuth config
│   ├── prisma.ts                      ← Prisma client singleton
│   ├── r2.ts                          ← Cloudflare R2 client
│   ├── permissions.ts                 ← RBAC helpers
│   ├── publish.ts                     ← lógica de redeploy
│   └── validations.ts                 ← schemas Zod
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── middleware.ts                       ← proteção de rotas por role
├── .env.local
└── package.json
```

---

## Schema da Base de Dados (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  CLIENT
}

enum PlanType {
  FREE
  LANDING
  LANDING_SUBSCRIPTION
}

enum TenantStatus {
  ACTIVE
  SUSPENDED
  TRIAL
}

model Tenant {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique   // ex: "cave-lounge"
  status      TenantStatus @default(TRIAL)
  planId      String?
  plan        Plan?        @relation(fields: [planId], references: [id])
  users       User[]
  website     Website?
  mediaFiles  MediaFile[]
  auditLogs   AuditLog[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Plan {
  id          String     @id @default(cuid())
  name        String
  type        PlanType
  priceEur    Float
  features    Json       // { hasLanding: true, hasSubscription: false, ... }
  tenants     Tenant[]
  createdAt   DateTime   @default(now())
}

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  passwordHash   String
  name           String
  role           Role      @default(CLIENT)
  tenantId       String?
  tenant         Tenant?   @relation(fields: [tenantId], references: [id])
  sessions       Session[]
  auditLogs      AuditLog[]
  resetToken     String?
  resetTokenExp  DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Website {
  id          String           @id @default(cuid())
  tenantId    String           @unique
  tenant      Tenant           @relation(fields: [tenantId], references: [id])
  contents    WebsiteContent[]
  events      Event[]
  socialLinks SocialLink[]
  publishedAt DateTime?
  isDraft     Boolean          @default(true)
  vercelUrl   String?          // URL do website publicado
  updatedAt   DateTime         @updatedAt
}

model WebsiteContent {
  id        String   @id @default(cuid())
  websiteId String
  website   Website  @relation(fields: [websiteId], references: [id])
  key       String   // ex: "hero.title", "about.text", "hero.image"
  value     String   @db.Text
  updatedAt DateTime @updatedAt

  @@unique([websiteId, key])
}

model MediaFile {
  id         String   @id @default(cuid())
  tenantId   String
  tenant     Tenant   @relation(fields: [tenantId], references: [id])
  filename   String
  url        String   // URL pública (R2 / local)
  r2Key      String   // ex: "tenantId/images/hero.jpg"
  size       Int
  mimeType   String
  uploadedAt DateTime @default(now())
}

model Event {
  id          String   @id @default(cuid())
  websiteId   String
  website     Website  @relation(fields: [websiteId], references: [id])
  title       String
  description String?  @db.Text
  date        DateTime
  price       Float?
  capacity    Int?
  imageUrl    String?
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SocialLink {
  id        String  @id @default(cuid())
  websiteId String
  website   Website @relation(fields: [websiteId], references: [id])
  platform  String  // "instagram", "facebook", "tiktok", etc.
  url       String
  icon      String  // nome do ícone Lucide
  order     Int     @default(0)
}

model AuditLog {
  id        String   @id @default(cuid())
  tenantId  String?
  tenant    Tenant?  @relation(fields: [tenantId], references: [id])
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  action    String   // "PUBLISH", "UPDATE_CONTENT", "CREATE_TENANT", etc.
  metadata  Json?
  createdAt DateTime @default(now())
}
```

---

## Sistema de Autenticação

### Fluxo de Login

```
User submits login form
  → POST /api/auth/signin (NextAuth)
  → Verifica credenciais no DB (bcrypt compare)
  → Cria JWT com { userId, tenantId, role }
  → Middleware lê JWT e protege rotas
  → Admin → /admin/dashboard
  → Client → /dashboard
```

### Configuração NextAuth (`lib/auth.ts`)

```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { tenant: true }
        })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.tenantId = user.tenantId
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      session.user.tenantId = token.tenantId
      return session
    }
  },
  pages: { signIn: "/login" }
})
```

### Middleware de Proteção de Rotas (`middleware.ts`)

```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (!session && pathname.startsWith("/dashboard"))
    return NextResponse.redirect(new URL("/login", req.url))
  if (!session && pathname.startsWith("/admin"))
    return NextResponse.redirect(new URL("/login", req.url))
  if (session?.user.role !== "ADMIN" && pathname.startsWith("/admin"))
    return NextResponse.redirect(new URL("/dashboard", req.url))
})

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"]
}
```

---

## Isolamento Multi-Tenant

**Regra fundamental: toda query ao DB de um cliente deve incluir `tenantId` como filtro.**

```typescript
// lib/permissions.ts
export async function getClientWebsite(tenantId: string) {
  return prisma.website.findUnique({
    where: { tenantId },  // ← sempre filtrar por tenantId
    include: { contents: true, events: true, socialLinks: true }
  })
}
```

### Impersonation (Admin entrar no painel de cliente)

```typescript
// POST /api/admin/impersonate
export async function POST(req: Request) {
  const session = await auth()
  if (session?.user.role !== "ADMIN")
    return Response.json({ error: "Forbidden" }, { status: 403 })

  const { tenantId } = await req.json()
  // Gera token temporário de 1h para o tenant especificado
  // Redireciona admin para /dashboard como se fosse o cliente
}
```

---

## Armazenamento de Imagens

### Desenvolvimento Local

```
public/uploads/{tenantId}/hero.jpg
public/uploads/{tenantId}/events/event-1.jpg
```

### Produção — Cloudflare R2

**Porquê R2?** 10GB gratuito, CDN global sem egress fees, API compatível com S3.

**Estrutura de chaves:**
```
{tenantId}/images/{uuid}-{filename}
{tenantId}/events/{uuid}-{filename}
{tenantId}/gallery/{uuid}-{filename}
```

```typescript
// lib/r2.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(tenantId: string, file: Buffer, filename: string, mimeType: string) {
  const key = `${tenantId}/images/${Date.now()}-${filename}`
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: mimeType,
  }))
  return { key, url: `${process.env.R2_PUBLIC_URL}/${key}` }
}
```

---

## Sistema de Publish e Redeploy Automático

### Fluxo

```
1. Cliente clica "Publicar"
2. POST /api/client/publish
3. Backend: isDraft=false, publishedAt=now, AuditLog gravado
4. Backend chama Vercel Deploy Hook do website do cliente
5. Vercel faz build → website atualizado automaticamente
6. UI mostra "Website publicado!"
```

```typescript
// lib/publish.ts
export async function triggerClientRedeploy(tenantSlug: string) {
  const hookUrl = process.env[`DEPLOY_HOOK_${tenantSlug.toUpperCase().replace(/-/g, "_")}`]
  if (!hookUrl) throw new Error(`No deploy hook for tenant: ${tenantSlug}`)
  const res = await fetch(hookUrl, { method: "POST" })
  return res.ok
}
```

### Websites cliente buscam dados ao build

```typescript
// cave-lounge/app/page.tsx
export default async function HomePage() {
  const res = await fetch(`${process.env.BACKOFFICE_API_URL}/api/public/cave-lounge`, {
    next: { revalidate: 0 }
  })
  const data = await res.json()
  return <Hero title={data["hero.title"]} image={data["hero.image"]} />
}
```

---

## Estrutura de Planos SaaS

| Plano | Preço | Landing | Subscrição | Max Imagens | Domínio próprio |
|-------|-------|---------|-----------|-------------|-----------------|
| Gratuito | €0 | ❌ | ❌ | 5 | ❌ |
| Landing Page | €49/mês | ✅ | ❌ | 20 | ✅ |
| Landing + Subscrição | €99/mês | ✅ | ✅ | 100 | ✅ |

---

## Estrutura de Permissões (RBAC)

| Ação | Admin | Client |
|------|-------|--------|
| Ver todos os tenants | ✅ | ❌ |
| Criar/editar/suspender tenants | ✅ | ❌ |
| Mudar plano de tenant | ✅ | ❌ |
| Ver logs de qualquer tenant | ✅ | ❌ |
| Impersonar cliente | ✅ | ❌ |
| Editar conteúdo próprio | ✅ | ✅ |
| Publicar website próprio | ✅ | ✅ |
| Upload de imagens (limite por plano) | ✅ | ✅ |
| Ver dados de outro tenant | ❌ | ❌ |

---

## Roadmap por Fases

### Fase 1 — MVP (2-3 semanas)
- [ ] Setup Next.js 15 + Tailwind + shadcn/ui
- [ ] Docker Compose PostgreSQL local
- [ ] Schema Prisma + migration + seed (1 admin, 2 tenants)
- [ ] Autenticação NextAuth (login/logout/middleware)
- [ ] Admin: lista clientes, criar cliente, editar plano
- [ ] Client: dashboard, editor de conteúdo (hero, textos)
- [ ] API pública `GET /api/public/[slug]`
- [ ] Upload imagens local

### Fase 2 — Core Features (2-3 semanas)
- [ ] Gestão de eventos
- [ ] Gestão de redes sociais
- [ ] Publish + Vercel Deploy Hook
- [ ] Audit logs
- [ ] Recuperação de password (Resend)
- [ ] Impersonation admin → cliente

### Fase 3 — Produção (1-2 semanas)
- [ ] DB → Railway ou Neon
- [ ] Imagens → Cloudflare R2
- [ ] Deploy Backoffice → Vercel
- [ ] Domínios personalizados
- [ ] Sentry + Vercel Analytics

### Fase 4 — Billing (futura)
- [ ] Stripe subscriptions
- [ ] Webhook Stripe
- [ ] Portal cliente Stripe
- [ ] Feature flags por plano

---

## Variáveis de Ambiente (`.env.local`)

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/smarthive_backoffice"

# NextAuth
NEXTAUTH_SECRET="gera-com-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudflare R2 (produção)
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME="smarthive-media"
R2_PUBLIC_URL="https://media.smarthive.pt"

# Email
RESEND_API_KEY=""

# Deploy Hooks Vercel
DEPLOY_HOOK_CAVE_LOUNGE=""
DEPLOY_HOOK_PORTO_RIBEIROS=""
DEPLOY_HOOK_CLEANING=""
```

---

## Docker Compose — PostgreSQL Local

```yaml
# docker-compose.yml
version: "3.9"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: smarthive_backoffice
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Passos para Começar (Sequência Exata)

```bash
# 1. Iniciar PostgreSQL
docker-compose up -d

# 2. Scaffold Next.js (dentro de Backoffice/)
npx create-next-app@latest . --typescript --tailwind --app --no-git

# 3. Dependências
npm install prisma @prisma/client next-auth@beta bcryptjs zod @aws-sdk/client-s3 resend
npm install -D @types/bcryptjs

# 4. Prisma
npx prisma init
# → colar schema acima em prisma/schema.prisma
npx prisma migrate dev --name init

# 5. shadcn/ui
npx shadcn@latest init

# 6. Seed
npx prisma db seed
```
