/* ============================================================
   DECORISA — app.js (JavaScript principal)
   ============================================================ */

'use strict';

/* === DADOS DOS PRODUTOS === */
const PRODUCTS = [
  {
    id: 1,
    name: 'Vaso Bruto N.º 12',
    material: 'Concreto · Artesanal',
    price: 289.00,
    pricePix: 260.10,
    category: 'vasos',
    badge: 'Novo',
    sku: 'DEC-VB-012',
    desc: 'O Vaso Bruto N.º 12 é uma peça de caráter marcante, com textura intencionalmente crua e forma orgânica. Feito em concreto de alta resistência, revela camadas de cuidado artesanal em cada superfície.',
    specs: { Dimensões: '12 × 28 cm', Peso: '1,8 kg', Material: 'Concreto premium', Acabamento: 'Selado fosco', Prazo: '7 a 10 dias úteis' },
    colors: ['#C4BEB6','#8A8480','#2C2A26','#D4C4A8'],
    sizes: ['P','M','G'],
    stock: 3,
    svg: `<svg viewBox="0 0 160 240" xmlns="http://www.w3.org/2000/svg"><ellipse cx="80" cy="52" rx="42" ry="10" fill="#BAB2A8"/><path d="M38 52 Q30 120 36 190 Q50 230 80 232 Q110 230 124 190 Q130 120 122 52 Z" fill="url(#vg1)"/><line x1="68" y1="64" x2="65" y2="200" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/><defs><linearGradient id="vg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#9A9490"/><stop offset="50%" stop-color="#C4BEB6"/><stop offset="100%" stop-color="#8A8480"/></linearGradient></defs></svg>`
  },
  {
    id: 2,
    name: 'Bandeja Cimento',
    material: 'Cimento · Oval',
    price: 189.00,
    pricePix: 170.10,
    category: 'bandejas',
    badge: null,
    sku: 'DEC-BC-008',
    desc: 'Bandeja oval em cimento artesanal, com borda elevada e fundo texturizado. Ideal para aparadores, mesas de centro ou bancadas. Funcional e esteticamente refinada.',
    specs: { Dimensões: '30 × 18 × 4 cm', Peso: '1,2 kg', Material: 'Cimento pigmentado', Acabamento: 'Cera natural', Prazo: '5 a 7 dias úteis' },
    colors: ['#C4BEB6','#8A8480','#D4C4A8'],
    sizes: ['Único'],
    stock: 8,
    svg: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="25" width="180" height="70" rx="35" fill="#BAB2A8"/><rect x="20" y="35" width="160" height="50" rx="25" fill="#A49E98"/><ellipse cx="100" cy="60" rx="60" ry="16" fill="rgba(255,255,255,0.08)"/></svg>`
  },
  {
    id: 3,
    name: 'Esfera Duo',
    material: 'Concreto · Duo',
    price: 349.00,
    pricePix: 314.10,
    category: 'esferas',
    badge: 'Exclusivo',
    sku: 'DEC-ED-003',
    desc: 'Conjunto de duas esferas em concreto artesanal com acabamentos distintos — uma em textura natural e outra polida. O contraste cria composição visual sofisticada.',
    specs: { Dimensões: '12 cm e 8 cm (diâmetro)', Peso: '2,1 kg (conjunto)', Material: 'Concreto premium', Acabamento: 'Natural + polido', Prazo: '7 a 10 dias úteis' },
    colors: ['#C4BEB6','#8A8480','#2C2A26'],
    sizes: ['Único'],
    stock: 5,
    svg: `<svg viewBox="0 0 180 160" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="90" r="58" fill="url(#sg1)"/><circle cx="58" cy="76" r="12" fill="rgba(255,255,255,0.1)"/><circle cx="132" cy="106" r="40" fill="url(#sg2)"/><defs><linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#C4BEB6"/><stop offset="100%" stop-color="#9A9490"/></linearGradient><linearGradient id="sg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#D4CEC8"/><stop offset="100%" stop-color="#A4A09A"/></linearGradient></defs></svg>`
  },
  {
    id: 4,
    name: 'Kit Decorisa',
    material: 'Kit · 3 peças',
    price: 590.00,
    pricePix: 531.00,
    category: 'kits',
    badge: null,
    sku: 'DEC-KT-001',
    desc: 'Kit composto por vaso, bandeja e esfera em concreto artesanal. Desenvolvido para criar uma composição harmônica e sofisticada. Perfeito para presentear ou decorar.',
    specs: { Conteúdo: 'Vaso P + Bandeja + Esfera', Peso: '3,8 kg (conjunto)', Material: 'Concreto premium', Embalagem: 'Caixa kraft premium', Prazo: '10 a 14 dias úteis' },
    colors: ['#C4BEB6','#8A8480'],
    sizes: ['Único'],
    stock: 4,
    svg: `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="100" width="80" height="14" rx="2" fill="#8A8480"/><rect x="25" y="94" width="70" height="8" rx="1" fill="#A4988E" opacity="0.7"/><path d="M30 50 Q24 80 28 108 Q38 122 60 123 Q82 122 92 108 Q96 80 90 50 Z" fill="#B4ACA0"/><ellipse cx="60" cy="50" rx="30" ry="7" fill="#C4BEB6"/><circle cx="148" cy="130" r="36" fill="#CECAC4"/><rect x="110" y="68" width="70" height="48" rx="2" fill="#A4A09A" opacity="0.6"/></svg>`
  },
  {
    id: 5,
    name: 'Vaso Slim',
    material: 'Concreto · Slim',
    price: 219.00,
    pricePix: 197.10,
    category: 'vasos',
    badge: null,
    sku: 'DEC-VS-007',
    desc: 'Silhueta alongada e elegante. O Vaso Slim é ideal para hastes delicadas e ramos secos. Sua forma minimalista se adapta a qualquer ambiente contemporâneo.',
    specs: { Dimensões: '8 × 35 cm', Peso: '1,4 kg', Material: 'Concreto pigmentado', Acabamento: 'Selado fosco', Prazo: '7 a 10 dias úteis' },
    colors: ['#C4BEB6','#8A8480','#2C2A26','#B89878'],
    sizes: ['Único'],
    stock: 6,
    svg: `<svg viewBox="0 0 100 260" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="32" rx="20" ry="5" fill="#C4BEB6"/><path d="M30 32 Q24 100 28 200 Q36 240 50 242 Q64 240 72 200 Q76 100 70 32 Z" fill="url(#slimG)"/><defs><linearGradient id="slimG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#9A9490"/><stop offset="50%" stop-color="#C4BEB6"/><stop offset="100%" stop-color="#8A8480"/></linearGradient></defs></svg>`
  },
  {
    id: 6,
    name: 'Bandeja Retangular',
    material: 'Concreto · Retangular',
    price: 229.00,
    pricePix: 206.10,
    category: 'bandejas',
    badge: null,
    sku: 'DEC-BR-011',
    desc: 'Bandeja retangular de concreto com acabamento em cera natural. Linhas retas e proporções cuidadas para uso em cozinha, banheiro ou sala de estar.',
    specs: { Dimensões: '40 × 20 × 4 cm', Peso: '1,8 kg', Material: 'Concreto natural', Acabamento: 'Cera natural', Prazo: '5 a 7 dias úteis' },
    colors: ['#C4BEB6','#8A8480'],
    sizes: ['Único'],
    stock: 7,
    svg: `<svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="20" width="204" height="60" rx="3" fill="#B4AEA8"/><rect x="16" y="28" width="188" height="44" rx="2" fill="#A4A09A"/><rect x="0" y="76" width="220" height="16" rx="2" fill="#8A8480"/></svg>`
  },
  {
    id: 7,
    name: 'Vaso Bowl',
    material: 'Concreto · Bowl',
    price: 259.00,
    pricePix: 233.10,
    category: 'vasos',
    badge: 'Novo',
    sku: 'DEC-VBW-015',
    desc: 'Vaso de formato bowl, baixo e aberto. Perfeito para suculentas, pedras decorativas ou arranjos curtos. Textura intencionalmente bruta com borda polida.',
    specs: { Dimensões: '22 × 10 cm', Peso: '1,6 kg', Material: 'Concreto premium', Acabamento: 'Bruto + borda polida', Prazo: '7 a 10 dias úteis' },
    colors: ['#C4BEB6','#8A8480','#2C2A26'],
    sizes: ['P','G'],
    stock: 5,
    svg: `<svg viewBox="0 0 180 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 30 Q8 70 20 85 Q50 100 90 100 Q130 100 160 85 Q172 70 170 30 Z" fill="#BAB4AE"/><ellipse cx="90" cy="30" rx="80" ry="18" fill="#C4BEB6"/><ellipse cx="90" cy="30" rx="70" ry="12" fill="#8A8480" opacity="0.4"/></svg>`
  },
  {
    id: 8,
    name: 'Peça Personalizada',
    material: 'Concreto · Sob medida',
    price: 0,
    pricePix: 0,
    category: 'personalizados',
    badge: 'Sob consulta',
    sku: 'DEC-CUSTOM',
    desc: 'Crie sua peça exclusiva. Dimensão, cor, textura e acabamento totalmente personalizados. Entre em contato para desenvolvermos juntos o objeto perfeito para o seu espaço.',
    specs: { Dimensões: 'A definir', Material: 'Concreto premium', Acabamento: 'A escolher', Prazo: 'A combinar' },
    colors: ['#C4BEB6','#8A8480','#2C2A26','#B89878','#D4C4A8'],
    sizes: ['Sob medida'],
    stock: 99,
    svg: `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="80" r="60" fill="none" stroke="#C4BEB6" stroke-width="1" stroke-dasharray="6 4"/><line x1="80" y1="40" x2="80" y2="120" stroke="#C4BEB6" stroke-width="1.5"/><line x1="40" y1="80" x2="120" y2="80" stroke="#C4BEB6" stroke-width="1.5"/><text x="80" y="150" text-anchor="middle" font-size="10" fill="#8A8478" font-family="Georgia" letter-spacing="2">CUSTOM</text></svg>`
  }
];

