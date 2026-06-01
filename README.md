# Decorisa — E-commerce Premium de Decoração Artesanal

> Design contemporâneo, artesanato em concreto, produção sob demanda.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilo | TailwindCSS + design tokens customizados |
| Animações | Framer Motion |
| Banco de dados | PostgreSQL via Supabase ou Railway |
| ORM | Prisma |
| Autenticação | NextAuth.js (Credentials + Google) |
| Estado do carrinho | Zustand (persistido em localStorage) |
| Pagamentos | Stripe · Mercado Pago · Pix |
| E-mail | Nodemailer (SMTP) |
| Tipografia | Cormorant Garamond (serif) + Jost (sans) |

---

## Estrutura do Projeto

```
decorisa/
├── prisma/
│   ├── schema.prisma          # Modelos completos do banco
│   └── seed.ts                # Dados iniciais (produtos, categorias, cupons)
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── loja/              # Catálogo com filtros
│   │   ├── produto/[slug]/    # Página de produto
│   │   ├── sobre/             # Página sobre
│   │   ├── contato/           # Formulário de contato
│   │   ├── carrinho/          # Página do carrinho
│   │   ├── checkout/          # Checkout completo
│   │   ├── cliente/           # Área do cliente
│   │   ├── admin/             # Painel administrativo
│   │   ├── login/             # Login
│   │   ├── cadastro/          # Cadastro
│   │   └── api/               # API routes
│   │       ├── auth/          # NextAuth + registro
│   │       ├── produtos/      # CRUD produtos
│   │       ├── pedidos/       # Criação e listagem de pedidos
│   │       ├── cupons/        # Validação de cupons
│   │       └── contato/       # Envio de e-mail
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── shop/              # Hero, ProductCard, seções da home
│   │   └── cart/              # CartDrawer
│   ├── context/
│   │   └── cart-store.ts      # Zustand store do carrinho
│   ├── animations/
│   │   └── variants.ts        # Framer Motion variants
│   ├── lib/
│   │   ├── prisma.ts          # Singleton Prisma client
│   │   └── auth.ts            # NextAuth options
│   ├── types/
│   │   └── index.ts           # Tipos TypeScript
│   ├── utils/
│   │   └── index.ts           # Formatadores e helpers
│   └── styles/
│       └── globals.css        # Design system + tokens
├── .env.example               # Template de variáveis
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL (Supabase, Railway, Neon ou local)

### 1. Clone e instale

```bash
git clone https://github.com/sua-org/decorisa.git
cd decorisa
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 3. Configure o banco de dados

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Criar as tabelas
npm run prisma:migrate

# Popular com dados iniciais
npm run prisma:seed
```

### 4. Inicie o servidor

```bash
npm run dev
# Acesse http://localhost:3000
```

---

## Credenciais padrão (seed)

| Tipo | E-mail | Senha |
|---|---|---|
| Admin | admin@decorisa.com.br | admin123 |

Acesse o painel em `/admin`.

---

## Deploy em Produção

### Vercel (recomendado)

```bash
# Instale a CLI
npm i -g vercel

# Deploy
vercel

# Configure as variáveis de ambiente no dashboard Vercel
```

### Railway (banco de dados)

1. Crie um projeto no [Railway](https://railway.app)
2. Adicione um serviço PostgreSQL
3. Copie a `DATABASE_URL` para suas variáveis de ambiente

### Supabase (alternativa + storage)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Use a connection string como `DATABASE_URL`
3. Configure um bucket `produtos` para imagens

---

## Funcionalidades Implementadas

### Loja
- [x] Homepage com hero, produtos em destaque, sobre, processo, diferenciais, depoimentos, newsletter
- [x] Catálogo com filtros por categoria, busca e ordenação
- [x] Página de produto com galeria, variantes, quantidade, WhatsApp
- [x] Cart drawer animado (Framer Motion)
- [x] Página do carrinho com cupom de desconto
- [x] Checkout completo com Pix, Cartão e Boleto

### Cliente
- [x] Login com credenciais e Google OAuth
- [x] Cadastro de conta
- [x] Área do cliente: pedidos, favoritos, endereços, perfil

### Admin
- [x] Dashboard com métricas, pedidos recentes, top produtos
- [x] Navegação para pedidos, produtos, clientes, banners, cupons

### Backend
- [x] API de produtos (GET + POST com auth)
- [x] API de pedidos (GET + POST com criação automática de endereço)
- [x] Validação de cupons
- [x] Envio de e-mail via SMTP
- [x] Autenticação NextAuth com Prisma adapter
- [x] Schema completo do banco com todos os relacionamentos

### UX/UI
- [x] Animações Framer Motion (fadeUp, stagger, imageReveal, drawerSlide)
- [x] Design tokens Decorisa (paleta, tipografia, espaçamento)
- [x] Responsivo (mobile-first)
- [x] Skeleton loading
- [x] Toast notifications
- [x] SEO (metadata, Open Graph, sitemap ready)

---

## Paleta de Cores

```
--cream:    #FAF8F4  (fundo principal)
--offwhite: #F5F2EC  (cards, seções alternadas)
--sand:     #E8E0D0  (bordas, separadores)
--stone:    #C8BFB0  (elementos secundários)
--cement:   #9E9589  (textos de apoio)
--warm:     #6B5E4E  (parágrafos)
--charcoal: #3D3830  (títulos secundários)
--ink:      #1A1714  (cor principal)
--accent:   #8B7355  (cor de destaque / brand)
```

---

## Cupom de Teste

Use o cupom **BEMVINDO10** para 10% de desconto no checkout.

---

## Licença

Projeto desenvolvido exclusivamente para a marca **Decorisa**.
