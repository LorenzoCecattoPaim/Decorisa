'use client'
// src/components/shop/HeroSection.tsx
import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeUp, heroText, imageReveal } from '@/animations/variants'

export default function HeroSection() {
  return (
    <section className="relative h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Left — Text */}
      <div className="flex flex-col justify-center px-10 lg:px-[70px] pt-20 bg-offwhite relative z-10">
        <motion.p
          custom={0}
          variants={heroText}
          initial="hidden"
          animate="visible"
          className="label-eyebrow mb-6"
        >
          Coleção Artesanal 2025
        </motion.p>

        <div className="overflow-hidden mb-3">
          <motion.h1
            custom={1}
            variants={heroText}
            initial="hidden"
            animate="visible"
            className="font-serif text-[clamp(3.2rem,5.5vw,5.5rem)] font-light leading-[0.95] text-ink"
          >
            Design em
            <br />
            <em className="italic text-accent">concreto</em>
            <br />
            que emociona
          </motion.h1>
        </div>

        <motion.p
          custom={2}
          variants={heroText}
          initial="hidden"
          animate="visible"
          className="text-[14px] leading-[1.85] text-warm font-light max-w-[360px] mt-4 mb-10"
        >
          Cada peça é esculpida à mão, unindo a solidez da matéria bruta com linhas de rara delicadeza.
          Objetos que contam histórias.
        </motion.p>

        <motion.div
          custom={3}
          variants={heroText}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-4"
        >
          <Link href="/loja" className="btn-primary">
            Explorar Coleção
          </Link>
          <Link href="/sobre" className="btn-outline">
            Nossa História
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-10 left-[70px] flex items-center gap-3"
        >
          <div className="w-8 h-px bg-cement" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-cement">Role para explorar</span>
        </motion.div>
      </div>

      {/* Right — Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sand via-stone to-cement hidden lg:block">
        <motion.div
          variants={imageReveal}
          initial="hidden"
          animate="visible"
          className="absolute inset-0"
        >
          {/* Placeholder for hero image — replace with next/image in production */}
          <div className="w-full h-full bg-gradient-to-br from-[#C8BFB0] via-[#A09589] to-[#7A6D5E]" />
        </motion.div>

        {/* Overlay label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-10"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-cream/70">
            Vaso Concreto — Coleção Essência
          </p>
        </motion.div>

        {/* Decorative border */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="absolute top-10 right-10 bottom-10 left-10 border border-cream/10 pointer-events-none"
        />
      </div>
    </section>
  )
}