/* === CUPONS === */
const COUPONS = {
  'DECORISA10': { discount: 0.10, label: '10% de desconto' },
  'DECORISA15': { discount: 0.15, label: '15% de desconto' },
  'BEMVINDO':   { discount: 0.05, label: '5% de desconto' }
};

/* === ESTADO GLOBAL === */
let cart = JSON.parse(localStorage.getItem('decorisa_cart') || '[]');
let appliedCoupon = null;
let appliedFrete = null;
let currentPage = detectPage();

/* === DETECÇÃO DE PÁGINA === */
function detectPage() {
  const path = location.pathname.split('/').pop() || 'index.html';
  return path.replace('.html','') || 'index';
}

/* === INICIALIZAÇÃO === */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCart();
  updateCartCount();
  initReveal();

  switch (currentPage) {
    case 'index':       initHome(); break;
    case 'loja':        initLoja(); break;
    case 'produto':     initProduto(); break;
    case 'sobre':       initSobre(); break;
    case 'contato':     initContato(); break;
    case 'checkout':    initCheckout(); break;
    case 'cliente':     initCliente(); break;
    case 'admin':       initAdmin(); break;
  }
});

/* === HEADER === */
function initHeader() {
  const header = document.getElementById('site-header');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      mobileBtn.classList.toggle('open', open);
      mobileBtn.setAttribute('aria-expanded', open);
    });
  }

  // Marca nav ativo
  if (nav) {
    const links = nav.querySelectorAll('a');
    links.forEach(a => {
      if (a.href.includes(location.pathname.split('/').pop())) {
        a.classList.add('active');
      }
    });
  }
}

