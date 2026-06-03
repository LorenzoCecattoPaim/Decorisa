/**
 * DECORISA — main.js
 * Inicializador global: header, toast, reveal, utilidades
 */

/* === TOAST === */
function showToast(msg, duration = 3200) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role','alert'); document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tmr);
  t._tmr = setTimeout(() => t.classList.remove('show'), duration);
}
window.showToast = showToast;

/* === FORMAT === */
function fmtPrice(v) {
  return 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
window.fmtPrice = fmtPrice;

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR');
}
window.fmtDate = fmtDate;

/* === HEADER === */
function initHeader() {
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  const mBtn = document.getElementById('mobileMenuBtn');
  const nav  = document.getElementById('mainNav');
  if (mBtn && nav) {
    mBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      mBtn.classList.toggle('open', open);
      mBtn.setAttribute('aria-expanded', open);
    });
  }

  /* Marca link ativo */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && page.includes(href.replace('../pages/','').replace('.html',''))) {
      a.classList.add('active');
    }
  });

  /* Mostra/oculta link admin */
  const adminLink = document.getElementById('adminLink');
  if (adminLink && window.Auth?.isAdmin()) adminLink.style.display = 'block';
}

/* === REVEAL ON SCROLL === */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 70);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}
window.initReveal = initReveal;

/* === NEWSLETTER === */
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const input = form.querySelector('input[type=email]');
      const msg   = form.querySelector('.newsletter-msg');
      if (!input) return;
      try {
        await window.api.newsletter.subscribe(input.value);
        if (msg) { msg.textContent = '✓ Inscrito!'; msg.style.color = '#4A7A4A'; }
        input.value = '';
      } catch (err) {
        if (msg) { msg.textContent = err.message; msg.style.color = '#A33'; }
      }
    });
  });
}

/* === CEP MASK === */
function maskCEP(input) {
  let v = input.value.replace(/\D/g,'');
  if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5,8);
  input.value = v;
}
window.maskCEP = maskCEP;

/* === FETCH CEP → preenche formulário === */
async function fetchCEP(cep, fields = {}) {
  const clean = cep.replace(/\D/g,'');
  if (clean.length !== 8) return;
  try {
    const data = await window.api.payment.getShipping(clean);
    const addr = data.address;
    Object.entries(fields).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el && addr[key]) el.value = addr[key];
    });
  } catch {}
}
window.fetchCEP = fetchCEP;

/* === RENDER PRODUCT CARD === */
function renderProductCard(p) {
  const coverImg = p.images?.find(i => i.is_cover) || p.images?.[0];
  const price    = Number(p.price) === 0
    ? '<span style="font-size:13px;letter-spacing:0.08em">Sob consulta</span>'
    : fmtPrice(p.price);

  return `
    <article class="product-card reveal" 
             onclick="window.location='produto.html?slug=${p.slug}'"
             style="cursor:pointer">
      <div class="product-img-wrap">
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
        ${coverImg
          ? `<img src="${coverImg.url}" alt="${coverImg.alt || p.name}" style="width:100%;height:100%;object-fit:cover">`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--color-bg-alt)">
               <svg viewBox="0 0 160 200" width="100" opacity=".3"><path d="M48 50Q40 100 44 155Q56 190 80 191Q104 190 116 155Q120 100 112 50Z" fill="currentColor"/><ellipse cx="80" cy="50" rx="32" ry="8" fill="currentColor"/></svg>
             </div>`}
        <div class="product-quick-add">
          <button class="btn-primary" style="font-size:10px;padding:10px 20px"
            onclick="event.stopPropagation();handleQuickAdd('${p.slug}',${p.id},'${p.name}')">
            ${Number(p.price) === 0 ? 'Solicitar' : 'Adicionar'}
          </button>
        </div>
      </div>
      <div class="product-material">${p.material || ''}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">${price}</div>
    </article>
  `;
}
window.renderProductCard = renderProductCard;

async function handleQuickAdd(slug, id, name) {
  if (slug === 'peca-personalizada') {
    window.open('https://wa.me/5511999999999?text=Quero+uma+peça+personalizada!','_blank');
    return;
  }
  try {
    const data = await window.api.products.get(slug);
    Cart.add(data.product, 1);
  } catch { showToast('Erro ao adicionar produto.'); }
}
window.handleQuickAdd = handleQuickAdd;

/* === STATUS BADGE === */
const STATUS_MAP = {
  pending:       { label: 'Pendente',      cls: 'status-processando' },
  confirmed:     { label: 'Confirmado',    cls: 'status-processando' },
  in_production: { label: 'Em produção',   cls: 'status-producao' },
  shipped:       { label: 'Enviado',       cls: 'status-enviado' },
  delivered:     { label: 'Entregue',      cls: 'status-entregue' },
  cancelled:     { label: 'Cancelado',     cls: 'status-cancelado' },
  refunded:      { label: 'Reembolsado',   cls: 'status-cancelado' },
};
function statusBadge(status) {
  const s = STATUS_MAP[status] || { label: status, cls: '' };
  return `<span class="pedido-status ${s.cls}">${s.label}</span>`;
}
window.statusBadge = statusBadge;

/* === INIT GLOBAL === */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  Cart.init();
  initReveal();
  initNewsletter();
});
