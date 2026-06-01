'use client'
// src/components/shop/AboutBand.tsx
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { fadeUp, slideRight, slideLeft } from '@/animations/variants'

export default function AboutBand() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section ref={ref} className="section-pad bg-offwhite grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      {/* Image Stack */}
      <motion.div
        variants={slideRight}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="relative h-[480px] hidden lg:block"
      >
        <div className="absolute right-0 top-0 w-[68%] h-[80%] bg-gradient-to-br from-stone to-cement" />
        <div className="absolute left-0 bottom-0 w-[48%] h-[55%] bg-gradient-to-br from-sand to-stone border-8 border-offwhite" />
      </motion.div>

      {/* Text */}
      <motion.div
        variants={slideLeft}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="py-5"
      >
        <p className="label-eyebrow mb-5">Sobre a Decorisa</p>
        <blockquote className="font-serif text-[clamp(1.6rem,2.5vw,2.4rem)] font-light italic leading-[1.35] text-ink mb-7">
          "Fazemos objetos que habitam espaços e habitam almas."
        </blockquote>
        <p className="text-[14px] leading-[1.9] text-warm font-light mb-10">
          A Decorisa nasceu da crença de que os objetos que escolhemos para o nosso espaço revelam quem somos.
          Cada peça é produzida sob demanda, com processo artesanal e materiais criteriosamente selecionados.
          Nada aqui é fabricado em série — cada item começa a existir a partir do seu pedido.
        </p>
        <Link href="/sobre" className="btn-primary">
          Conheça Nossa História
        </Link>

        <div className="flex gap-12 mt-12 pt-10 border-t border-sand">
          {[
            { num: '800+', label: 'Peças criadas' },
            { num: '100%', label: 'Artesanal' },
            { num: '5★', label: 'Avaliação média' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-[2.2rem] font-light text-ink">{stat.num}</div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-cement mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