/* === CARRINHO === */
function initCart() {
  const toggle  = document.getElementById('cartToggle');
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const close   = document.getElementById('cartClose');

  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => openCart());
  if (close)   close.addEventListener('click', () => closeCart());
  if (overlay) overlay.addEventListener('click', () => closeCart());

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  renderCart();
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function saveCart() {
  localStorage.setItem('decorisa_cart', JSON.stringify(cart));
}

function updateCartCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  const total = cart.reduce((s, i) => s + i.qty, 0);
  el.textContent = total;
  el.classList.toggle('visible', total > 0);
}

function addToCart(productId, qty = 1, color = null, size = null) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const key = `${productId}-${color}-${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key,
      id: productId,
      name: product.name,
      material: product.material,
      price: product.price,
      qty,
      color,
      size,
      svg: product.svg
    });
  }
  saveCart();
  updateCartCount();
  renderCart();
  showToast(`"${product.name}" adicionado ao carrinho`);
  openCart();
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  updateCartCount();
  renderCart();
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartCount();
  renderCart();
}

function renderCart() {
  const itemsEl   = document.getElementById('cartItems');
  const emptyEl   = document.getElementById('cartEmpty');
  const footerEl  = document.getElementById('cartFooter');
  if (!itemsEl) return;

  if (cart.length === 0) {
    if (emptyEl)  emptyEl.style.display = 'flex';
    itemsEl.innerHTML = '';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (emptyEl)  emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = 'block';

  itemsEl.innerHTML = cart.map(item => `
    <li class="cart-item">
      <div class="cart-item-img" aria-hidden="true">${item.svg || ''}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${[item.size, item.color ? '●' : ''].filter(Boolean).join(' ')}</div>
        <div class="cart-item-qty">
          <button onclick="changeQty('${item.key}', -1)" aria-label="Diminuir quantidade">−</button>
          <span aria-label="Quantidade: ${item.qty}">${item.qty}</span>
          <button onclick="changeQty('${item.key}', 1)" aria-label="Aumentar quantidade">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.key}')">Remover</button>
      </div>
      <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
    </li>
  `).join('');

  updateCartTotals();
}

function updateCartTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  let total = subtotal;

  const subEl = document.getElementById('cartSubtotal');
  if (subEl) subEl.textContent = formatPrice(subtotal);

  const discRow = document.getElementById('discountRow');
  const discEl  = document.getElementById('cartDiscount');
  if (appliedCoupon && discRow && discEl) {
    const d = subtotal * appliedCoupon.discount;
    total -= d;
    discEl.textContent = `− ${formatPrice(d)}`;
    discRow.style.display = 'flex';
  } else if (discRow) {
    discRow.style.display = 'none';
  }

  const freteRow = document.getElementById('freteRow');
  const freteEl  = document.getElementById('cartFrete');
  if (appliedFrete !== null && freteRow && freteEl) {
    total += appliedFrete;
    freteEl.textContent = appliedFrete === 0 ? 'Grátis' : formatPrice(appliedFrete);
    freteRow.style.display = 'flex';
  } else if (freteRow) {
    freteRow.style.display = 'none';
  }

  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function calcularFrete() {
  const cep = (document.getElementById('cepInput')?.value || '').replace(/\D/g,'');
  const result = document.getElementById('shippingResult');
  if (!result) return;

  if (cep.length !== 8) {
    result.textContent = 'CEP inválido. Digite 8 dígitos.';
    return;
  }

  result.textContent = 'Calculando...';
  setTimeout(() => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    if (subtotal >= 500) {
      appliedFrete = 0;
      result.textContent = '✓ Frete grátis para este CEP!';
    } else {
      appliedFrete = 19.90;
      result.textContent = `Frete: R$ 19,90 — Prazo: 5 a 8 dias úteis`;
    }
    updateCartTotals();
  }, 800);
}

function aplicarCupom() {
  const code   = (document.getElementById('couponInput')?.value || '').trim().toUpperCase();
  const result = document.getElementById('couponResult');
  if (!result) return;

  if (!code) { result.textContent = 'Digite um cupom.'; return; }

  const coupon = COUPONS[code];
  if (coupon) {
    appliedCoupon = coupon;
    result.textContent = `✓ Cupom aplicado: ${coupon.label}`;
    result.style.color = '#4A7A4A';
  } else {
    result.textContent = 'Cupom inválido ou expirado.';
    result.style.color = '#A33';
  }
  updateCartTotals();
}

/* === HOME === */
function initHome() {
  const grid = document.getElementById('destaquesGrid');
  if (!grid) return;

  // Mostra 4 produtos em destaque
  const destaques = PRODUCTS.slice(0, 4);
  grid.innerHTML = destaques.map(p => renderProductCard(p)).join('');
}

/* === CARD DE PRODUTO === */
function renderProductCard(p) {
  const price = p.price === 0
    ? '<span style="font-size:13px;letter-spacing:0.08em">Sob consulta</span>'
    : formatPrice(p.price);

  return `
    <article class="product-card reveal" onclick="window.location='produto.html?id=${p.id}'">
      <div class="product-img-wrap">
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:24px">${p.svg}</div>
        <div class="product-quick-add">
          <button class="btn-primary" style="font-size:10px;padding:10px 20px"
            onclick="event.stopPropagation();${p.id === 8 ? "window.open('https://wa.me/5511999999999?text=Quero+uma+peça+personalizada!','_blank')" : `addToCart(${p.id})`}">
            ${p.id === 8 ? 'Solicitar' : 'Adicionar'}
          </button>
        </div>
      </div>
      <div class="product-material">${p.material}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">${price}</div>
    </article>
  `;
}

/* === LOJA === */
function initLoja() {
  const grid = document.getElementById('lojaGrid');
  const filtersEl = document.getElementById('lojaFilters');
  if (!grid) return;

  // Filtra por categoria via URL
  const params = new URLSearchParams(location.search);
  let activeCat = params.get('cat') || 'todos';

  renderLojaGrid(activeCat);

  // Filtros
  if (filtersEl) {
    filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
      const cat = btn.dataset.cat;
      if (cat === activeCat) btn.classList.add('active');
      btn.addEventListener('click', () => {
        activeCat = cat;
        filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderLojaGrid(activeCat);
      });
    });
  }
}

function renderLojaGrid(cat) {
  const grid = document.getElementById('lojaGrid');
  if (!grid) return;
  const filtered = cat === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--color-text-light);font-size:14px;grid-column:1/-1;text-align:center;padding:48px 0">Nenhum produto nesta categoria ainda.</p>';
    return;
  }
  grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
  initReveal();
}

/* === PRODUTO === */
function initProduto() {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const wrap = document.getElementById('produtoContent');
  if (!wrap) return;

  wrap.innerHTML = buildProdutoHTML(product);
  initGallery(product);
  initColorPicker(product);
  initSizePicker(product);
  renderRelacionados(product);
}

function buildProdutoHTML(p) {
  const specsHTML = Object.entries(p.specs).map(([k,v]) =>
    `<div class="spec-row"><dt>${k}</dt><dd>${v}</dd></div>`
  ).join('');

  const priceSection = p.price === 0
    ? `<div class="produto-price-wrap"><span class="produto-price">Sob consulta</span></div>`
    : `<div class="produto-price-wrap">
        <span class="produto-price">${formatPrice(p.price)}</span>
        <span class="produto-price-pix">ou ${formatPrice(p.pricePix)} no Pix</span>
       </div>`;

  const addBtn = p.id === 8
    ? `<a href="https://wa.me/5511999999999?text=Quero+uma+peça+personalizada!" target="_blank" class="btn-primary btn-comprar" style="display:flex;align-items:center;justify-content:center;gap:8px">Solicitar pelo WhatsApp</a>`
    : `<button class="btn-primary btn-comprar" onclick="addToCart(${p.id}, document.getElementById('prodQty').valueAsNumber||1, selectedColor, selectedSize)">Adicionar ao carrinho</button>`;

  return `
    <div class="produto-gallery" id="galeria">
      <div class="gallery-main" id="galleryMain">
        <div style="width:80%;max-width:280px">${p.svg}</div>
      </div>
      <div class="gallery-thumbs" id="galleryThumbs">
        ${[0,1,2,3].map(i => `
          <div class="gallery-thumb ${i===0?'active':''}" data-idx="${i}" onclick="selectThumb(${i})">
            <div style="width:70%;opacity:${1-i*0.15}">${p.svg}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="produto-info">
      <nav class="produto-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a> · <a href="loja.html">Loja</a> · ${p.name}
      </nav>
      <h1 class="produto-name">${p.name}</h1>
      <p class="produto-sku">SKU: ${p.sku}</p>
      <div class="produto-stars">
        <span class="stars" aria-label="5 de 5 estrelas">★★★★★</span>
        <span class="reviews-count">12 avaliações</span>
      </div>
      ${priceSection}
      <div class="produto-divider"></div>
      <p class="produto-desc">${p.desc}</p>
      <div class="produto-artesanal">"Cada peça é produzida artesanalmente, tornando cada item único."</div>

      <div class="option-group">
        <div class="option-label">
          <span>Cor</span>
          <span id="colorLabel">Concreto Natural</span>
        </div>
        <div class="color-options" id="colorOptions"></div>
      </div>

      <div class="option-group">
        <div class="option-label">
          <span>Tamanho</span>
          <span id="sizeLabel">${p.sizes[0]}</span>
        </div>
        <div class="size-options" id="sizeOptions"></div>
      </div>

      <div style="margin-bottom:20px">
        <label for="prodQty" style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--color-text-light);display:block;margin-bottom:8px">Quantidade</label>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeLocalQty(-1)" aria-label="Diminuir">−</button>
          <span class="qty-val" id="qtyDisplay">1</span>
          <button class="qty-btn" onclick="changeLocalQty(1)" aria-label="Aumentar">+</button>
          <input type="number" id="prodQty" value="1" min="1" max="${p.stock}" style="display:none">
        </div>
        <p style="font-size:11px;color:var(--color-text-light);margin-top:6px">${p.stock < 5 ? `Apenas ${p.stock} disponíveis` : 'Em estoque'}</p>
      </div>

      <div class="produto-actions">
        ${addBtn}
        <a href="https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20no%20${encodeURIComponent(p.name)}" target="_blank" class="btn-wpp" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
      </div>

      <div class="frete-calc">
        <div class="frete-calc-title">Calcular frete</div>
        <div class="frete-row">
          <input type="text" id="prodCepInput" placeholder="00000-000" maxlength="9">
          <button class="btn-calcfrete" onclick="calcularFreteProd()">Calcular</button>
        </div>
        <p id="prodFreteResult" style="font-size:12px;color:var(--color-text-light);margin-top:6px;min-height:16px"></p>
      </div>

      <div class="produto-divider"></div>
      <dl class="produto-specs">${specsHTML}</dl>
    </div>
  `;
}

let selectedColor = null;
let selectedSize  = null;
let localQty = 1;

function initGallery(product) {}

function selectThumb(idx) {
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

function initColorPicker(product) {
  const el = document.getElementById('colorOptions');
  if (!el) return;
  const colorNames = ['Natural','Cimento','Escuro','Areia','Claro'];
  selectedColor = product.colors[0];
  el.innerHTML = product.colors.map((c, i) => `
    <div class="color-opt ${i===0?'selected':''}" 
         data-color="${c}"
         style="background:${c}"
         title="${colorNames[i]||c}"
         onclick="selectColor(this, '${c}', '${colorNames[i]||c}')"
         role="radio" aria-label="${colorNames[i]||c}" aria-checked="${i===0}">
    </div>
  `).join('');
}

function selectColor(el, color, name) {
  document.querySelectorAll('.color-opt').forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-checked','false'); });
  el.classList.add('selected');
  el.setAttribute('aria-checked','true');
  selectedColor = color;
  const lbl = document.getElementById('colorLabel');
  if (lbl) lbl.textContent = name;
}

function initSizePicker(product) {
  const el = document.getElementById('sizeOptions');
  if (!el) return;
  selectedSize = product.sizes[0];
  el.innerHTML = product.sizes.map((s, i) => `
    <button class="size-opt ${i===0?'selected':''}" 
            onclick="selectSize(this, '${s}')"
            aria-pressed="${i===0}">${s}</button>
  `).join('');
}

function selectSize(el, size) {
  document.querySelectorAll('.size-opt').forEach(s => { s.classList.remove('selected'); s.setAttribute('aria-pressed','false'); });
  el.classList.add('selected');
  el.setAttribute('aria-pressed','true');
  selectedSize = size;
  const lbl = document.getElementById('sizeLabel');
  if (lbl) lbl.textContent = size;
}

function changeLocalQty(delta) {
  localQty = Math.max(1, localQty + delta);
  const display = document.getElementById('qtyDisplay');
  const input   = document.getElementById('prodQty');
  if (display) display.textContent = localQty;
  if (input)   input.value = localQty;
}

function calcularFreteProd() {
  const cep = (document.getElementById('prodCepInput')?.value || '').replace(/\D/g,'');
  const result = document.getElementById('prodFreteResult');
  if (!result) return;
  if (cep.length !== 8) { result.textContent = 'CEP inválido.'; return; }
  result.textContent = 'Calculando...';
  setTimeout(() => {
    result.textContent = 'Frete: R$ 19,90 — Prazo: 5 a 8 dias úteis';
  }, 700);
}

function renderRelacionados(current) {
  const el = document.getElementById('relacionadosGrid');
  if (!el) return;
  const others = PRODUCTS.filter(p => p.id !== current.id).slice(0, 4);
  el.innerHTML = others.map(p => renderProductCard(p)).join('');
  initReveal();
}

/* === SOBRE === */
function initSobre() {
  // Animações já cuidadas pelo reveal
}

/* === CONTATO === */
function initContato() {
  const form = document.getElementById('contatoForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
      showToast('Mensagem enviada! Retornaremos em breve.');
      form.reset();
      btn.textContent = orig;
      btn.disabled = false;
    }, 1200);
  });

  // FAQ
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded','false');
        b.nextElementSibling?.classList.remove('open');
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded','true');
        btn.nextElementSibling?.classList.add('open');
      }
    });
  });
}

