import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const titleLines = gsap.utils.toArray('[data-anim="about-text"]');

      /* REVELAÇÃO SUAVE NO SCROLL */
      titleLines.forEach((line) => {
        gsap.fromTo(
          line,
          { opacity: 0.2, y: 25 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: line,
              start: 'top 88%',
              end: 'top 45%',
              scrub: 0.6,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full bg-[#fcfcfd] text-slate-900 py-20 sm:py-28 px-6 sm:px-12 md:px-16 select-none overflow-hidden relative border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 1. TAG SUPERIOR ESQUERDA */}
        <div className="lg:col-span-3 pt-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-pink-400 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-pink-400 inline-block animate-pulse" />
            <span>SOBRE A MARCA</span>
          </div>
        </div>

        {/* 2. CONTEÚDO PRINCIPAL (FONTE LEVE FONT-MEDIUM E HIERARQUIA ANTERIOR DOS VÍDEOS) */}
        <div className="lg:col-span-9 space-y-10">

          {/* MANIFESTO EDITORIAL: FONTE LEVE (FONT-MEDIUM) E HIERARQUIA DOS VÍDEOS REVERTIDA */}
          <div className="font-display font-medium text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-snug tracking-tight uppercase text-slate-900">
            <p data-anim="about-text" className="space-x-1.5">
              <span>A LUCID É UMA MARCA</span>{' '}
              {/* VÍDEO CÁPSULA 1 (POSIÇÃO ANTERIOR) */}
              <span className="inline-block w-20 sm:w-28 h-10 sm:h-14 rounded-2xl overflow-hidden align-middle border border-slate-200 shadow-sm mx-1">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="https://res.cloudinary.com/dwmrunhxa/video/upload/v1785264358/0727_2_vznkz2.mp4" type="video/mp4" />
                </video>
              </span>{' '}
              <span>DE BELEZA MODERNA QUE COMBINA LEVEZA E</span>{' '}
              {/* VÍDEO CÁPSULA 2 */}
              <span className="inline-block w-20 sm:w-28 h-10 sm:h-14 rounded-2xl overflow-hidden align-middle border border-slate-200 shadow-sm mx-1">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="https://res.cloudinary.com/dwmrunhxa/video/upload/v1785264356/0727_1_c6pfv2.mp4" type="video/mp4" />
                </video>
              </span>{' '}
              <span className="text-pink-500">CUIDADOS</span>{' '}
              <span>COM A PELE.</span>
            </p>
          </div>

          {/* 3. PARÁGRAFO SUBTÍTULO EDITORIAL ABAIXO */}
          <div className="pt-6 border-t border-slate-200/80 max-w-xl">
            <p className="font-mono text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-widest leading-relaxed">
              CRIADA PARA TRANSMITIR LEVEZA, TRANSPARÊNCIA E ALTA PERFORMANCE BIOMÉTRICA.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
