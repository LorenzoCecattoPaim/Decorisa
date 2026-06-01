'use client'
// src/app/sobre/AboutPageClient.tsx
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { fadeUp, slideRight, slideLeft, staggerContainer, staggerItem } from '@/animations/variants'

const values = [
  { icon: '✦', name: 'Autenticidade', desc: 'Cada peça carrega marcas do processo humano de criação. Imperfeições são parte da beleza.' },
  { icon: '◯', name: 'Exclusividade', desc: 'Produzimos sob demanda. Sua peça começa a existir a partir do seu pedido.' },
  { icon: '▲', name: 'Design', desc: 'Cada forma é pensada para durar — esteticamente e fisicamente. Design é permanência.' },
  { icon: '◇', name: 'Cuidado', desc: 'Da mistura ao acabamento, cada etapa recebe atenção total. Não fabricamos, criamos.' },
  { icon: '∞', name: 'Conexão', desc: 'Acreditamos que objetos especiais criam vínculos emocionais entre pessoa e espaço.' },
  { icon: '✿', name: 'Sustentabilidade', desc: 'Produção sob demanda elimina estoques e desperdícios. Fazemos apenas o necessário.' },
]

export default function AboutPageClient() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="section-pad grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={slideRight} initial="hidden" animate={heroInView ? 'visible' : 'hidden'}>
          <p className="label-eyebrow mb-5">Nossa História</p>
          <h1 className="font-serif text-[clamp(2.8rem,5vw,4.5rem)] font-light leading-[1.0] text-ink mb-8">
            Nascemos do <em className="italic text-accent">amor</em><br />pela matéria
          </h1>
          <p className="text-[15px] leading-[1.9] text-warm font-light mb-6">
            A Decorisa surgiu em 2018 da inquietação de uma designer que queria mais do que comprar: queria criar.
            A ideia era simples — transformar concreto em beleza cotidiana.
          </p>
          <p className="text-[15px] leading-[1.9] text-warm font-light mb-6">
            Hoje, cada peça segue sendo produzida artesanalmente, com o mesmo cuidado do primeiro dia.
            Nosso ateliê é pequeno por escolha — porque acreditamos que a escala nunca deve comprometer a essência.
          </p>
          <p className="text-[15px] leading-[1.9] text-warm font-light">
            Quando você recebe uma peça Decorisa, está recebendo horas de trabalho manual, uma formulação
            desenvolvida ao longo de anos, e uma intenção: que esse objeto faça parte da sua história.
          </p>

          <div className="flex gap-12 mt-12 pt-10 border-t border-sand">
            {[
              { num: '2018', label: 'Fundação' },
              { num: '800+', label: 'Peças criadas' },
              { num: '100%', label: 'Artesanal' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-[2.2rem] font-light text-ink">{s.num}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-cement mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={slideLeft} initial="hidden" animate={heroInView ? 'visible' : 'hidden'}>
          <div className="bg-gradient-to-br from-stone to-cement w-full" style={{ aspectRatio: '3/4' }} />
        </motion.div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="section-pad bg-offwhite">
        <motion.div variants={fadeUp} initial="hidden" animate={valuesInView ? 'visible' : 'hidden'} className="mb-14 text-center">
          <p className="label-eyebrow mb-3">Nossos Valores</p>
          <h2 className="section-title">O que <em className="italic text-accent">nos move</em></h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={valuesInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-sand"
        >
          {values.map((v) => (
            <motion.div key={v.name} variants={staggerItem} className="bg-cream px-10 py-12 text-center">
              <div className="font-serif text-[2.5rem] font-light text-accent mb-5">{v.icon}</div>
              <h3 className="font-serif text-[22px] font-light text-ink mb-4">{v.name}</h3>
              <p className="text-[13px] leading-[1.85] text-warm font-light">{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-charcoal text-center">
        <p className="label-eyebrow mb-4" style={{ color: '#9E9589' }}>Pronto para explorar?</p>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light text-cream mb-8">
          Encontre a peça <em className="italic text-stone">que é sua</em>
        </h2>
        <Link href="/loja" className="btn-accent px-12 py-4">
          Explorar Coleção
        </Link>
      </section>
    </div>
  )
}
