/**
 * DECORISA - cart.js
 * Carrinho de compras com persistencia localStorage.
 */

const Cart = (() => {
  const KEY = 'decorisa_cart';
  const STATE_KEY = 'decorisa_cart_state';

  let _items = [];
  let _coupon = null;
  let _shipping = null;
  let _shippingQuote = null;
  let _initialized = false;

  function subtotal() {
    return +_items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
  }

  function discount() {
    if (!_coupon) return 0;
    const sub = subtotal();
    return _coupon.type === 'percent'
      ? +(sub * _coupon.value / 100).toFixed(2)
      : +Math.min(_coupon.value, sub).toFixed(2);
  }

  function _refreshShippingFromSubtotal() {
    if (_items.length === 0) {
      _shipping = null;
      _shippingQuote = null;
      return;
    }
    if (!_shippingQuote) return;

    const standard = Number(_shippingQuote.standard);
    const freeFrom = Number(_shippingQuote.free_from);
    if (!Number.isFinite(standard) || !Number.isFinite(freeFrom)) {
      _shipping = null;
      _shippingQuote = null;
      return;
    }
    _shipping = subtotal() - discount() >= freeFrom ? 0 : standard;
  }

  function load() {
    try { _items = JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { _items = []; }

    try {
      const state = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
      _coupon = state.coupon || null;
      _shippingQuote = state.shippingQuote || null;
      _shipping = Number.isFinite(Number(state.shipping)) ? Number(state.shipping) : null;
      _refreshShippingFromSubtotal();
    } catch {
      _coupon = null;
      _shipping = null;
      _shippingQuote = null;
    }
  }

  function save() {
    _refreshShippingFromSubtotal();
    localStorage.setItem(KEY, JSON.stringify(_items));
    localStorage.setItem(STATE_KEY, JSON.stringify({
      coupon: _coupon,
      shipping: _shipping,
      shippingQuote: _shippingQuote,
    }));
    _updateCount();
    _renderDrawer();
    syncShippingResult();
  }

  function add(product, qty = 1, color = null, size = null) {
    const key = `${product.id}-${color}-${size}`;
    const ex = _items.find(i => i.key === key);
    if (ex) {
      ex.qty = Math.min(ex.qty + qty, product.stock || 99);
    } else {
      _items.push({
        key,
        id: product.id,
        slug: product.slug,
        name: product.name,
        material: product.material,
        price: Number(product.price),
        stock: product.stock || 99,
        qty,
        color,
        size,
        image: product.images?.[0]?.url || null,
      });
    }
    save();
    showToast(`"${product.name}" adicionado ao carrinho`);
    openDrawer();
  }

  function remove(key) {
    _items = _items.filter(i => i.key !== key);
    if (_items.length === 0) {
      _coupon = null;
      _shipping = null;
      _shippingQuote = null;
    }
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
    _coupon = null;
    _shipping = null;
    _shippingQuote = null;
    save();
  }

  function setShipping(cost) {
    _shipping = Number.isFinite(Number(cost)) ? Number(cost) : null;
    save();
  }

  function setShippingFromResponse(data, cep) {
    const standard = Number(data?.shipping?.standard);
    const freeFrom = Number(data?.shipping?.free_from);
    if (!Number.isFinite(standard) || !Number.isFinite(freeFrom)) {
      throw new Error('Resposta de frete invalida.');
    }
    _shippingQuote = {
      cep,
      standard,
      free_from: freeFrom,
      address: data.address || null,
    };
    _refreshShippingFromSubtotal();
    save();
    return _shipping;
  }

  function clearShipping(message = '') {
    _shipping = null;
    _shippingQuote = null;
    save();
    const resultEl = document.getElementById('shippingResult');
    if (resultEl && message) _setResult(resultEl, message, '#A33');
  }

  function setCoupon(c) {
    _coupon = c;
    save();
  }

  function clearCoupon() {
    _coupon = null;
    save();
  }

  function shippingCost() {
    return _shipping ?? null;
  }

  function shippingQuote() {
    return _shippingQuote;
  }

  function shippingZip() {
    return _shippingQuote?.cep || null;
  }

  function shippingAddress() {
    return _shippingQuote?.address || null;
  }

  function total() {
    return +(subtotal() - discount() + (_shipping || 0)).toFixed(2);
  }

  function count() {
    return _items.reduce((s, i) => s + i.qty, 0);
  }

  function _updateCount() {
    const els = document.querySelectorAll('.cart-count');
    const n = count();
    els.forEach(el => {
      el.textContent = n;
      el.classList.toggle('visible', n > 0);
    });
  }

  function _fmt(v) {
    return 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function _qs(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function _setResult(el, text, color = '') {
    if (!el) return;
    el.textContent = text;
    el.style.color = color;
  }

  function _shippingMessage() {
    if (_shipping === null) return '';
    return _shipping === 0
      ? 'Frete gratis aplicado.'
      : `Frete: ${_fmt(_shipping)} - Prazo: 5 a 8 dias uteis`;
  }

  function syncShippingResult() {
    const cepInput = document.getElementById('cepInput');
    const resultEl = document.getElementById('shippingResult');
    if (cepInput && _shippingQuote?.cep) {
      cepInput.value = _shippingQuote.cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    if (resultEl && _shipping !== null) _setResult(resultEl, _shippingMessage(), '#4A7A4A');
  }

  function _renderDrawer() {
    const itemsEl = document.getElementById('cartItems');
    const emptyEl = document.getElementById('cartEmpty');
    const footerEl = document.getElementById('cartFooter');
    if (!itemsEl) return;

    if (_items.length === 0) {
      emptyEl?.style && (emptyEl.style.display = 'flex');
      footerEl?.style && (footerEl.style.display = 'none');
      itemsEl.innerHTML = '';
      return;
    }

    emptyEl?.style && (emptyEl.style.display = 'none');
    footerEl?.style && (footerEl.style.display = 'block');

    itemsEl.innerHTML = _items.map(item => `
      <li class="cart-item">
        <div class="cart-item-img" aria-hidden="true">
          ${item.image
            ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover">`
            : `<div class="premium-placeholder premium-placeholder--small"><span>Imagem em breve</span></div>`}
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-variant">${[item.size, item.color ? '*' : ''].filter(Boolean).join(' ')}</div>
          <div class="cart-item-qty">
            <button onclick="Cart.changeQty('${item.key}',-1)" aria-label="Diminuir">-</button>
            <span>${item.qty}</span>
            <button onclick="Cart.changeQty('${item.key}',1)" aria-label="Aumentar">+</button>
          </div>
          <button class="cart-item-remove" onclick="Cart.remove('${item.key}')">Remover</button>
        </div>
        <div class="cart-item-price">${_fmt(item.price * item.qty)}</div>
      </li>
    `).join('');

    _qs('cartSubtotal', _fmt(subtotal()));
    const d = discount();
    const dr = document.getElementById('discountRow');
    if (dr) dr.style.display = d > 0 ? 'flex' : 'none';
    _qs('cartDiscount', `- ${_fmt(d)}`);

    const fr = document.getElementById('freteRow');
    if (fr) fr.style.display = _shipping !== null ? 'flex' : 'none';
    _qs('cartFrete', _shipping === 0 ? 'Gratis' : _fmt(_shipping || 0));
    _qs('cartTotal', _fmt(total()));
  }

  function openDrawer() {
    const d = document.getElementById('cartDrawer');
    if (!d) return;
    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const d = document.getElementById('cartDrawer');
    if (!d) return;
    d.classList.remove('open');
    d.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function init() {
    if (_initialized) {
      load();
      _updateCount();
      _renderDrawer();
      syncShippingResult();
      return;
    }
    _initialized = true;
    load();
    _updateCount();
    _renderDrawer();
    syncShippingResult();

    document.getElementById('cartToggle')?.addEventListener('click', openDrawer);
    document.getElementById('cartClose')?.addEventListener('click', closeDrawer);
    document.getElementById('cartOverlay')?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  }

  async function calcularFrete() {
    const cepInput = document.getElementById('cepInput');
    const resultEl = document.getElementById('shippingResult');
    if (!cepInput || !resultEl) return;

    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      clearShipping();
      _setResult(resultEl, 'Informe um CEP com 8 digitos.', '#A33');
      return;
    }
    if (_items.length === 0) {
      clearShipping();
      _setResult(resultEl, 'Adicione itens ao carrinho para calcular o frete.', '#A33');
      return;
    }

    _setResult(resultEl, 'Calculando...');
    try {
      const data = await window.api.payment.getShipping(cep);
      setShippingFromResponse(data, cep);
      syncShippingResult();
    } catch (err) {
      clearShipping();
      _setResult(resultEl, err?.message || 'Nao foi possivel calcular o frete para este CEP.', '#A33');
    }
  }

  async function aplicarCupom() {
    const codeInput = document.getElementById('couponInput');
    const resultEl = document.getElementById('couponResult');
    if (!codeInput || !resultEl) return;
    const code = codeInput.value.trim();
    if (!code) { resultEl.textContent = 'Digite um cupom.'; return; }
    try {
      const data = await window.api.coupons.validate(code, subtotal());
      setCoupon(data.coupon);
      resultEl.textContent = `Desconto de ${_fmt(data.coupon.discount)} aplicado!`;
      resultEl.style.color = '#4A7A4A';
    } catch (err) {
      resultEl.textContent = err.message;
      resultEl.style.color = '#A33';
    }
  }

  function getCheckoutPayload() {
    return {
      items: _items.map(i => ({
        product_id: i.id,
        quantity: i.qty,
        variant_color: i.color,
        variant_size: i.size,
      })),
      coupon_code: _coupon?.code || null,
    };
  }

  return {
    init,
    add,
    remove,
    changeQty,
    clear,
    openDrawer,
    closeDrawer,
    calcularFrete,
    aplicarCupom,
    setShipping,
    setShippingFromResponse,
    clearShipping,
    setCoupon,
    clearCoupon,
    syncShippingResult,
    subtotal,
    discount,
    shippingCost,
    shippingQuote,
    shippingZip,
    shippingAddress,
    total,
    count,
    getItems: () => _items,
    getCheckoutPayload,
    getCoupon: () => _coupon,
  };
})();

window.Cart = Cart;
