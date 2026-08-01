import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: 1,
    name: 'GLAZING MILK',
    price: '$29.00',
    subtitle: 'The essential prep layer',
    image: '/shop-1.png',
  },
  {
    id: 2,
    name: 'PEPTIDE LIP TREATMENT',
    price: '$16.00',
    subtitle: 'The nourishing lip layer',
    image: '/shop-2.jpg',
    isCenter: true,
  },
  {
    id: 3,
    name: 'PEPTIDE GLAZING FLUID',
    price: '$29.00',
    subtitle: 'The dewy hydration layer',
    image: '/shop-3.jpg',
  },
];

/* ------------------------------------------------------------------ */
/* STROBE / DECELERATING BLINK ACELERADO                              */
/* O retângular branco (card) + imagem piscam e entram juntos rápido!  */
/* ------------------------------------------------------------------ */
const PULSES = [0.035, 0.05, 0.08, 0.12];

function buildStrobe(el) {
  const tl = gsap.timeline();

  tl.set(el, { opacity: 0, visibility: 'visible', scale: 0.95, transition: 'none' });

  PULSES.forEach((dur, i) => {
    const isLast = i === PULSES.length - 1;
    tl.to(el, { opacity: 1, scale: 1.005, duration: dur * 0.45, ease: 'none' })
      .to(el, { opacity: isLast ? 0.3 : 0, duration: dur * 0.55, ease: 'none' });
  });

  tl.to(el, {
    opacity: 1,
    scale: 1,
    duration: 0.18,
    ease: 'power2.out',
    onComplete: () => gsap.set(el, { clearProps: 'transform,transition' }),
  });

  return tl;
}

export default function ShopSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [isAllCardsDone, setIsAllCardsDone] = useState(false);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const heads = gsap.utils.toArray('[data-anim="head"]');
      const cards = gsap.utils.toArray('[data-anim="card"]');
      const texts = gsap.utils.toArray('[data-anim="text"]');

      /* ESTADO INICIAL DE BLOQUEIO DE TUDO */
      gsap.set(heads, { opacity: 0, visibility: 'hidden', y: 10 });
      gsap.set(cards, { opacity: 0, visibility: 'hidden', scale: 0.95, transition: 'none' });
      gsap.set(texts, { opacity: 0, visibility: 'hidden', y: 10 });

      /* HAND-OFF DE TRANSIÇÃO DA SEÇÃO */
      gsap.fromTo(
        containerRef.current,
        { y: 36 },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'top 60%',
            scrub: 0.5,
          },
        }
      );

      const master = gsap.timeline({ paused: true });

      /* FASE 0 — Header do shop entra rápido. */
      master.to(heads, {
        opacity: 1,
        visibility: 'visible',
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
        stagger: 0.08,
      });

      /* FASE 1 — Os retângulos brancos + imagens entram piscando rápido em sequência. */
      cards.forEach((card) => master.add(buildStrobe(card)));

      /* GATILHO — Liberação dos textos. */
      master.call(() => setIsAllCardsDone(true));

      /* FASE 2 — Revelação rápida dos textos em cascata. */
      master.to(texts, {
        opacity: 1,
        visibility: 'visible',
        y: 0,
        duration: 0.35,
        ease: 'power3.out',
        stagger: 0.08,
      });

      ScrollTrigger.create({
        trigger: root,
        start: 'top 82%',
        once: true,
        onEnter: () => master.play(),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="shop"
      ref={sectionRef}
      data-cards-done={isAllCardsDone}
      className="w-full bg-[#f8f8f9] text-slate-900 py-16 sm:py-24 px-4 sm:px-10 select-none overflow-hidden relative border-t border-slate-200/80"
    >
      <div ref={containerRef} className="max-w-7xl mx-auto space-y-12">
        {/* 1. TOP HEADER DA SEÇÃO SHOP */}
        <div className="flex items-center justify-between font-mono text-xs tracking-widest uppercase pb-4 border-b border-slate-200/70">
          <div data-anim="head" className="flex items-center gap-2 text-black font-bold">
            <span className="w-2 h-2 rounded-full bg-pink-400 inline-block animate-pulse" />
            <span className="font-display font-black text-sm tracking-tight">SHOP</span>
            <span className="text-slate-300">//</span>
            <span className="text-pink-400">COLLECTION</span>
          </div>

          <a
            href="#more"
            data-anim="head"
            className="text-black font-bold tracking-widest hover:text-pink-400 transition-colors flex items-center gap-1.5 group"
          >
            <span>MORE</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* 2. GRID DE 3 CARDS COM ENTRADA ACELERADA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-end relative">

          {/* ESTRELA / BRILHO COR DE ROSA DA REFERÊNCIA */}
          <div className="hidden md:block absolute left-[31%] top-[35%] text-pink-400 text-sm z-10 pointer-events-none">
            ✦
          </div>

          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <div className="flex flex-col space-y-4 group cursor-pointer w-full">
      {/* QUADRO BRANCO DO PRODUTO (AGORA O RETÂNGULO PISCA E ENTRA JUNTO COM A IMAGEM) */}
      <div
        data-anim="card"
        className={`bg-white rounded-3xl p-8 sm:p-10 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-500 border border-slate-200/70 ${
          product.isCenter ? 'h-[360px] sm:h-[430px]' : 'h-[320px] sm:h-[370px]'
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain max-h-[75%] group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* BLOCO DE TEXTOS (FASE 2: ENTRA APÓS OS RETÂNGULOS DOS CARDS) */}
      <div className="space-y-1.5 px-1 min-h-[60px]">
        {/* TÍTULO E PREÇO */}
        <div
          data-anim="text"
          className="flex items-baseline justify-between text-slate-900 leading-snug"
        >
          <span className="font-display font-black text-base sm:text-lg text-black tracking-tighter uppercase">
            {product.name}
          </span>
          <span className="font-mono font-black text-base sm:text-lg text-black ml-2">
            {product.price}
          </span>
        </div>

        {/* SUBTÍTULO */}
        <div
          data-anim="text"
          className="font-mono text-xs font-semibold text-slate-500 tracking-wider uppercase"
        >
          {product.subtitle}
        </div>
      </div>
    </div>
  );
}