/* === CHECKOUT === */
function initCheckout() {
  renderCheckoutItems();

  // Seleção de pagamento
  document.querySelectorAll('.payment-method').forEach(m => {
    m.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(x => x.classList.remove('selected'));
      m.classList.add('selected');
      m.querySelector('input[type=radio]').checked = true;
    });
  });

  // Preenche CEP automático
  const cepInput = document.getElementById('checkoutCep');
  if (cepInput) {
    cepInput.addEventListener('input', () => {
      let v = cepInput.value.replace(/\D/g,'');
      if (v.length > 5) v = v.slice(0,5)+'-'+v.slice(5,8);
      cepInput.value = v;
    });
    cepInput.addEventListener('blur', () => {
      const cep = cepInput.value.replace(/\D/g,'');
      if (cep.length === 8) fetchCEP(cep);
    });
  }

  const form = document.getElementById('checkoutForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      finalizarPedido();
    });
  }
}

function renderCheckoutItems() {
  const el = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const totalEl    = document.getElementById('checkoutTotal');
  if (!el) return;

  if (cart.length === 0) {
    el.innerHTML = '<p style="font-size:13px;color:var(--color-text-light)">Carrinho vazio. <a href="loja.html">Ir para a loja</a></p>';
    return;
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  el.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <div class="checkout-item-img">${item.svg||''}</div>
      <div class="checkout-item-info">
        <div class="checkout-item-name">${item.name}</div>
        <div class="checkout-item-qty">Qtd: ${item.qty}</div>
      </div>
      <div class="checkout-item-price">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl)    totalEl.textContent    = formatPrice(subtotal + (appliedFrete || 0));
}

