/**
 * DECORISA — Seed: catálogo real
 * Execute: node src/config/seed.js
 */
require('dotenv').config();
const bcrypt   = require('bcryptjs');
const supabase = require('./supabase');

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-|-$/g,'');
}
function makeSku(cat, name, idx) {
  const s = name.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,5);
  return `DEC-${cat}-${s}${String(idx).padStart(2,'0')}`;
}
function pix(p){ return +(p*0.95).toFixed(2); }

const ACABAMENTOS = [
  { label:'Liso',           value:'liso',           hex:'#C4BEB6', sort_order:1 },
  { label:'Colorido',       value:'colorido',       hex:'#E8B4A0', sort_order:2 },
  { label:'Marmorizado',    value:'marmorizado',    hex:'#D4CEC8', sort_order:3 },
  { label:'Folha dourada',  value:'folha-dourada',  hex:'#C9A84C', sort_order:4 },
  { label:'Folha prateada', value:'folha-prateada', hex:'#C0C0C0', sort_order:5 },
  { label:'Folha rosé',     value:'folha-rose',     hex:'#D4A5A5', sort_order:6 },
];

const CATEGORIES = [
  { slug:'luminarias', name:'Luminárias', description:'Luminárias artesanais em concreto.',                       sort_order:1 },
  { slug:'bandejas',   name:'Bandejas',   description:'Bandejas em concreto para organização e decoração.',       sort_order:2 },
  { slug:'vasos',      name:'Vasos',      description:'Vasos artesanais em concreto para flores e plantas.',      sort_order:3 },
  { slug:'decoracao',  name:'Decoração',  description:'Peças decorativas artesanais em concreto.',                sort_order:4 },
  { slug:'boleiras',   name:'Boleiras',   description:'Boleiras em concreto para confeitaria e decoração.',       sort_order:5 },
];

