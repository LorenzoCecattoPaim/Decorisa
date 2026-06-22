const router  = require('express').Router();
const { body } = require('express-validator');
const supabase  = require('../config/supabase');
const { auth, adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { processBackInStockNotifications } = require('../utils/stockNotificationService');

/* Campos de personalização permitidos */
const CUSTOM_FIELDS = [
  'allow_customization','allow_colors','allow_marble','allow_metallic','metallic_price'
];

/* Tipo de produto */
const PRODUCT_TYPE_FIELDS = ['product_type'];

/* ================================================================
   ROTAS ESTÁTICAS — devem vir ANTES de qualquer /:param
   (Express resolve rotas em ordem; /:slug engoleria /categories etc.)
================================================================ */

/* GET /api/products/categories */
router.get('/categories', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories').select('id,slug,name,description').eq('active', true).order('sort_order');
    if (error) throw error;
    res.json({ categories: data });
  } catch (err) { next(err); }
});

/* GET /api/products/customization-colors — cores globais das peças (público) */
router.get('/customization-colors', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('customization_colors')
      .select('id,name,hex,sort_order')
      .eq('active', true)
      .order('sort_order');
    if (error) throw error;
    res.json({ colors: data });
  } catch (err) { next(err); }
});

/* GET /api/products/marble-colors — cores do marmorizado (público) */
router.get('/marble-colors', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('marble_colors')
      .select('id,name,hex,sort_order')
      .eq('active', true)
      .order('sort_order');
    if (error) throw error;
    res.json({ colors: data });
  } catch (err) { next(err); }
});