function fetchCEP(cep) {
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(r => r.json())
    .then(d => {
      if (d.erro) return;
      const fields = {
        checkoutRua:    d.logradouro,
        checkoutBairro: d.bairro,
        checkoutCidade: d.localidade,
        checkoutEstado: d.uf
      };
      Object.entries(fields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el && val) el.value = val;
      });
    })
    .catch(() => {});
}

function finalizarPedido() {
  const btn = document.querySelector('#checkoutForm button[type=submit]');
  if (btn) { btn.textContent = 'Processando...'; btn.disabled = true; }

  setTimeout(() => {
    const orderId = 'DEC-' + Date.now().toString().slice(-6);
    cart = [];
    saveCart();
    updateCartCount();

    const wrap = document.getElementById('checkoutContent');
    if (wrap) {
      wrap.innerHTML = `
        <div style="text-align:center;padding:80px 48px;max-width:520px;margin:0 auto">
          <div style="font-size:48px;margin-bottom:24px">✓</div>
          <h2 style="font-family:var(--font-display);font-size:36px;font-weight:300;margin-bottom:16px">Pedido confirmado!</h2>
          <p style="font-size:14px;color:var(--color-text-muted);line-height:1.8;margin-bottom:8px">Número do pedido: <strong>${orderId}</strong></p>
          <p style="font-size:14px;color:var(--color-text-muted);line-height:1.8;margin-bottom:32px">Você receberá um e-mail com a confirmação. Sua peça artesanal será produzida com cuidado e enviada no prazo combinado.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <a href="cliente.html" class="btn-primary">Acompanhar pedido</a>
            <a href="index.html" class="btn-outline">Voltar ao início</a>
          </div>
        </div>
      `;
    }
  }, 1800);
}

