import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  {
    id: 1,
    title: 'HYDRATION MATRIX',
    subtitle: 'LIP INFUSION NO. 01',
    src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop',
    tag: 'FORMULA ✦ 98%',
  },
  {
    id: 2,
    title: 'PEPTIDE GLOSS',
    subtitle: 'BIOMETRIC GLOW',
    src: '/shop-2.jpg',
    tag: 'ULTRA SHINE',
    isCenter: true,
  },
  {
    id: 3,
    title: 'VEGAN MILK PREP',
    subtitle: 'BARRIER REPAIR',
    src: '/shop-1.png',
    tag: 'DEWY FINISH',
  },
  {
    id: 4,
    title: 'PURE CERAMIDES',
    subtitle: 'ESSENTIAL LIP LAYER',
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    tag: 'CALIFORNIA LAB',
  },
];

export default function GallerySection() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const titleRef = useRef(null);
  const marqRef = useRef(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('[data-anim="gallery-card"]');
      const marquee = marqRef.current;

      /* SCROLLTIMELINE PINNADA — ANIMAÇÃO DE SCROLL MANTIDA 100% INTACTA */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      /* 1. MARQUEE GIGANTE DESLIZA AO FUNDO */
      tl.to(marquee, {
        xPercent: -40,
        ease: 'none',
        duration: 3,
      }, 0);

      /* 2. EXPANSAO DOS CARDS DE FOTO EM PERSPECTIVA 3D */
      cards.forEach((card, index) => {
        const isCenter = card.getAttribute('data-center') === 'true';

        if (isCenter) {
          tl.fromTo(
            card,
            { scale: 0.75, borderRadius: '40px' },
            { scale: 1.12, borderRadius: '20px', ease: 'power2.inOut', duration: 3 },
            0
          );
        } else {
          const dirX = index % 2 === 0 ? -180 : 180;
          const dirY = index > 1 ? -120 : 120;
          const rotZ = index % 2 === 0 ? -20 : 20;

          tl.fromTo(
            card,
            { xPercent: 0, yPercent: 0, rotate: 0, opacity: 0.5, scale: 0.7 },
            {
              xPercent: dirX,
              yPercent: dirY,
              rotate: rotZ,
              opacity: 1,
              scale: 1,
              ease: 'power3.out',
              duration: 3,
            },
            0
          );
        }
      });

      /* 3. REVELAÇÃO DO TÍTULO */
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 1 },
        1.8
      );

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="w-full bg-[#f8f8f9] text-slate-900 select-none relative overflow-hidden border-t border-slate-200/80"
    >
      {/* WRAPPER PINNADO DE SCROLL */}
      <div ref={triggerRef} className="w-full h-screen relative flex items-center justify-center overflow-hidden">
        
        {/* TEXTO MARQUEE EM CINZA CLARO SUAVE AO FUNDO */}
        <div
          ref={marqRef}
          className="absolute font-display font-black text-[18vw] leading-none whitespace-nowrap text-slate-200/80 tracking-tighter uppercase pointer-events-none select-none z-0"
        >
          BIOMETRIC GLOW ✦ HIGH PERFORMANCE ✦ VISUAL EXPERIMENTAL ✦ LUCID LABS ✦
        </div>

        {/* TÍTULO FLUTUANTE (SEM O BADGE SCROLL EXPERIENCE) */}
        <div
          ref={titleRef}
          className="absolute top-10 sm:top-14 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none"
        >
          <h2 className="font-display font-black text-2xl sm:text-4xl text-black tracking-tight uppercase">
            VISUAL ATMOSPHERE
          </h2>
        </div>

        {/* CONTAINER DOS CARDS COM FUNDO BRANCO E SOMBRA NATURAL ESTÚDIO */}
        <div className="relative w-full max-w-5xl h-[60vh] sm:h-[70vh] flex items-center justify-center z-10 px-4">
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.id}
              data-anim="gallery-card"
              data-center={img.isCenter ? 'true' : 'false'}
              className={`absolute rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)] cursor-pointer group ${
                img.isCenter
                  ? 'w-[75vw] sm:w-[500px] h-[50vh] sm:h-[58vh] z-20 shadow-[0_25px_60px_rgba(0,0,0,0.12)]'
                  : 'w-[50vw] sm:w-[320px] h-[35vh] sm:h-[40vh] z-10'
              }`}
            >
              {/* IMAGEM COM ZOOM SUAVE NO HOVER */}
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* OVERLAY EDITORIAL CLEAN */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-6 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="font-mono text-[10px] font-bold text-pink-300 tracking-widest uppercase mb-1">
                  {img.tag}
                </span>
                <h3 className="font-display font-black text-lg sm:text-2xl text-white tracking-tighter uppercase leading-none">
                  {img.title}
                </h3>
                <p className="font-mono text-[11px] text-slate-300 uppercase tracking-wider mt-1">
                  {img.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* NAVEGAÇÃO DE RODAPÉ */}
        <div className="absolute bottom-8 left-8 right-8 z-30 flex justify-between items-center font-mono text-[11px] text-slate-400 uppercase tracking-widest pointer-events-none">
          <div>[ SCROLL TO EXPLORE ]</div>
          <div className="text-black font-bold">LUCID® SHINE LAB</div>
        </div>

      </div>
    </section>
  );
}