/* GET /api/products/admin/list (admin) */
router.get('/admin/list', auth, adminOnly, async (req, res, next) => {
  try {
    const { page = 1, limit = 50, product_type: filterType } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let q = supabase
      .from('products')
      .select(`
        id, sku, name, slug, price, stock, active, featured, product_type,
        allow_customization, allow_colors, allow_marble, allow_metallic, metallic_price,
        category:categories(id,slug,name),
        available_colors:product_available_colors(color:customization_colors(id,name,hex)),
        available_marble_colors:product_available_marble_colors(color:marble_colors(id,name,hex))
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (filterType && ['stock','made_to_order'].includes(filterType)) {
      q = q.eq('product_type', filterType);
    }

    const { data, count, error } = await q;
    if (error) throw error;
    const products = (data || []).map(p => ({
      ...p,
      available_colors: (p.available_colors || []).filter(ac => ac.color).map(ac => ac.color),
      available_marble_colors: (p.available_marble_colors || []).filter(ac => ac.color).map(ac => ac.color),
    }));
    res.json({ products, total: count });
  } catch (err) { next(err); }
});

/* GET /api/products/admin/customization-colors (admin) */
router.get('/admin/customization-colors', auth, adminOnly, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('customization_colors').select('*').order('sort_order');
    if (error) throw error;
    res.json({ colors: data });
  } catch (err) { next(err); }
});

/* POST /api/products/admin/customization-colors (admin) */
router.post('/admin/customization-colors', auth, adminOnly, async (req, res, next) => {
  try {
    const { name, hex, sort_order = 0 } = req.body;
    if (!name || !hex) return res.status(400).json({ error: 'name e hex obrigatórios.' });
    const { data, error } = await supabase
      .from('customization_colors').insert({ name, hex, sort_order }).select().single();
    if (error) throw error;
    res.status(201).json({ color: data });
  } catch (err) { next(err); }
});

/* PUT /api/products/admin/customization-colors/:id (admin) */
router.put('/admin/customization-colors/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const { name, hex, sort_order, active } = req.body;
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (hex !== undefined) payload.hex = hex;
    if (sort_order !== undefined) payload.sort_order = sort_order;
    if (active !== undefined) payload.active = active;
    const { data, error } = await supabase
      .from('customization_colors').update(payload).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ color: data });
  } catch (err) { next(err); }
});

/* DELETE /api/products/admin/customization-colors/:id (admin) */
router.delete('/admin/customization-colors/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('customization_colors').update({ active: false }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Cor desativada.' });
  } catch (err) { next(err); }
});

/* GET /api/products/admin/marble-colors (admin) */
router.get('/admin/marble-colors', auth, adminOnly, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('marble_colors').select('*').order('sort_order');
    if (error) throw error;
    res.json({ colors: data });
  } catch (err) { next(err); }
});

/* POST /api/products/admin/marble-colors (admin) */
router.post('/admin/marble-colors', auth, adminOnly, async (req, res, next) => {
  try {
    const { name, hex, sort_order = 0 } = req.body;
    if (!name || !hex) return res.status(400).json({ error: 'name e hex obrigatórios.' });
    const { data, error } = await supabase
      .from('marble_colors').insert({ name, hex, sort_order }).select().single();
    if (error) throw error;
    res.status(201).json({ color: data });
  } catch (err) { next(err); }
});

/* PUT /api/products/admin/marble-colors/:id (admin) */
router.put('/admin/marble-colors/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const { name, hex, sort_order, active } = req.body;
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (hex !== undefined) payload.hex = hex;
    if (sort_order !== undefined) payload.sort_order = sort_order;
    if (active !== undefined) payload.active = active;
    const { data, error } = await supabase
      .from('marble_colors').update(payload).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ color: data });
  } catch (err) { next(err); }
});

/* DELETE /api/products/admin/marble-colors/:id (admin) */
router.delete('/admin/marble-colors/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('marble_colors').update({ active: false }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Cor de marmorizado desativada.' });
  } catch (err) { next(err); }
});

/* ================================================================
   ROTA PÚBLICA DE LISTAGEM
================================================================ */

/* GET /api/products */
router.get('/', async (req, res, next) => {
  try {
    const {
      category, featured, search,
      sort = 'created_at', order = 'desc',
      page = 1, limit = 20
    } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let q = supabase
      .from('products')
      .select(`
        id, sku, name, slug, price, price_pix, material, stock, badge, featured, active, product_type,
        allow_customization, allow_colors, allow_marble, allow_metallic, metallic_price,
        category:categories(id,slug,name),
        images:product_images(url,alt,is_cover),
        variants:product_variants(type,label,value,hex,sort_order)
      `, { count: 'exact' })
      .eq('active', true)
      .range(offset, offset + Number(limit) - 1);

    if (category) q = q.eq('categories.slug', category);
    if (featured === 'true') q = q.eq('featured', true);
    if (search) q = q.ilike('name', `%${search}%`);
    if (['price','name','created_at'].includes(sort)) {
      q = q.order(sort, { ascending: order === 'asc' });
    }

    const { data, count, error } = await q;
    if (error) throw error;

    res.json({ products: data, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
});

/* ================================================================
   ROTAS DE PRODUTO POR SLUG — APÓS todas as estáticas
================================================================ */

/* GET /api/products/:slug */
router.get('/:slug', async (req, res, next) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id,slug,name),
        images:product_images(id,url,alt,is_cover,sort_order),
        variants:product_variants(id,type,label,value,hex,sort_order,price_delta),
        reviews(id,rating,title,body,created_at,approved,user:users(name)),
        available_colors:product_available_colors(color:customization_colors(id,name,hex)),
        available_marble_colors:product_available_marble_colors(color:marble_colors(id,name,hex))
      `)
      .eq('slug', req.params.slug)
      .eq('active', true)
      .single();

    if (error || !product) return res.status(404).json({ error: 'Produto não encontrado.' });

    product.images   = (product.images   || []).sort((a, b) => a.sort_order - b.sort_order);
    product.variants = (product.variants || []).sort((a, b) => a.sort_order - b.sort_order);
    product.reviews  = (product.reviews  || []).filter(r => r.approved);
    product.available_colors = (product.available_colors || [])
      .filter(ac => ac.color)
      .map(ac => ac.color);
    product.available_marble_colors = (product.available_marble_colors || [])
      .filter(ac => ac.color)
      .map(ac => ac.color);

    const avgRating = product.reviews.length
      ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

    res.json({ product: { ...product, avg_rating: avgRating } });
  } catch (err) { next(err); }
});

/* ================================================================
   CRUD ADMIN — criação e edição de produtos
================================================================ */

/* POST /api/products (admin) */
router.post('/', auth, adminOnly,
  body('sku').trim().notEmpty(),
  body('name').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  validate,
  async (req, res, next) => {
    try {
      const baseFields = [
        'sku','name','slug','category_id','price','price_pix','description',
        'material','dimensions','weight','finish','production_days',
        'stock','badge','featured','active'
      ];
      const payload = Object.fromEntries(
        [...baseFields, ...CUSTOM_FIELDS, ...PRODUCT_TYPE_FIELDS]
          .filter(f => req.body[f] !== undefined)
          .map(f => [f, req.body[f]])
      );

      // Regra: categoria velas sem personalização
      if (payload.category_id) {
        const { data: cat } = await supabase
          .from('categories').select('slug').eq('id', payload.category_id).single();
        if (cat?.slug === 'velas') {
          payload.allow_customization = false;
          payload.allow_colors        = false;
          payload.allow_marble        = false;
          payload.allow_metallic      = false;
          if (!payload.product_type) payload.product_type = 'stock';
        } else {
          if (!payload.product_type) payload.product_type = 'made_to_order';
        }
      }

      const { data, error } = await supabase.from('products').insert(payload).select().single();
      if (error) throw error;

      if (req.body.available_color_ids?.length && data.id) {
        const rows = req.body.available_color_ids.map(cid => ({ product_id: data.id, color_id: cid }));
        await supabase.from('product_available_colors').insert(rows);
      }

      if (req.body.available_marble_color_ids !== undefined && data.id) {
        if (req.body.available_marble_color_ids?.length) {
          const rows = req.body.available_marble_color_ids.map(cid => ({ product_id: data.id, color_id: cid }));
          await supabase.from('product_available_marble_colors').insert(rows);
        }
      }

      res.status(201).json({ product: data });
    } catch (err) { next(err); }
  }
);