function buildProducts(catMap) {
  const M='Concreto artesanal', F='Personalizável', D7=7, ST=999;
  return [
    // LUMINÁRIAS
    { sku:makeSku('LUM','ATHENIS',1), name:'Luminária Athenis', slug:slugify('Luminaria Athenis'), category_id:catMap['luminarias'], price:80.00,  price_pix:pix(80),  description:'Luminária artesanal em concreto com design contemporâneo. Cada peça é única, produzida à mão com acabamento personalizável.',  material:M, finish:F,                      production_days:D7, stock:ST, badge:null,           featured:true,  active:true },
    { sku:makeSku('LUM','ATLAS',2),   name:'Luminária Atlas',   slug:slugify('Luminaria Atlas'),   category_id:catMap['luminarias'], price:155.00, price_pix:pix(155), description:'Luminária Atlas com folha de ouro inclusa. Design sofisticado e acabamento premium artesanal em concreto.',                    material:M, finish:'Folha de ouro inclusa', production_days:D7, stock:ST, badge:'Folha de ouro', featured:true,  active:true },
    { sku:makeSku('LUM','AXIS',3),    name:'Luminária Axis',    slug:slugify('Luminaria Axis'),    category_id:catMap['luminarias'], price:130.00, price_pix:pix(130), description:'Luminária Axis em concreto artesanal. Silhueta limpa e moderna, perfeita para ambientes minimalistas.',                           material:M, finish:F,                      production_days:D7, stock:ST, badge:null,           featured:false, active:true },
    { sku:makeSku('LUM','ARENA',4),   name:'Luminária Arena',   slug:slugify('Luminaria Arena'),   category_id:catMap['luminarias'], price:115.00, price_pix:pix(115), description:'Luminária Arena com folha de ouro inclusa. Detalhes dourados que elevam qualquer ambiente.',                                        material:M, finish:'Folha de ouro inclusa', production_days:D7, stock:ST, badge:'Folha de ouro', featured:false, active:true },
    // BANDEJAS
    { sku:makeSku('BAN','FLORA',1),    name:'Bandeja Flora',       slug:slugify('Bandeja Flora'),       category_id:catMap['bandejas'], price:35.00, price_pix:pix(35), description:'Bandeja Flora em concreto artesanal. Formato redondo, 13 cm de diâmetro.',             material:M, dimensions:'13 cm diâmetro',                    finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','AMORE',2),    name:'Bandeja Amore',       slug:slugify('Bandeja Amore'),       category_id:catMap['bandejas'], price:35.00, price_pix:pix(35), description:'Bandeja Amore em concreto artesanal. Formato quadrado 13 x 13 cm.',                   material:M, dimensions:'13 x 13 cm',                          finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','FIORE',3),    name:'Bandeja Fiore',       slug:slugify('Bandeja Fiore'),       category_id:catMap['bandejas'], price:35.00, price_pix:pix(35), description:'Bandeja Fiore em concreto artesanal. Formato redondo, 12 cm de diâmetro.',             material:M, dimensions:'12 cm diâmetro',                    finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','PEROLA',4),   name:'Bandeja Pérola',      slug:slugify('Bandeja Perola'),      category_id:catMap['bandejas'], price:30.00, price_pix:pix(30), description:'Bandeja Pérola em concreto artesanal. Formato quadrado compacto 11 x 11 cm.',         material:M, dimensions:'11 x 11 cm',                          finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','BLOOM',5),    name:'Bandeja Bloom',       slug:slugify('Bandeja Bloom'),       category_id:catMap['bandejas'], price:50.00, price_pix:pix(50), description:'Bandeja Bloom em concreto artesanal. 13 cm de diâmetro e 5 cm de profundidade.',       material:M, dimensions:'13 cm diâmetro x 5 cm profundidade', finish:F, production_days:D7, stock:ST, badge:null, featured:true,  active:true },
    { sku:makeSku('BAN','LVMINI',6),   name:'Bandeja Lívia Mini',  slug:slugify('Bandeja Livia Mini'),  category_id:catMap['bandejas'], price:25.00, price_pix:pix(25), description:'Bandeja Lívia Mini em concreto artesanal. Formato redondo compacto, 10 cm de diâmetro.',material:M, dimensions:'10 cm diâmetro',                    finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','ARIAP',7),    name:'Bandeja Ária P',      slug:slugify('Bandeja Aria P'),      category_id:catMap['bandejas'], price:35.00, price_pix:pix(35), description:'Bandeja Ária P em concreto artesanal. 17,5 x 9 cm.',                                  material:M, dimensions:'17,5 x 9 cm',                         finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','ARIAM',8),    name:'Bandeja Ária M',      slug:slugify('Bandeja Aria M'),      category_id:catMap['bandejas'], price:45.00, price_pix:pix(45), description:'Bandeja Ária M em concreto artesanal. 24 x 10 cm.',                                   material:M, dimensions:'24 x 10 cm',                          finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','KAIA',9),     name:'Bandeja Kaia',        slug:slugify('Bandeja Kaia'),        category_id:catMap['bandejas'], price:40.00, price_pix:pix(40), description:'Bandeja Kaia em concreto artesanal. 19 x 11,5 cm.',                                   material:M, dimensions:'19 x 11,5 cm',                        finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','RAVENA',10),  name:'Bandeja Ravena',      slug:slugify('Bandeja Ravena'),      category_id:catMap['bandejas'], price:40.00, price_pix:pix(40), description:'Bandeja Ravena em concreto artesanal. 17,5 x 10,5 cm.',                               material:M, dimensions:'17,5 x 10,5 cm',                      finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','NOA',11),     name:'Bandeja Noa',         slug:slugify('Bandeja Noa'),         category_id:catMap['bandejas'], price:40.00, price_pix:pix(40), description:'Bandeja Noa em concreto artesanal. 20 x 12,5 cm.',                                    material:M, dimensions:'20 x 12,5 cm',                        finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','EDEN',12),    name:'Bandeja Éden',        slug:slugify('Bandeja Eden'),        category_id:catMap['bandejas'], price:35.00, price_pix:pix(35), description:'Bandeja Éden em concreto artesanal. 15 x 18 cm.',                                     material:M, dimensions:'15 x 18 cm',                          finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','ARCO',13),    name:'Bandeja Arco',        slug:slugify('Bandeja Arco'),        category_id:catMap['bandejas'], price:40.00, price_pix:pix(40), description:'Bandeja Arco em concreto artesanal. 19,5 x 11 cm.',                                   material:M, dimensions:'19,5 x 11 cm',                        finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','BRISA',14),   name:'Bandeja Brisa',       slug:slugify('Bandeja Brisa'),       category_id:catMap['bandejas'], price:45.00, price_pix:pix(45), description:'Bandeja Brisa em concreto artesanal. 25 x 12 cm.',                                    material:M, dimensions:'25 x 12 cm',                          finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','DOLCE',15),   name:'Bandeja Dolce',       slug:slugify('Bandeja Dolce'),       category_id:catMap['bandejas'], price:65.00, price_pix:pix(65), description:'Bandeja Dolce em concreto artesanal. 28 x 17 cm.',                                    material:M, dimensions:'28 x 17 cm',                          finish:F, production_days:D7, stock:ST, badge:null, featured:true,  active:true },
    { sku:makeSku('BAN','SELENE',16),  name:'Bandeja Selene',      slug:slugify('Bandeja Selene'),      category_id:catMap['bandejas'], price:70.00, price_pix:pix(70), description:'Bandeja Selene em concreto artesanal. 29 x 11 cm.',                                   material:M, dimensions:'29 x 11 cm',                          finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','LVIVM',17),   name:'Bandeja Lívia M',     slug:slugify('Bandeja Livia M'),     category_id:catMap['bandejas'], price:70.00, price_pix:pix(70), description:'Bandeja Lívia M em concreto artesanal. Formato redondo, 24 cm de diâmetro.',           material:M, dimensions:'24 cm diâmetro',                    finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('BAN','LVIVG',18),   name:'Bandeja Lívia G',     slug:slugify('Bandeja Livia G'),     category_id:catMap['bandejas'], price:85.00, price_pix:pix(85), description:'Bandeja Lívia G em concreto artesanal. Formato redondo, 29 cm de diâmetro.',           material:M, dimensions:'29 cm diâmetro',                    finish:F, production_days:D7, stock:ST, badge:null, featured:true,  active:true },
    // VASOS
    { sku:makeSku('VAS','KAIA',1),  name:'Vaso Kaia',  slug:slugify('Vaso Kaia'),  category_id:catMap['vasos'], price:45.00, price_pix:pix(45), description:'Vaso Kaia em concreto artesanal. Design contemporâneo e acabamento personalizável.',                        material:M, finish:F, production_days:D7, stock:ST, badge:null, featured:true,  active:true },
    { sku:makeSku('VAS','CLOE',2),  name:'Vaso Cloe',  slug:slugify('Vaso Cloe'),  category_id:catMap['vasos'], price:60.00, price_pix:pix(60), description:'Vaso Cloe em concreto artesanal. Elegância e personalidade para o seu espaço.',                            material:M, finish:F, production_days:D7, stock:ST, badge:null, featured:true,  active:true },
    { sku:makeSku('VAS','DOMUS',3), name:'Vaso Domus', slug:slugify('Vaso Domus'), category_id:catMap['vasos'], price:38.00, price_pix:pix(38), description:'Vaso Domus em concreto artesanal. Peça versátil para diferentes ambientes.',                               material:M, finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('VAS','DUNA',4),  name:'Vaso Duna',  slug:slugify('Vaso Duna'),  category_id:catMap['vasos'], price:40.00, price_pix:pix(40), description:'Vaso Duna em concreto artesanal. Inspirado nas formas orgânicas das dunas.',                              material:M, finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('VAS','LUME',5),  name:'Vaso Lume',  slug:slugify('Vaso Lume'),  category_id:catMap['vasos'], price:35.00, price_pix:pix(35), description:'Vaso Lume em concreto artesanal. Leveza e presença em cada detalhe.',                                     material:M, finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('VAS','LOVIE',6), name:'Vaso Lovie', slug:slugify('Vaso Lovie'), category_id:catMap['vasos'], price:35.00, price_pix:pix(35), description:'Vaso Lovie em concreto artesanal. Design delicado com acabamento refinado.',                               material:M, finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('VAS','AURA',7),  name:'Vaso Aura',  slug:slugify('Vaso Aura'),  category_id:catMap['vasos'], price:45.00, price_pix:pix(45), description:'Vaso Aura em concreto artesanal. Aura de sofisticação para transformar espaços.',                         material:M, finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('VAS','ALBA',8),  name:'Vaso Alba',  slug:slugify('Vaso Alba'),  category_id:catMap['vasos'], price:40.00, price_pix:pix(40), description:'Vaso Alba em concreto artesanal. Beleza minimalista em cada peça produzida à mão.',                       material:M, finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    // DECORAÇÃO
    { sku:makeSku('DEC','MARIS',1),   name:'Concha Maris',           slug:slugify('Concha Maris'),           category_id:catMap['decoracao'], price:30.00, price_pix:pix(30), description:'Concha Maris em concreto artesanal. Peça decorativa inspirada nas formas do mar.',                                                                    material:M, finish:F, production_days:D7, stock:ST, badge:null,          featured:false, active:true },
    { sku:makeSku('DEC','BRINC',2),   name:'Incensário Brisa',       slug:slugify('Incensario Brisa'),       category_id:catMap['decoracao'], price:25.00, price_pix:pix(25), description:'Incensário Brisa em concreto artesanal. Funcional e decorativo para o seu ambiente.',                                                                   material:M, finish:F, production_days:D7, stock:ST, badge:null,          featured:false, active:true },
    { sku:makeSku('DEC','DOLCC',3),   name:'Compoteira Dolce',       slug:slugify('Compoteira Dolce'),       category_id:catMap['decoracao'], price:45.00, price_pix:pix(45), description:'Compoteira Dolce em concreto artesanal. Elegância funcional para mesa e decoração.',                                                                    material:M, finish:F, production_days:D7, stock:ST, badge:null,          featured:true,  active:true },
    { sku:makeSku('DEC','BIAPC',4),   name:'Porta-copos Bia',        slug:slugify('Porta-copos Bia'),        category_id:catMap['decoracao'], price:45.00, price_pix:pix(45), description:'Porta-copos Bia em concreto artesanal. Conjunto com 4 unidades para a sua mesa.',                                                                       material:M, finish:F, production_days:D7, stock:ST, badge:'Kit 4 un.',  featured:false, active:true },
    { sku:makeSku('DEC','VELOR',5),   name:'Pendurador Velora',      slug:slugify('Pendurador Velora'),      category_id:catMap['decoracao'], price:30.00, price_pix:pix(30), description:'Pendurador Velora em concreto artesanal. Disponível em kits de 1 a 5 unidades com preços progressivos: 1 un. R$30 · 2 un. R$56 · 3 un. R$78 · 4 un. R$96 · 5 un. R$110.', material:M, finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    { sku:makeSku('DEC','MARL',6),    name:'Peso Decorativo Mareli', slug:slugify('Peso Decorativo Mareli'), category_id:catMap['decoracao'], price:40.00, price_pix:pix(40), description:'Peso Decorativo Mareli em concreto artesanal. Peso ~1,1 kg. Kits: 1 un. R$40 · 2 un. R$70 · 3 un. R$90 · 4 un. R$100.',                              material:M, weight:'1,1 kg', finish:F, production_days:D7, stock:ST, badge:null, featured:false, active:true },
    // BOLEIRAS
    { sku:makeSku('BOL','SOFTM',1), name:'Boleira Soft M', slug:slugify('Boleira Soft M'), category_id:catMap['boleiras'], price:120.00, price_pix:pix(120), description:'Boleira Soft M em concreto artesanal. Base 24 cm, altura 13 cm. Ideal para bolos de até 20 cm.', material:M, dimensions:'Base 24 cm · Altura 13 cm', finish:F, production_days:D7, stock:ST, badge:null, featured:true,  active:true },
    { sku:makeSku('BOL','SOFTG',2), name:'Boleira Soft G', slug:slugify('Boleira Soft G'), category_id:catMap['boleiras'], price:160.00, price_pix:pix(160), description:'Boleira Soft G em concreto artesanal. Diâmetro 29 cm, altura 15,5 cm. Para bolos grandes e apresentações especiais.', material:M, dimensions:'Diâmetro 29 cm · Altura 15,5 cm', finish:F, production_days:D7, stock:ST, badge:null, featured:true, active:true },
  ];
}

const QTY_VARIANTS = {
  'pendurador-velora':      [{ label:'1 unidade',value:'1',price_delta:0},{ label:'2 unidades',value:'2',price_delta:26},{ label:'3 unidades',value:'3',price_delta:48},{ label:'4 unidades',value:'4',price_delta:66},{ label:'5 unidades',value:'5',price_delta:80}],
  'peso-decorativo-mareli': [{ label:'1 unidade',value:'1',price_delta:0},{ label:'2 unidades',value:'2',price_delta:30},{ label:'3 unidades',value:'3',price_delta:50},{ label:'4 unidades',value:'4',price_delta:60}],
};

async function seed() {
  console.log('🌱  Seed Decorisa Studio\n');

  // Categorias
  const { error:cE } = await supabase.from('categories').upsert(CATEGORIES,{onConflict:'slug'});
  if (cE) { console.error('Categorias:',cE.message); return; }
  const { data:cats } = await supabase.from('categories').select('id,slug');
  const catMap = Object.fromEntries(cats.map(c=>[c.slug,c.id]));
  console.log(`✅  ${cats.length} categorias`);

  // Produtos
  const produtos = buildProducts(catMap);
  const { error:pE } = await supabase.from('products').upsert(produtos,{onConflict:'sku'});
  if (pE) { console.error('Produtos:',pE.message); return; }
  const { data:dbProds } = await supabase.from('products').select('id,slug,name');
  const prodMap = Object.fromEntries(dbProds.map(p=>[p.slug,p.id]));
  console.log(`✅  ${dbProds.length} produtos`);

  // Variantes de acabamento (lotes de 100)
  const acabVars = [];
  for (const prod of dbProds) {
    for (const ac of ACABAMENTOS) {
      acabVars.push({ product_id:prod.id, type:'finish', label:ac.label, value:ac.value, hex:ac.hex, price_delta:0, sort_order:ac.sort_order });
    }
  }
  for (let i=0;i<acabVars.length;i+=100) {
    await supabase.from('product_variants').upsert(acabVars.slice(i,i+100),{onConflict:'product_id,type,value'}).catch(async ()=>{
      await supabase.from('product_variants').insert(acabVars.slice(i,i+100)).catch(()=>{});
    });
  }
  console.log(`✅  ${acabVars.length} variantes de acabamento`);

  // Variantes de quantidade (kits)
  for (const [slugKey, variants] of Object.entries(QTY_VARIANTS)) {
    const pid = prodMap[slugKey];
    if (!pid) continue;
    await supabase.from('product_variants').delete().eq('product_id',pid).eq('type','quantity');
    await supabase.from('product_variants').insert(variants.map((v,i)=>({ product_id:pid, type:'quantity', label:v.label, value:v.value, price_delta:v.price_delta, sort_order:i+1 })));
    console.log(`✅  Variantes qtd: ${slugKey}`);
  }

  // Placeholders de imagem
  let imgCount = 0;
  for (const prod of dbProds) {
    const { data:ex } = await supabase.from('product_images').select('id').eq('product_id',prod.id).limit(1);
    if (!ex?.length) {
      await supabase.from('product_images').insert({ product_id:prod.id, url:'/assets/images/placeholder.jpg', alt:prod.name, sort_order:0, is_cover:true });
      imgCount++;
    }
  }
  console.log(`✅  ${imgCount} placeholders de imagem`);

  // Cupons
  await supabase.from('coupons').upsert([
    { code:'DECORISA10',  type:'percent', value:10, min_order:0,   active:true },
    { code:'DECORISA15',  type:'percent', value:15, min_order:100, active:true },
    { code:'BEMVINDO',    type:'percent', value:5,  min_order:0,   active:true },
    { code:'FRETEGRATIS', type:'fixed',   value:25, min_order:150, active:true },
  ],{onConflict:'code'});
  console.log('✅  4 cupons');

  // Banners
  await supabase.from('banners').upsert([
    { position:'hero', eyebrow:'Coleção 2025', title:'Design que respira presença.', subtitle:'Objetos artesanais em concreto. Cada peça é única, produzida com cuidado e intenção.', cta_label:'Explorar Coleção', cta_url:'/pages/loja.html', active:true, sort_order:1 },
    { position:'cta_banner', title:'Sua peça, do seu jeito.', subtitle:'Acabamentos personalizáveis: liso, colorido, marmorizado ou folha dourada/prateada/rosé.', cta_label:'Solicitar personalização', cta_url:'https://wa.me/5511999999999', active:true, sort_order:1 },
  ],{onConflict:'position'});
  console.log('✅  2 banners');

  // Admin
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD||'admin123',12);
  await supabase.from('users').upsert([{ name:'Admin Decorisa', email:process.env.ADMIN_EMAIL||'admin@decorisa.com.br', password:hash, role:'admin' }],{onConflict:'email'});
  console.log('✅  Admin\n');

  // Resumo
  const byCat = {};
  produtos.forEach(p=>{ const s=Object.keys(catMap).find(k=>catMap[k]===p.category_id)||'?'; byCat[s]=(byCat[s]||0)+1; });
  console.log('═'.repeat(45));
  console.log('🎉  Seed concluído!');
  console.log(`    Total produtos: ${produtos.length}`);
  Object.entries(byCat).forEach(([cat,n])=>console.log(`    ${cat.padEnd(14)}: ${n}`));
  console.log('═'.repeat(45));
}

seed().catch(console.error);