/* === CLIENTE === */
function initCliente() {
  const tabs = document.querySelectorAll('.cliente-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.cliente-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${target}`)?.classList.add('active');
    });
  });

  // Renderiza pedidos de exemplo
  const pedidosEl = document.getElementById('pedidosList');
  if (pedidosEl) {
    const pedidos = [
      { id: 'DEC-482931', date: '12/05/2025', status: 'enviado',       items: 'Kit Decorisa × 1',      total: 'R$ 590,00' },
      { id: 'DEC-371820', date: '03/04/2025', status: 'entregue',      items: 'Vaso Bruto N.º 12 × 2', total: 'R$ 578,00' },
      { id: 'DEC-259104', date: '18/02/2025', status: 'processando',   items: 'Esfera Duo × 1',         total: 'R$ 349,00' },
    ];
    const statusLabel = { enviado:'Enviado', entregue:'Entregue', processando:'Processando', producao:'Em produção' };
    pedidosEl.innerHTML = pedidos.map(p => `
      <div class="pedido-card">
        <div class="pedido-header">
          <div>
            <span class="pedido-num">Pedido ${p.id}</span>
            <span style="margin-left:12px" class="pedido-date">${p.date}</span>
          </div>
          <span class="pedido-status status-${p.status}">${statusLabel[p.status]}</span>
        </div>
        <p style="font-size:13px;color:var(--color-text-muted);margin-bottom:8px">${p.items}</p>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:14px;font-weight:500">${p.total}</span>
          <a href="#" style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--color-text-light)">Ver detalhes</a>
        </div>
      </div>
    `).join('');
  }

  // Form de perfil
  const profileForm = document.getElementById('perfilForm');
  if (profileForm) {
    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Perfil atualizado com sucesso!');
    });
  }
}

