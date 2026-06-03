const router   = require('express').Router();
const { body } = require('express-validator');
const supabase  = require('../config/supabase');
const mailer    = require('../utils/mailer');
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');
const { validate }  = require('../middleware/validate');
const { generateOrderNumber, calcShipping } = require('../utils/helpers');

/* POST /api/orders — criar pedido */
router.post('/',
  optionalAuth,
  body('items').isArray({ min: 1 }).withMessage('Itens obrigatórios'),
  body('items.*.product_id').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('customer_name').trim().notEmpty(),
  body('customer_email').isEmail().normalizeEmail(),
  body('payment_method').isIn(['pix','credit_card','boleto','mercado_pago']),
  body('ship_zip').trim().notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const {
        items, coupon_code, payment_method,
        customer_name, customer_email, customer_phone,
        ship_name, ship_zip, ship_street, ship_number,
        ship_complement, ship_neighborhood, ship_city, ship_state,
      } = req.body;

      /* Valida e calcula produtos */
      const productIds = items.map(i => i.product_id);
      const { data: products, error: pErr } = await supabase
        .from('products').select('id,name,sku,price,stock,production_days').in('id', productIds);
      if (pErr) throw pErr;

      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const prod = products.find(p => p.id === item.product_id);
        if (!prod) return res.status(400).json({ error: `Produto não encontrado: ${item.product_id}` });
        if (prod.stock < item.quantity) return res.status(400).json({ error: `Estoque insuficiente para "${prod.name}".` });
        const total_price = +(prod.price * item.quantity).toFixed(2);
        subtotal += total_price;
        orderItems.push({
          product_id: prod.id, product_name: prod.name, product_sku: prod.sku,
          variant_color: item.variant_color || null, variant_size: item.variant_size || null,
          quantity: item.quantity, unit_price: prod.price, total_price,
        });
      }

      /* Cupom */
      let discount = 0, couponId = null;
      if (coupon_code) {
        const { data: coupon } = await supabase
          .from('coupons').select('*').eq('code', coupon_code.toUpperCase()).eq('active', true).single();
        if (coupon) {
          if (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) {
            if (!coupon.max_uses || coupon.used_count < coupon.max_uses) {
              if (subtotal >= (coupon.min_order || 0)) {
                discount = coupon.type === 'percent'
                  ? +(subtotal * coupon.value / 100).toFixed(2)
                  : +Math.min(coupon.value, subtotal).toFixed(2);
                couponId = coupon.id;
              }
            }
          }
        }
      }

      /* Frete */
      const shipping_cost = calcShipping(subtotal - discount, ship_state || '');
      const total = +(subtotal - discount + shipping_cost).toFixed(2);
      const order_number = generateOrderNumber();
      const maxDays = Math.max(...products.map(p => p.production_days || 7));

      /* Cria pedido */
      const { data: order, error: oErr } = await supabase.from('orders').insert({
        order_number, user_id: req.user?.id || null,
        status: 'pending', payment_method, payment_status: 'pending',
        subtotal, discount, shipping_cost, total,
        coupon_id: couponId, coupon_code: couponId ? coupon_code : null,
        customer_name, customer_email, customer_phone: customer_phone || null,
        ship_name: ship_name || customer_name, ship_zip, ship_street, ship_number,
        ship_complement: ship_complement || null, ship_neighborhood, ship_city, ship_state,
      }).select().single();
      if (oErr) throw oErr;

      /* Itens */
      const { error: iErr } = await supabase.from('order_items')
        .insert(orderItems.map(i => ({ ...i, order_id: order.id })));
      if (iErr) throw iErr;

      /* Decrementa estoque */
      for (const item of items) {
        const prod = products.find(p => p.id === item.product_id);
        await supabase.from('products').update({ stock: prod.stock - item.quantity }).eq('id', prod.id);
      }

      /* Incrementa uso do cupom */
      if (couponId) {
        await supabase.rpc('increment_coupon', { coupon_id: couponId }).catch(() => {});
      }

      /* E-mail de confirmação */
      mailer.sendOrderConfirmed({
        to: customer_email, name: customer_name,
        order: { ...order, items: orderItems, production_days: maxDays }
      }).catch(() => {});

      res.status(201).json({ order: { ...order, items: orderItems } });
    } catch (err) { next(err); }
  }
);

/* GET /api/orders/mine — pedidos do cliente logado */
router.get('/mine', auth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id,order_number,status,payment_status,total,created_at,order_items(product_name,quantity,unit_price)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ orders: data });
  } catch (err) { next(err); }
});

/* GET /api/orders/:id — detalhe do pedido (dono ou admin) */
router.get('/:id', auth, async (req, res, next) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !order) return res.status(404).json({ error: 'Pedido não encontrado.' });
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    res.json({ order });
  } catch (err) { next(err); }
});

/* ---- ADMIN ---- */

/* GET /api/orders (admin) */
router.get('/', auth, adminOnly, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let q = supabase
      .from('orders')
      .select('id,order_number,status,payment_status,total,customer_name,customer_email,created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (status) q = q.eq('status', status);
    if (search) q = q.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);

    const { data, count, error } = await q;
    if (error) throw error;
    res.json({ orders: data, total: count });
  } catch (err) { next(err); }
});

/* PATCH /api/orders/:id/status (admin) */
router.patch('/:id/status', auth, adminOnly,
  body('status').isIn(['pending','confirmed','in_production','shipped','delivered','cancelled','refunded']),
  body('payment_status').optional().isIn(['pending','paid','failed','refunded']),
  validate,
  async (req, res, next) => {
    try {
      const { status, payment_status, tracking_code, notes } = req.body;
      const updates = { status };
      if (payment_status) updates.payment_status = payment_status;
      if (tracking_code)  updates.tracking_code  = tracking_code;
      if (notes)          updates.notes           = notes;

      const { data: order, error } = await supabase
        .from('orders').update(updates).eq('id', req.params.id)
        .select('*,order_items(*)').single();

      if (error || !order) return res.status(404).json({ error: 'Pedido não encontrado.' });

      /* Envia e-mail de envio */
      if (status === 'shipped') {
        mailer.sendOrderShipped({
          to: order.customer_email, name: order.customer_name,
          orderNumber: order.order_number, trackingCode: tracking_code || null
        }).catch(() => {});
      }

      res.json({ order });
    } catch (err) { next(err); }
  }
);

module.exports = router;
