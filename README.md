# Decorisa — E-commerce Premium Artesanal

> Código front-end completo, pronto para produção.  
> HTML5 · CSS3 · JavaScript puro · Zero dependências externas.

---

## Estrutura de arquivos

```
decorisa/
├── index.html        → Homepage completa
├── loja.html         → Catálogo / loja com filtros
├── produto.html      → Página de produto individual
├── sobre.html        → Sobre a marca
├── contato.html      → Contato + FAQ
├── checkout.html     → Finalização de pedido
├── cliente.html      → Área do cliente (login + painel)
├── admin.html        → Painel administrativo
├── style.css         → CSS completo (todas as páginas)
├── app.js            → JavaScript (carrinho, produtos, animações)
└── favicon.svg       → Ícone da aba do navegador
```

---

## Funcionalidades incluídas

### Loja
- 8 produtos com SVG artesanal (sem imagens externas necessárias)
- Filtros por categoria: Vasos, Bandejas, Esferas, Kits, Personalizados
- Ordenação por preço e nome
- Cards com hover elegante e quick-add

### Carrinho
- Drawer lateral com animação suave
- Adicionar / remover / alterar quantidade
- Cálculo de frete por CEP (simulado)
- Cupons de desconto: `DECORISA10`, `DECORISA15`, `BEMVINDO`
- Subtotal, desconto e total atualizados em tempo real
- Persistência via `localStorage`

### Produto
- Galeria com thumbnails
- Seletor de cor e tamanho
- Controle de quantidade
- Botão WhatsApp direto
- Cálculo de frete individual
- Produtos relacionados
- Seção de avaliações

### Checkout
- Formulário completo de endereço
- Integração com ViaCEP (preenchimento automático)
- 4 formas de pagamento: Pix, Cartão, Boleto, Mercado Pago
- Confirmação de pedido com número gerado
- Limpeza automática do carrinho após confirmação

### Área do cliente
- Login / Registro (demo, conectar ao backend)
- Histórico de pedidos com status
- Favoritos
- Endereços salvos
- Edição de perfil e senha

### Admin
- Dashboard com métricas e gráfico de barras
- Gestão de pedidos com filtros e atualização de status
- Listagem de produtos com edição
- Cadastro de novo produto com upload de fotos
- Lista de clientes
- Cupons (criar, ativar, desativar)
- Banners (editar textos do hero)
- Alertas de estoque baixo

---

## Como usar

### 1. Hospedagem estática (mais simples)

Faça upload de **todos os arquivos** para qualquer serviço:

| Serviço       | Como fazer |
|---------------|-----------|
| **Vercel**    | Arraste a pasta ou use `vercel deploy` |
| **Netlify**   | Arraste a pasta no app.netlify.com |
| **GitHub Pages** | Suba para um repositório, ative Pages |
| **Hostinger** | Upload via FTP na pasta `public_html` |
| **cPanel**    | Upload via Gerenciador de Arquivos |

### 2. Servidor local (desenvolvimento)

```bash
# Com Python 3
python -m http.server 3000

# Com Node.js (npx)
npx serve .

# Com VS Code
# Instalar extensão "Live Server" e clicar em "Go Live"
```

Abra: `http://localhost:3000`

---

## Personalização

### Trocar nome e dados da marca

Em `app.js`, altere:
```js
https://wa.me/5554999005435

// Cupons — adicione seus próprios
const COUPONS = {
  'SEUCUPOM': { discount: 0.10, label: '10% de desconto' }
};
```

Em todos os `.html`, pesquise e substitua:
- `(11) 99999-9999` → seu número
- `contato@decorisa.com.br` → seu e-mail
- `instagram.com/decorisa` → seu Instagram

### Adicionar produtos reais

Em `app.js`, no array `PRODUCTS`, adicione ou edite objetos:
```js
{
  id: 9,
  name: 'Meu Novo Produto',
  material: 'Concreto · Artesanal',
  price: 199.00,
  pricePix: 189.00,
  category: 'vasos',          // vasos | bandejas | esferas | kits | personalizados
  badge: 'Novo',              // ou null
  sku: 'DEC-XX-009',
  desc: 'Descrição emocional...',
  specs: { Dimensões: '10 × 20 cm', Peso: '1,2 kg' },
  colors: ['#C4BEB6', '#8A8480'],
  sizes: ['P', 'M', 'G'],
  stock: 5,
  svg: `<svg>...</svg>`       // substitua por <img src="foto.jpg"> se preferir
}
```

### Usar fotos reais

Substitua o campo `svg` por:
```js
svg: `<img src="fotos/vaso-bruto.jpg" alt="Vaso Bruto" style="width:100%;height:100%;object-fit:cover">`
```

Coloque as fotos em uma pasta `/fotos/` dentro do projeto.

### Cores e tipografia

Em `style.css`, altere as variáveis CSS:
```css
:root {
  --color-bg: #F9F7F4;        /* fundo geral */
  --color-bg-dark: #2C2A26;   /* fundo escuro */
  --color-concrete: #A89E92;  /* cor de destaque */
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Jost', sans-serif;
}
```

---

## Integração com pagamentos

Para pagamentos reais, integre no `checkout.html`:

### Mercado Pago (mais usado no Brasil)
```html
<script src="https://sdk.mercadopago.com/js/v2"></script>
```
→ Crie preferência de pagamento no backend e redirecione.

### Stripe
```html
<script src="https://js.stripe.com/v3/"></script>
```
→ Use `stripe.redirectToCheckout()` com o session ID do backend.

### PagSeguro / PayPal
→ Geram link de pagamento via API no backend.

---

## Backend recomendado

Para loja completa em produção, recomendo:

| Necessidade | Solução sugerida |
|------------|-----------------|
| Banco de dados | Supabase (PostgreSQL grátis) |
| Autenticação | Supabase Auth |
| Pagamentos | Mercado Pago API |
| E-mails | Resend ou SendGrid |
| Imagens | Cloudinary |
| CMS | Sanity.io ou Strapi |
| Deploy API | Vercel Functions ou Railway |

---

## SEO — ajustes recomendados

Em cada `.html`, personalize:
```html
<meta name="description" content="Sua descrição única...">
<meta property="og:title" content="Título da página">
<meta property="og:image" content="URL da imagem de compartilhamento">
```

---

## Suporte

Dúvidas sobre personalização? Entre em contato pelo WhatsApp ou e-mail cadastrado.

---

**Decorisa** — Feito com cuidado, pensado com intenção.