/* PUT /api/products/:id (admin) */
router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const baseFields = [
      'name','slug','category_id','price','price_pix','description',
      'material','dimensions','weight','finish','production_days',
      'stock','badge','featured','active'
    ];
    const payload = Object.fromEntries(
      [...baseFields, ...CUSTOM_FIELDS, ...PRODUCT_TYPE_FIELDS]
        .filter(f => req.body[f] !== undefined)
        .map(f => [f, req.body[f]])
    );

    if (payload.category_id) {
      const { data: cat } = await supabase
        .from('categories').select('slug').eq('id', payload.category_id).single();
      if (cat?.slug === 'velas') {
        payload.allow_customization = false;
        payload.allow_colors        = false;
        payload.allow_marble        = false;
        payload.allow_metallic      = false;
      }
    }

    /* Captura o estoque anterior ANTES de atualizar, para detectar reabastecimento */
    let previousStock = null;
    if (payload.stock !== undefined) {
      const { data: before, error: beforeErr } = await supabase
        .from('products').select('stock').eq('id', req.params.id).single();
      if (beforeErr) {
        console.error('[BACK_IN_STOCK] Erro ao ler estoque anterior:', beforeErr.message);
      } else {
        previousStock = Number(before?.stock ?? -1);
      }
    }

    const { data, error } = await supabase
      .from('products').update(payload).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Produto não encontrado.' });

    if (req.body.available_color_ids !== undefined) {
      await supabase.from('product_available_colors').delete().eq('product_id', req.params.id);
      if (req.body.available_color_ids?.length) {
        const rows = req.body.available_color_ids.map(cid => ({
          product_id: req.params.id, color_id: cid
        }));
        await supabase.from('product_available_colors').insert(rows);
      }
    }

    if (req.body.available_marble_color_ids !== undefined) {
      await supabase.from('product_available_marble_colors').delete().eq('product_id', req.params.id);
      if (req.body.available_marble_color_ids?.length) {
        const rows = req.body.available_marble_color_ids.map(cid => ({
          product_id: req.params.id, color_id: cid
        }));
        await supabase.from('product_available_marble_colors').insert(rows);
      }
    }

    /* Detecta transição de estoque 0 → positivo e dispara notificações.
       Roda em background para não atrasar a resposta ao admin.
       previousStock e currentStock são passados explicitamente para garantir
       a transição correta, sem depender de consulta adicional ao banco. */
    if (previousStock !== null && Number(previousStock) <= 0 && Number(data.stock) > 0) {
      processBackInStockNotifications(data.id, previousStock, Number(data.stock))
        .catch(err => console.error('[BACK_IN_STOCK] Falha crítica no disparo:', err?.stack || err?.message));
    }

    res.json({ product: data });
  } catch (err) { next(err); }
});

/* DELETE /api/products/:id (admin — soft delete) */
router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('products').update({ active: false }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Produto desativado.' });
  } catch (err) { next(err); }
});

/* POST /api/products/:id/images (admin) */
router.post('/:id/images', auth, adminOnly,
  body('url').isURL().withMessage('URL inválida'),
  validate,
  async (req, res, next) => {
    try {
      const { url, alt, sort_order = 0, is_cover = false } = req.body;
      if (is_cover) {
        await supabase.from('product_images').update({ is_cover: false }).eq('product_id', req.params.id);
      }
      const { data, error } = await supabase.from('product_images')
        .insert({ product_id: req.params.id, url, alt, sort_order, is_cover }).select().single();
      if (error) throw error;
      res.status(201).json({ image: data });
    } catch (err) { next(err); }
  }
);

/* POST /api/products/:id/variants (admin) */
router.post('/:id/variants', auth, adminOnly,
  body('type').isIn(['color','size']),
  body('label').notEmpty(),
  body('value').notEmpty(),
  validate,
  async (req, res, next) => {
    try {
      const { type, label, value, hex, sort_order = 0 } = req.body;
      const { data, error } = await supabase.from('product_variants')
        .insert({ product_id: req.params.id, type, label, value, hex, sort_order }).select().single();
      if (error) throw error;
      res.status(201).json({ variant: data });
    } catch (err) { next(err); }
  }
);

module.exports = router;
