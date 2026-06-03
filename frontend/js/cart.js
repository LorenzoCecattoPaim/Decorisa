/**
 * DECORISA — cart.js
 * Carrinho de compras com persistência localStorage
 */

const Cart = (() => {
  const KEY = 'decorisa_cart';

  let _items   = [];
  let _coupon  = null;
  let _shipping = null;

  /* === PERSISTÊNCIA === */
  function load() {
    try { _items = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { _items = []; }
  }
  function save() {
    localStorage.setItem(KEY, JSON.stringify(_items));
    _updateCount();
    _renderDrawer();
  }

  /* === CRUD === */
  function add(product, qty = 1, color = null, size = null) {
    const key = `${product.id}-${color}-${size}`;
    const ex  = _items.find(i => i.key === key);
    if (ex) {
      ex.qty = Math.min(ex.qty + qty, product.stock || 99);
    } else {
      _items.push({
        key, id: product.id, slug: product.slug,
        name: product.name, material: product.material,
        price: Number(product.price), stock: product.stock || 99,
        qty, color, size,
        image: product.images?.[0]?.url || null,
      });
    }
    save();
    showToast(`"${product.name}" adicionado ao carrinho`);
    openDrawer();
  }

  function remove(key) {
    _items = _items.filter(i => i.key !== key);
    save();
  }

  function changeQty(key, delta) {
    const item = _items.find(i => i.key === key);
    if (!item) return;
    item.qty = Math.max(1, Math.min(item.qty + delta, item.stock));
    save();
  }

  function clear() {
    _items = [];
    _coupon  = null;
    _shipping = null;
    save();
  }

  function setShipping(cost) { _shipping = cost; _renderDrawer(); }
  function setCoupon(c)      { _coupon   = c;    _renderDrawer(); }
  function clearCoupon()     { _coupon   = null; _renderDrawer(); }

  /* === CÁLCULOS === */
  function subtotal() { return +_items.reduce((s,i) => s + i.price * i.qty, 0).toFixed(2); }
  function discount() {
    if (!_coupon) return 0;
    const sub = subtotal();
    return _coupon.type === 'percent'
      ? +(sub * _coupon.value / 100).toFixed(2)
      : +Math.min(_coupon.value, sub).toFixed(2);
  }
  function shippingCost() { return _shipping ?? null; }
  function total() {
    return +(subtotal() - discount() + (_shipping || 0)).toFixed(2);
  }
  function count() { return _items.reduce((s,i) => s + i.qty, 0); }

  /* === UI === */
  function _updateCount() {
    const els = document.querySelectorAll('.cart-count');
    const n   = count();
    els.forEach(el => {
      el.textContent = n;
      el.classList.toggle('visible', n > 0);
    });
  }

  function _fmt(v) {
    return 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function _renderDrawer() {
    const itemsEl  = document.getElementById('cartItems');
    const emptyEl  = document.getElementById('cartEmpty');
    const footerEl = document.getElementById('cartFooter');
    if (!itemsEl) return;

    if (_items.length === 0) {
      emptyEl?.style  && (emptyEl.style.display  = 'flex');
      footerEl?.style && (footerEl.style.display = 'none');
      itemsEl.innerHTML = '';
      return;
    }
    emptyEl?.style  && (emptyEl.style.display  = 'none');
    footerEl?.style && (footerEl.style.display = 'block');

    itemsEl.innerHTML = _items.map(item => `
      <li class="cart-item">
        <div class="cart-item-img" aria-hidden="true">
          ${item.image
            ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover">`
            : `<div style="width:100%;height:100%;background:var(--color-bg-alt)"></div>`}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-variant">${[item.size, item.color ? '●' : ''].filter(Boolean).join(' ')}</div>
          <div class="cart-item-qty">
            <button onclick="Cart.changeQty('${item.key}',-1)" aria-label="Diminuir">−</button>
            <span>${item.qty}</span>
            <button onclick="Cart.changeQty('${item.key}',1)"  aria-label="Aumentar">+</button>
          </div>
          <button class="cart-item-remove" onclick="Cart.remove('${item.key}')">Remover</button>
        </div>
        <div class="cart-item-price">${_fmt(item.price * item.qty)}</div>
      </li>
    `).join('');

    /* Totais */
    _qs('cartSubtotal', _fmt(subtotal()));
    const d = discount();
    const dr = document.getElementById('discountRow');
    if (dr) dr.style.display = d > 0 ? 'flex' : 'none';
    _qs('cartDiscount', `− ${_fmt(d)}`);

    const fr = document.getElementById('freteRow');
    if (fr) fr.style.display = _shipping !== null ? 'flex' : 'none';
    _qs('cartFrete', _shipping === 0 ? 'Grátis' : _fmt(_shipping || 0));
    _qs('cartTotal', _fmt(total()));
  }

  function _qs(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  /* === DRAWER === */
  function openDrawer() {
    const d = document.getElementById('cartDrawer');
    if (!d) return;
    d.classList.add('open');
    d.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    const d = document.getElementById('cartDrawer');
    if (!d) return;
    d.classList.remove('open');
    d.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  /* === INIT === */
  function init() {
    load();
    _updateCount();
    _renderDrawer();

    document.getElementById('cartToggle')?.addEventListener('click', openDrawer);
    document.getElementById('cartClose' )?.addEventListener('click', closeDrawer);
    document.getElementById('cartOverlay')?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  }

  /* === FRETE === */
  async function calcularFrete() {
    const cepInput = document.getElementById('cepInput');
    const resultEl = document.getElementById('shippingResult');
    if (!cepInput || !resultEl) return;
    const cep = cepInput.value.replace(/\D/g,'');
    if (cep.length !== 8) { resultEl.textContent = 'CEP inválido.'; return; }
    resultEl.textContent = 'Calculando...';
    try {
      const data = await window.api.payment.getShipping(cep);
      const cost = subtotal() >= data.shipping.free_from ? 0 : data.shipping.standard;
      setShipping(cost);
      resultEl.textContent = cost === 0
        ? '✓ Frete grátis para este CEP!'
        : `Frete: ${_fmt(cost)} — Prazo: 5 a 8 dias úteis`;
    } catch {
      resultEl.textContent = 'Erro ao calcular frete.';
    }
  }

  async function aplicarCupom() {
    const codeInput = document.getElementById('couponInput');
    const resultEl  = document.getElementById('couponResult');
    if (!codeInput || !resultEl) return;
    const code = codeInput.value.trim();
    if (!code) { resultEl.textContent = 'Digite um cupom.'; return; }
    try {
      const data = await window.api.coupons.validate(code, subtotal());
      setCoupon(data.coupon);
      resultEl.textContent = `✓ Desconto de ${_fmt(data.coupon.discount)} aplicado!`;
      resultEl.style.color = '#4A7A4A';
    } catch (err) {
      resultEl.textContent = err.message;
      resultEl.style.color = '#A33';
    }
  }

  /* Expõe payload para checkout */
  function getCheckoutPayload() {
    return {
      items: _items.map(i => ({
        product_id: i.id, quantity: i.qty,
        variant_color: i.color, variant_size: i.size,
      })),
      coupon_code: _coupon?.code || null,
    };
  }

  return {
    init, add, remove, changeQty, clear,
    openDrawer, closeDrawer,
    calcularFrete, aplicarCupom,
    setShipping, setCoupon,
    subtotal, discount, shippingCost, total, count,
    getItems: () => _items,
    getCheckoutPayload,
    getCoupon: () => _coupon,
  };
})();

window.Cart = Cart;