/* === ADMIN === */
function initAdmin() {
  const navBtns = document.querySelectorAll('.admin-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`admin-${btn.dataset.panel}`)?.classList.add('active');
    });
  });

  renderAdminProdutos();
  renderAdminPedidos();
  renderAdminMetrics();
}

function renderAdminMetrics() {
  const metricsEl = document.getElementById('adminMetrics');
  if (!metricsEl) return;

  const metrics = [
    { label: 'Receita este mês', value: 'R$ 4.280', sub: '+18% vs. mês anterior' },
    { label: 'Pedidos', value: '14', sub: '3 aguardando produção' },
    { label: 'Produtos ativos', value: String(PRODUCTS.length), sub: '1 em personalizado' },
    { label: 'Avaliação média', value: '5.0 ★', sub: 'Baseado em 48 avaliações' }
  ];

  metricsEl.innerHTML = metrics.map(m => `
    <div class="metric-card">
      <div class="metric-label">${m.label}</div>
      <div class="metric-value">${m.value}</div>
      <div class="metric-sub">${m.sub}</div>
    </div>
  `).join('');
}

function renderAdminProdutos() {
  const el = document.getElementById('adminProdutosTable');
  if (!el) return;
  el.innerHTML = `
    <table class="admin-table" aria-label="Tabela de produtos">
      <thead>
        <tr><th>SKU</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr>
      </thead>
      <tbody>
        ${PRODUCTS.map(p => `
          <tr>
            <td style="color:var(--color-text-light)">${p.sku}</td>
            <td>${p.name}</td>
            <td style="text-transform:capitalize">${p.category}</td>
            <td>${p.price === 0 ? 'Sob consulta' : formatPrice(p.price)}</td>
            <td>${p.stock < 5 ? `<span style="color:#8A5A1A">${p.stock} restantes</span>` : p.stock}</td>
            <td>
              <button onclick="adminEditProd(${p.id})" style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;background:none;border:none;cursor:pointer;color:var(--color-text-muted);font-family:var(--font-body)">Editar</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderAdminPedidos() {
  const el = document.getElementById('adminPedidosTable');
  if (!el) return;
  const pedidos = [
    { id:'DEC-482931', client:'Ana Paula M.', product:'Kit Decorisa', total:'R$ 590,00', status:'enviado', date:'12/05/2025' },
    { id:'DEC-481720', client:'João S.', product:'Vaso Bruto × 2', total:'R$ 578,00', status:'producao', date:'11/05/2025' },
    { id:'DEC-480305', client:'Fernanda C.', product:'Bandeja personalizada', total:'R$ 280,00', status:'processando', date:'10/05/2025' },
    { id:'DEC-479198', client:'Lucas R.', product:'Esfera Duo', total:'R$ 349,00', status:'entregue', date:'08/05/2025' },
  ];
  const statusLabel = { enviado:'Enviado', entregue:'Entregue', processando:'Processando', producao:'Em produção' };
  el.innerHTML = `
    <table class="admin-table" aria-label="Tabela de pedidos">
      <thead>
        <tr><th>Pedido</th><th>Cliente</th><th>Produto</th><th>Total</th><th>Status</th><th>Data</th><th>Ações</th></tr>
      </thead>
      <tbody>
        ${pedidos.map(p => `
          <tr>
            <td style="color:var(--color-text-light)">${p.id}</td>
            <td>${p.client}</td>
            <td>${p.product}</td>
            <td>${p.total}</td>
            <td><span class="pedido-status status-${p.status}">${statusLabel[p.status]}</span></td>
            <td style="color:var(--color-text-light)">${p.date}</td>
            <td>
              <select onchange="updateOrderStatus('${p.id}', this.value)" style="font-size:11px;border:0.5px solid var(--color-border-mid);padding:4px 8px;background:var(--color-bg);font-family:var(--font-body);color:var(--color-text);cursor:pointer">
                <option>Alterar status</option>
                <option value="processando">Processando</option>
                <option value="producao">Em produção</option>
                <option value="enviado">Enviado</option>
                <option value="entregue">Entregue</option>
              </select>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function adminEditProd(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  showToast(`Editando: ${product.name}`);
  document.querySelector('[data-panel="cadastro"]')?.click();
  setTimeout(() => {
    const nome = document.getElementById('adminProdNome');
    const preco = document.getElementById('adminProdPreco');
    const estoque = document.getElementById('adminProdEstoque');
    if (nome) nome.value = product.name;
    if (preco) preco.value = product.price;
    if (estoque) estoque.value = product.stock;
  }, 100);
}

function updateOrderStatus(id, status) {
  if (!status || status === 'Alterar status') return;
  showToast(`Pedido ${id} atualizado para: ${status}`);
}

function adminSalvarProduto(e) {
  e.preventDefault();
  showToast('Produto salvo com sucesso!');
}

/* === REVEAL ON SCROLL === */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

/* === TOAST === */
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), duration);
}

