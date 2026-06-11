const router  = require('express').Router();
const { body, query, param } = require('express-validator');
const supabase = require('../config/supabase');
const { auth, adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

/* Campos de personalização permitidos no payload */
const CUSTOM_FIELDS = [
  'allow_customization','allow_colors','allow_marble','allow_metallic','metallic_price'
];

/* GET /api/products — lista com filtros */
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, search, sort = 'created_at', order = 'desc', page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let q = supabase
      .from('products')
      .select(`
        id, sku, name, slug, price, price_pix, material, stock, badge, featured, active,
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

/* GET /api/products/categories */
router.get('/categories', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories').select('id,slug,name,description').eq('active', true).order('sort_order');
    if (error) throw error;
    res.json({ categories: data });
  } catch (err) { next(err); }
});

/* GET /api/products/customization-colors — cores globais disponíveis */
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
        reviews(id,rating,title,body,created_at,user:users(name)),
        available_colors:product_available_colors(color:customization_colors(id,name,hex))
      `)
      .eq('slug', req.params.slug)
      .eq('active', true)
      .single();

    if (error || !product) return res.status(404).json({ error: 'Produto não encontrado.' });

    product.images   = (product.images  || []).sort((a,b) => a.sort_order - b.sort_order);
    product.variants = (product.variants || []).sort((a,b) => a.sort_order - b.sort_order);
    product.reviews  = (product.reviews  || []).filter(r => r.approved);

    // Flatten available_colors
    product.available_colors = (product.available_colors || [])
      .filter(ac => ac.color)
      .map(ac => ac.color);

    const avgRating = product.reviews.length
      ? (product.reviews.reduce((s,r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

    res.json({ product: { ...product, avg_rating: avgRating } });
  } catch (err) { next(err); }
});

/* ---- ADMIN ---- */

/* GET /api/products/admin/list (admin) — lista com dados de personalização */
router.get('/admin/list', auth, adminOnly, async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const { data, count, error } = await supabase
      .from('products')
      .select(`
        id, sku, name, slug, price, stock, active, featured,
        allow_customization, allow_colors, allow_marble, allow_metallic, metallic_price,
        category:categories(id,slug,name),
        available_colors:product_available_colors(color:customization_colors(id,name,hex))
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    // Flatten colors
    const products = (data || []).map(p => ({
      ...p,
      available_colors: (p.available_colors || []).filter(ac => ac.color).map(ac => ac.color)
    }));
    res.json({ products, total: count });
  } catch (err) { next(err); }
});

/* POST /api/products (admin) */
router.post('/', auth, adminOnly,
  body('sku').trim().notEmpty(),
  body('name').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  validate,
  async (req, res, next) => {
    try {
      const baseFields = ['sku','name','slug','category_id','price','price_pix','description',
        'material','dimensions','weight','finish','production_days','stock','badge','featured','active'];
      const allFields = [...baseFields, ...CUSTOM_FIELDS];
      const payload = Object.fromEntries(
        allFields.filter(f => req.body[f] !== undefined).map(f => [f, req.body[f]])
      );

      // Regra: categoria velas sem personalização
      if (payload.category_id) {
        const { data: cat } = await supabase
          .from('categories').select('slug').eq('id', payload.category_id).single();
        if (cat?.slug === 'velas') {
          payload.allow_customization = false;
          payload.allow_colors = false;
          payload.allow_marble = false;
          payload.allow_metallic = false;
        }
      }

      const { data, error } = await supabase.from('products').insert(payload).select().single();
      if (error) throw error;

      // Salvar cores disponíveis
      if (req.body.available_color_ids?.length && data.id) {
        await supabase.from('product_available_colors').delete().eq('product_id', data.id);
        const colorRows = req.body.available_color_ids.map(cid => ({
          product_id: data.id, color_id: cid
        }));
        await supabase.from('product_available_colors').insert(colorRows);
      }

      res.status(201).json({ product: data });
    } catch (err) { next(err); }
  }
);

/* PUT /api/products/:id (admin) */
router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const baseFields = ['name','slug','category_id','price','price_pix','description',
      'material','dimensions','weight','finish','production_days','stock','badge','featured','active'];
    const allFields = [...baseFields, ...CUSTOM_FIELDS];
    const payload = Object.fromEntries(
      allFields.filter(f => req.body[f] !== undefined).map(f => [f, req.body[f]])
    );

    // Regra: categoria velas sem personalização
    if (payload.category_id) {
      const { data: cat } = await supabase
        .from('categories').select('slug').eq('id', payload.category_id).single();
      if (cat?.slug === 'velas') {
        payload.allow_customization = false;
        payload.allow_colors = false;
        payload.allow_marble = false;
        payload.allow_metallic = false;
      }
    }

    const { data, error } = await supabase
      .from('products').update(payload).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Produto não encontrado.' });

    // Atualizar cores disponíveis (se enviado)
    if (req.body.available_color_ids !== undefined) {
      await supabase.from('product_available_colors').delete().eq('product_id', req.params.id);
      if (req.body.available_color_ids?.length) {
        const colorRows = req.body.available_color_ids.map(cid => ({
          product_id: req.params.id, color_id: cid
        }));
        await supabase.from('product_available_colors').insert(colorRows);
      }
    }

    res.json({ product: data });
  } catch (err) { next(err); }
});

/* DELETE /api/products/:id (admin — soft delete) */
router.delete('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const { error } = await supabase.from('products').update({ active: false }).eq('id', req.params.id);
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

/* DELETE /api/products/admin/customization-colors/:id (admin) */
router.delete('/admin/customization-colors/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('customization_colors').update({ active: false }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Cor desativada.' });
  } catch (err) { next(err); }
});

module.exports = router;
