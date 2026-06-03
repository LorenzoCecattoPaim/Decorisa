const router  = require('express').Router();
const { body, query, param } = require('express-validator');
const supabase = require('../config/supabase');
const { auth, adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

/* GET /api/products — lista com filtros */
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, search, sort = 'created_at', order = 'desc', page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let q = supabase
      .from('products')
      .select(`
        id, sku, name, slug, price, price_pix, material, stock, badge, featured, active,
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

/* GET /api/products/:slug */
router.get('/:slug', async (req, res, next) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id,slug,name),
        images:product_images(id,url,alt,is_cover,sort_order),
        variants:product_variants(id,type,label,value,hex,sort_order),
        reviews(id,rating,title,body,created_at,user:users(name))
      `)
      .eq('slug', req.params.slug)
      .eq('active', true)
      .single();

    if (error || !product) return res.status(404).json({ error: 'Produto não encontrado.' });

    // Ordena imagens e variantes
    product.images  = (product.images  || []).sort((a,b) => a.sort_order - b.sort_order);
    product.variants = (product.variants || []).sort((a,b) => a.sort_order - b.sort_order);
    product.reviews  = (product.reviews  || []).filter(r => r.approved);

    const avgRating = product.reviews.length
      ? (product.reviews.reduce((s,r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
      : null;

    res.json({ product: { ...product, avg_rating: avgRating } });
  } catch (err) { next(err); }
});

/* ---- ADMIN ---- */

/* POST /api/products (admin) */
router.post('/', auth, adminOnly,
  body('sku').trim().notEmpty(),
  body('name').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  validate,
  async (req, res, next) => {
    try {
      const fields = ['sku','name','slug','category_id','price','price_pix','description',
        'material','dimensions','weight','finish','production_days','stock','badge','featured','active'];
      const payload = Object.fromEntries(fields.filter(f => req.body[f] !== undefined).map(f => [f, req.body[f]]));

      const { data, error } = await supabase.from('products').insert(payload).select().single();
      if (error) throw error;
      res.status(201).json({ product: data });
    } catch (err) { next(err); }
  }
);

/* PUT /api/products/:id (admin) */
router.put('/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const fields = ['name','slug','category_id','price','price_pix','description',
      'material','dimensions','weight','finish','production_days','stock','badge','featured','active'];
    const payload = Object.fromEntries(fields.filter(f => req.body[f] !== undefined).map(f => [f, req.body[f]]));

    const { data, error } = await supabase.from('products').update(payload).eq('id', req.params.id).select().single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Produto não encontrado.' });
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

module.exports = router;
