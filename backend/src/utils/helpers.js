const { v4: uuidv4 } = require('uuid');

function generateOrderNumber() {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `DEC-${ts}-${rnd}`;
}

function formatPrice(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcPix(price) {
  return +(price * 0.95).toFixed(2);
}

const SHIPPING_FREE_FROM = 500;

function shippingStandardForState(state = '') {
  const heavy = ['AM','PA','RR','AP','AC','RO','TO'].includes(String(state).toUpperCase());
  return heavy ? 35.90 : 19.90;
}

function calcShipping(subtotal, state = '') {
  if (Number(subtotal) >= SHIPPING_FREE_FROM) return 0;
  return shippingStandardForState(state);
}

module.exports = {
  generateOrderNumber,
  formatPrice,
  calcPix,
  calcShipping,
  shippingStandardForState,
  SHIPPING_FREE_FROM,
};