/* === NEWSLETTER === */
function subscribeNewsletter(e) {
  e.preventDefault();
  const msg = document.getElementById('newsletterMsg');
  if (msg) {
    msg.textContent = '✓ Inscrito com sucesso!';
    msg.style.color = '#4A7A4A';
  }
  e.target.reset();
}

/* === UTILITÁRIOS === */
function formatPrice(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatCEP(input) {
  let v = input.value.replace(/\D/g,'');
  if (v.length > 5) v = v.slice(0,5)+'-'+v.slice(5,8);
  input.value = v;
}

// Expõe funções necessárias globalmente para handlers inline
window.addToCart         = addToCart;
window.removeFromCart    = removeFromCart;
window.changeQty         = changeQty;
window.calcularFrete     = calcularFrete;
window.aplicarCupom      = aplicarCupom;
window.selectThumb       = selectThumb;
window.selectColor       = selectColor;
window.selectSize        = selectSize;
window.changeLocalQty    = changeLocalQty;
window.calcularFreteProd = calcularFreteProd;
window.subscribeNewsletter = subscribeNewsletter;
window.adminEditProd     = adminEditProd;
window.updateOrderStatus = updateOrderStatus;
window.adminSalvarProduto = adminSalvarProduto;
window.formatCEP         = formatCEP;
