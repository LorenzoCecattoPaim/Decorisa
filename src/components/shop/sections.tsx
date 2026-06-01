'use client'
// src/components/shop/ProcessSection.tsx
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { staggerContainer, staggerItem, fadeUp } from '@/animations/variants'

const steps = [
  {
    num: '01',
    name: 'Formulação',
    desc: 'Mistura artesanal de concreto com formulação própria, pigmentos naturais e agregados selecionados criteriosamente.',
  },
  {
    num: '02',
    name: 'Moldagem',
    desc: 'Cada peça é moldada à mão em formas exclusivas. Processo que exige domínio técnico e sensibilidade artística.',
  },
  {
    num: '03',
    name: 'Cura',
    desc: 'Período de cura lenta e controlada que garante a resistência e a textura única de cada peça produzida.',
  },
  {
    num: '04',
    name: 'Acabamento',
    desc: 'Lixamento artesanal e aplicação de selantes premium que realçam a beleza natural do concreto.',
  },
]

export function ProcessSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="section-pad bg-ink text-cream">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="text-center mb-16"
      >
        <p className="text-[10px] tracking-[0.35em] uppercase text-stone mb-4">Processo Artesanal</p>
        <h2 className="font-serif text-[clamp(2.5rem,4vw,4rem)] font-light text-cream leading-[1.05]">
          Da argamassa ao <em className="italic text-stone">objeto</em>
        </h2>
        <p className="text-[13px] text-stone mt-4 tracking-[0.08em]">
          Quatro etapas que transformam matéria bruta em design
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5"
      >
        {steps.map((step) => (
          <motion.div
            key={step.num}
            variants={staggerItem}
            className="bg-ink px-9 py-12 relative"
          >
            <span className="absolute top-5 right-6 font-serif text-[5rem] font-light text-white/5 leading-none select-none">
              {step.num}
            </span>
            <div className="w-10 h-px bg-accent mb-7" />
            <h3 className="font-serif text-[22px] font-light text-cream mb-4">{step.name}</h3>
            <p className="text-[12px] leading-[1.85] text-stone font-light">{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────
const diffs = [
  {
    mark: 'Exclusividade',
    title: 'Cada peça é única no mundo',
    body: 'A variação natural do concreto garante que nenhuma peça seja igual à outra. Você recebe um objeto verdadeiramente singular.',
  },
  {
    mark: 'Artesanal',
    title: 'Produzido sob demanda',
    body: 'Nada é fabricado em massa. Sua peça começa a ser produzida após a sua encomenda, com atenção total aos detalhes.',
  },
  {
    mark: 'Design',
    title: 'Estética contemporânea',
    body: 'Linha visual construída em torno do minimalismo moderno. Objetos que dialogam com qualquer ambiente sofisticado.',
  },
]

export function DifferentialsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="section-pad bg-sand">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mb-14"
      >
        <p className="label-eyebrow mb-3">Por que Decorisa</p>
        <h2 className="section-title">
          O que nos <em className="italic text-accent">torna únicos</em>
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone/30"
      >
        {diffs.map((d) => (
          <motion.div key={d.mark} variants={staggerItem} className="bg-offwhite px-10 py-12">
            <p className="text-[10px] tracking-[0.2em] uppercase text-accent mb-6 font-normal">{d.mark}</p>
            <h3 className="font-serif text-[26px] font-light text-ink mb-4 leading-[1.2]">{d.title}</h3>
            <p className="text-[13px] leading-[1.85] text-warm font-light">{d.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────
const testimonials = [
  {
    quote: 'O vaso chegou embalado com tanto cuidado. A peça em si é de tirar o fôlego — textura incrível, peso certo, perfeita no meu projeto de interiores.',
    author: 'Marina A.',
    role: 'Arquiteta',
    rating: 5,
  },
  {
    quote: 'Presente para minha mãe. Ela não acreditou que era concreto. Parece obra de arte. Acabamento impecável, vale cada centavo.',
    author: 'Felipe R.',
    role: 'Designer',
    rating: 5,
  },
  {
    quote: 'Comprei o kit para o meu escritório. Transformou completamente o ambiente. Sensação de exclusividade que poucos produtos entregam.',
    author: 'Isabela M.',
    role: 'Advogada',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="section-pad bg-cream">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mb-14"
      >
        <p className="label-eyebrow mb-3">Clientes</p>
        <h2 className="section-title">
          O que dizem sobre <em className="italic text-accent">nós</em>
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-3 gap-px bg-sand"
      >
        {testimonials.map((t) => (
          <motion.div key={t.author} variants={staggerItem} className="bg-offwhite px-9 py-11">
            <div className="flex gap-1 mb-5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className="text-accent text-[13px]">★</span>
              ))}
            </div>
            <blockquote className="font-serif text-[18px] font-light italic leading-[1.65] text-ink mb-7">
              "{t.quote}"
            </blockquote>
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal font-normal">{t.author}</p>
              <p className="text-[11px] text-cement mt-0.5">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────
export function NewsletterSection() {
  return (
    <section className="bg-charcoal px-8 lg:px-[60px] py-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
      <div>
        <h2 className="font-serif text-[clamp(2rem,3.5vw,3rem)] font-light text-cream leading-[1.1]">
          Receba lançamentos <em className="italic text-stone">em primeira mão</em>
        </h2>
        <p className="text-[13px] text-stone mt-4 leading-[1.8] font-light">
          Entre para a lista exclusiva e seja o primeiro a conhecer cada nova coleção.
        </p>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col sm:flex-row gap-0"
      >
        <input
          type="email"
          placeholder="seu@email.com"
          className="flex-1 px-6 py-4 bg-transparent border border-white/20 text-cream placeholder-stone/60 font-light text-[13px] outline-none focus:border-stone transition-colors"
          required
        />
        <button
          type="submit"
          className="px-8 py-4 bg-accent hover:bg-warm text-cream text-[11px] tracking-[0.2em] uppercase font-sans transition-colors duration-300 whitespace-nowrap"
        >
          Inscrever
        </button>
      </form>
    </section>
  )
}
