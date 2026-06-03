/**
 * DECORISA — Seed: dados iniciais
 * Execute: node src/config/seed.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./supabase');

async function seed() {
  console.log('🌱 Iniciando seed...\n');

  /* === CATEGORIAS === */
  const { error: catErr } = await supabase.from('categories').upsert([
    { slug: 'vasos',         name: 'Vasos',          sort_order: 1 },
    { slug: 'bandejas',      name: 'Bandejas',        sort_order: 2 },
    { slug: 'esferas',       name: 'Esferas',         sort_order: 3 },
    { slug: 'kits',          name: 'Kits',            sort_order: 4 },
    { slug: 'personalizados',name: 'Personalizados',  sort_order: 5 },
  ], { onConflict: 'slug' });
  if (catErr) { console.error('Categorias:', catErr.message); return; }
  console.log('✅ Categorias inseridas');

  /* Busca IDs das categorias */
  const { data: cats } = await supabase.from('categories').select('id,slug');
  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]));

  /* === PRODUTOS === */
  const produtos = [
    {
      sku: 'DEC-VB-012', name: 'Vaso Bruto N.º 12', slug: 'vaso-bruto-12',
      category_id: catMap['vasos'], price: 289.00, price_pix: 260.10,
      description: 'O Vaso Bruto N.º 12 é uma peça de caráter marcante, com textura intencionalmente crua e forma orgânica. Feito em concreto de alta resistência, revela camadas de cuidado artesanal em cada superfície.',
      material: 'Concreto premium', dimensions: '12 × 28 cm', weight: '1,8 kg',
      finish: 'Selado fosco', production_days: 10, stock: 3,
      badge: 'Novo', featured: true, active: true,
    },
    {
      sku: 'DEC-BC-008', name: 'Bandeja Cimento', slug: 'bandeja-cimento',
      category_id: catMap['bandejas'], price: 189.00, price_pix: 170.10,
      description: 'Bandeja oval em cimento artesanal, com borda elevada e fundo texturizado. Ideal para aparadores, mesas de centro ou bancadas.',
      material: 'Cimento pigmentado', dimensions: '30 × 18 × 4 cm', weight: '1,2 kg',
      finish: 'Cera natural', production_days: 7, stock: 8,
      badge: null, featured: true, active: true,
    },
    {
      sku: 'DEC-ED-003', name: 'Esfera Duo', slug: 'esfera-duo',
      category_id: catMap['esferas'], price: 349.00, price_pix: 314.10,
      description: 'Conjunto de duas esferas em concreto artesanal com acabamentos distintos — uma em textura natural e outra polida.',
      material: 'Concreto premium', dimensions: '12 cm e 8 cm ∅', weight: '2,1 kg',
      finish: 'Natural + polido', production_days: 10, stock: 5,
      badge: 'Exclusivo', featured: true, active: true,
    },
    {
      sku: 'DEC-KT-001', name: 'Kit Decorisa', slug: 'kit-decorisa',
      category_id: catMap['kits'], price: 590.00, price_pix: 531.00,
      description: 'Kit composto por vaso, bandeja e esfera em concreto artesanal. Perfeito para presentear ou criar uma composição sofisticada.',
      material: 'Concreto premium', dimensions: 'Conjunto 3 peças', weight: '3,8 kg',
      finish: 'Misto', production_days: 14, stock: 4,
      badge: null, featured: true, active: true,
    },
    {
      sku: 'DEC-VS-007', name: 'Vaso Slim', slug: 'vaso-slim',
      category_id: catMap['vasos'], price: 219.00, price_pix: 197.10,
      description: 'Silhueta alongada e elegante. Ideal para hastes delicadas e ramos secos. Forma minimalista que se adapta a qualquer ambiente.',
      material: 'Concreto pigmentado', dimensions: '8 × 35 cm', weight: '1,4 kg',
      finish: 'Selado fosco', production_days: 10, stock: 6,
      badge: null, featured: false, active: true,
    },
    {
      sku: 'DEC-BR-011', name: 'Bandeja Retangular', slug: 'bandeja-retangular',
      category_id: catMap['bandejas'], price: 229.00, price_pix: 206.10,
      description: 'Bandeja retangular de concreto com acabamento em cera natural. Linhas retas e proporções cuidadas para uso em cozinha, banheiro ou sala.',
      material: 'Concreto natural', dimensions: '40 × 20 × 4 cm', weight: '1,8 kg',
      finish: 'Cera natural', production_days: 7, stock: 7,
      badge: null, featured: false, active: true,
    },
    {
      sku: 'DEC-VBW-015', name: 'Vaso Bowl', slug: 'vaso-bowl',
      category_id: catMap['vasos'], price: 259.00, price_pix: 233.10,
      description: 'Vaso de formato bowl, baixo e aberto. Perfeito para suculentas ou arranjos curtos. Textura bruta com borda polida.',
      material: 'Concreto premium', dimensions: '22 × 10 cm', weight: '1,6 kg',
      finish: 'Bruto + borda polida', production_days: 10, stock: 5,
      badge: 'Novo', featured: false, active: true,
    },
    {
      sku: 'DEC-CUSTOM', name: 'Peça Personalizada', slug: 'peca-personalizada',
      category_id: catMap['personalizados'], price: 0, price_pix: 0,
      description: 'Crie sua peça exclusiva. Dimensão, cor, textura e acabamento totalmente personalizados. Entre em contato para desenvolvermos juntos.',
      material: 'Concreto premium', dimensions: 'A definir', weight: 'A definir',
      finish: 'A escolher', production_days: 21, stock: 99,
      badge: 'Sob consulta', featured: false, active: true,
    },
  ];

  const { error: prodErr } = await supabase.from('products').upsert(produtos, { onConflict: 'sku' });
  if (prodErr) { console.error('Produtos:', prodErr.message); return; }
  console.log('✅ Produtos inseridos');

  /* === CUPONS === */
  const { error: cupErr } = await supabase.from('coupons').upsert([
    { code: 'DECORISA10', type: 'percent', value: 10, min_order: 0,   active: true },
    { code: 'DECORISA15', type: 'percent', value: 15, min_order: 300, active: true },
    { code: 'BEMVINDO',   type: 'percent', value:  5, min_order: 0,   active: true },
    { code: 'FRETEGRATIS',type: 'fixed',   value: 25, min_order: 200, active: true },
  ], { onConflict: 'code' });
  if (cupErr) { console.error('Cupons:', cupErr.message); return; }
  console.log('✅ Cupons inseridos');

  /* === BANNERS === */
  const { error: banErr } = await supabase.from('banners').upsert([
    {
      position: 'hero', eyebrow: 'Coleção 2025',
      title: 'Design que respira presença.',
      subtitle: 'Cada peça é concebida com intenção. Concreto, forma e textura — artesanato que transforma espaços.',
      cta_label: 'Explorar Coleção', cta_url: '/loja', active: true, sort_order: 1,
    },
    {
      position: 'cta_banner',
      title: 'Sua peça, do seu jeito.',
      subtitle: 'Produtos personalizados com a sua cor, textura e dimensão.',
      cta_label: 'Solicitar personalização', cta_url: 'https://wa.me/5511999999999',
      active: true, sort_order: 1,
    },
  ], { onConflict: 'position' });
  if (banErr) { console.error('Banners:', banErr.message); return; }
  console.log('✅ Banners inseridos');

  /* === ADMIN === */
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  const { error: admErr } = await supabase.from('users').upsert([
    {
      name: 'Admin Decorisa',
      email: process.env.ADMIN_EMAIL || 'admin@decorisa.com.br',
      password: hash,
      role: 'admin',
    },
  ], { onConflict: 'email' });
  if (admErr) { console.error('Admin:', admErr.message); return; }
  console.log('✅ Admin inserido');

  console.log('\n🎉 Seed concluído com sucesso!');
}

seed().catch(console.error);
