// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Decorisa database...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@decorisa.com.br' },
    update: {},
    create: { name: 'Admin Decorisa', email: 'admin@decorisa.com.br', password: adminPassword, role: 'ADMIN' },
  })
  console.log('✓ Admin criado:', admin.email)

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'vasos' }, update: {}, create: { name: 'Vasos', slug: 'vasos', description: 'Vasos artesanais em concreto', order: 1 } }),
    prisma.category.upsert({ where: { slug: 'bandejas' }, update: {}, create: { name: 'Bandejas', slug: 'bandejas', description: 'Bandejas decorativas em concreto', order: 2 } }),
    prisma.category.upsert({ where: { slug: 'cachepots' }, update: {}, create: { name: 'Cachepôs', slug: 'cachepots', description: 'Cachepôs artesanais em concreto', order: 3 } }),
    prisma.category.upsert({ where: { slug: 'kits' }, update: {}, create: { name: 'Kits', slug: 'kits', description: 'Kits decorativos exclusivos', order: 4 } }),
  ])
  console.log('✓ Categorias criadas:', categories.length)

  // Products
  const products = [
    {
      name: 'Vaso Essência',
      slug: 'vaso-essencia',
      description: 'Modelado à mão com concreto de formulação exclusiva, o Vaso Essência une a solidez da matéria bruta com linhas de rara delicadeza. Cada exemplar carrega marcas únicas do processo artesanal, tornando-o irrepetível.',
      shortDesc: 'Concreto artesanal · Acabamento fosco',
      price: 285,
      comparePrice: null,
      stock: 8,
      featured: true,
      productionDays: 10,
      weight: 1.4,
      dimensions: { width: 12, height: 22 },
      materials: ['Concreto artesanal'],
      finishes: ['Fosco selado'],
      categorySlug: 'vasos',
    },
    {
      name: 'Bandeja Bruta',
      slug: 'bandeja-bruta',
      description: 'A Bandeja Bruta exibe a beleza crua do concreto pigmentado. Superfície com textura natural preservada, bordas levemente irregulares que reafirmam o processo artesanal.',
      shortDesc: 'Concreto pigmentado · Textura natural',
      price: 195,
      comparePrice: 240,
      stock: 12,
      featured: true,
      productionDays: 7,
      weight: 0.9,
      dimensions: { width: 30, height: 4 },
      materials: ['Concreto pigmentado'],
      finishes: ['Natural'],
      categorySlug: 'bandejas',
    },
    {
      name: 'Cuia Mineral',
      slug: 'cuia-mineral',
      description: 'Forma orgânica e acabamento acetinado que suaviza a dureza do concreto. A Cuia Mineral é perfeita para compor arranjos e decorações contemporâneas.',
      shortDesc: 'Concreto artesanal · Acabamento acetinado',
      price: 240,
      comparePrice: null,
      stock: 6,
      featured: true,
      productionDays: 10,
      weight: 0.7,
      dimensions: { width: 18, height: 8 },
      materials: ['Concreto artesanal'],
      finishes: ['Acetinado'],
      categorySlug: 'cachepots',
    },
    {
      name: 'Cachepô Bruto',
      slug: 'cachepot-bruto',
      description: 'Edição limitada. Linhas retas, proporções equilibradas e a textura inconfundível do concreto moldado à mão. O Cachepô Bruto transforma qualquer planta em escultura.',
      shortDesc: 'Concreto moldado · Edição limitada',
      price: 320,
      comparePrice: null,
      stock: 4,
      featured: true,
      productionDays: 12,
      weight: 1.8,
      dimensions: { width: 14, height: 16 },
      materials: ['Concreto artesanal'],
      finishes: ['Bruto natural'],
      categorySlug: 'cachepots',
    },
    {
      name: 'Kit Duo Essência',
      slug: 'kit-duo-essencia',
      description: 'Dois vasos da coleção Essência em tamanhos complementares. Composição harmoniosa para criar ambientes com profundidade e sofisticação.',
      shortDesc: '2 peças · Coleção coordenada',
      price: 490,
      comparePrice: 570,
      stock: 5,
      featured: false,
      productionDays: 12,
      weight: 2.6,
      dimensions: { width: 20, height: 25 },
      materials: ['Concreto artesanal'],
      finishes: ['Fosco selado'],
      categorySlug: 'kits',
    },
    {
      name: 'Bandeja Minimalista',
      slug: 'bandeja-minimalista',
      description: 'Proporções generosas com borda finíssima. A Bandeja Minimalista é a peça que unifica qualquer composição decorativa com elegância discreta.',
      shortDesc: 'Concreto puro · Borda fina',
      price: 175,
      comparePrice: null,
      stock: 10,
      featured: false,
      productionDays: 7,
      weight: 0.8,
      dimensions: { width: 28, height: 3 },
      materials: ['Concreto puro'],
      finishes: ['Fosco natural'],
      categorySlug: 'bandejas',
    },
  ]

  for (const p of products) {
    const cat = categories.find((c) => c.slug === p.categorySlug)!
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name, slug: p.slug, description: p.description, shortDesc: p.shortDesc,
        price: p.price, comparePrice: p.comparePrice, stock: p.stock, featured: p.featured,
        productionDays: p.productionDays, weight: p.weight, dimensions: p.dimensions as any,
        materials: p.materials, finishes: p.finishes, categoryId: cat.id, active: true,
      },
    })
  }
  console.log('✓ Produtos criados:', products.length)

  // Coupon
  await prisma.coupon.upsert({
    where: { code: 'BEMVINDO10' },
    update: {},
    create: { code: 'BEMVINDO10', description: '10% de desconto na primeira compra', type: 'PERCENTAGE', value: 10, active: true },
  })
  console.log('✓ Cupom BEMVINDO10 criado')

  // Shipping zones
  await prisma.shippingZone.upsert({
    where: { id: 'zone-rs' },
    update: {},
    create: { id: 'zone-rs', name: 'Rio Grande do Sul', states: ['RS'], price: 25, freeFrom: 400, days: 3 },
  })
  await prisma.shippingZone.upsert({
    where: { id: 'zone-sul' },
    update: {},
    create: { id: 'zone-sul', name: 'Região Sul', states: ['SC', 'PR'], price: 30, freeFrom: 500, days: 5 },
  })
  await prisma.shippingZone.upsert({
    where: { id: 'zone-brasil' },
    update: {},
    create: { id: 'zone-brasil', name: 'Demais estados', states: [], price: 45, freeFrom: 600, days: 10 },
  })
  console.log('✓ Zonas de frete criadas')

  console.log('✅ Seed concluído com sucesso!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
