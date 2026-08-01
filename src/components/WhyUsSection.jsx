import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Texto curto de propósito: a linha É o conteúdo. O corpo só existe
   se o usuário pedir — uma frase por razão, nada além disso. */
const REASONS = [
  {
    n: '01',
    title: 'CLINICAL DOSING',
    body: 'Ativos na porcentagem que realmente trabalha — nunca um respingo decorativo no rótulo.',
  },
  {
    n: '02',
    title: 'BARRIER FIRST',
    body: 'Toda fórmula é testada contra disrupção de barreira antes de ter permissão para sair.',
  },
  {
    n: '03',
    title: 'NO FILLER GLOW',
    body: 'O viço é a sua pele. Sem atalho de silicone, sem truque de dispersão de luz.',
  },
  {
    n: '04',
    title: 'SMALL BATCH',
    body: 'Seis semanas do lote à prateleira, com a data impressa em cada frasco.',
  },
];

export default function WhyUsSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const counterRef = useRef(null);
  const panelRefs = useRef([]);
  const iconRefs = useRef([]);
  const didMountRef = useRef(false);

  const [openIndex, setOpenIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ================================================================
     REVELAÇÃO NO SCROLL
     ================================================================ */
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const heads = gsap.utils.toArray('[data-why="head"]');
      const rules = gsap.utils.toArray('[data-why="rule"]');
      const rows = gsap.utils.toArray('[data-why="row"]');

      /* ESTADO INICIAL — tudo travado antes do primeiro paint. */
      gsap.set(heads, { opacity: 0, visibility: 'hidden', y: 14 });
      gsap.set(rules, { scaleX: 0 });
      gsap.set('[data-why="progress"]', { scaleX: 0 });
      // Topo estendido em -60%: a máscara segura o texto pela linha de baixo
      // sem nunca cortar o topo das capitulares do display font.
      gsap.set('[data-why="mask"]', { clipPath: 'inset(-60% 0% 0% 0%)' });
      gsap.set('[data-why="mask-inner"]', { yPercent: 115 });
      gsap.set('[data-why="plus"]', { opacity: 0, rotate: -90 });

      /* Todos os reveals abaixo usam fromTo com immediateRender:false.
         O valor inicial fica explícito na tween em vez de ser relido do
         DOM: um refresh do ScrollTrigger reparsearia a matriz computada,
         onde `yPercent` já virou pixel, e o offset seria aplicado duas
         vezes. O gate acima é quem pinta o estado inicial. */

      /* Header da seção. */
      gsap.fromTo(heads,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          visibility: 'visible',
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          immediateRender: false,
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        });

      /* Barra rosa: percorre a seção inteira junto com o scroll. */
      gsap.fromTo('[data-why="progress"]',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: 'top 65%',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        });

      /* Cada hairline se abre da esquerda ao entrar em cena.
         Pega também a linha de fechamento embaixo da última razão. */
      rules.forEach((rule) => {
        gsap.fromTo(rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: 'expo.inOut',
            immediateRender: false,
            scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
          });
      });

      /* Headline: cada linha sobe pela própria máscara. */
      const headMasks = headlineRef.current.querySelectorAll('[data-why="mask"]');
      const headInners = headlineRef.current.querySelectorAll('[data-why="mask-inner"]');

      gsap.fromTo(headInners,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.12,
          immediateRender: false,
          scrollTrigger: { trigger: headlineRef.current, start: 'top 85%', once: true },
          onComplete: () => {
            gsap.set(headMasks, { clearProps: 'clipPath' });
            gsap.set(headInners, { clearProps: 'transform' });
          },
        });

      /* Parallax da headline. O alvo é o <h2> e as máscaras vivem nos
         filhos, então as duas animações nunca disputam a mesma
         propriedade no mesmo elemento. */
      gsap.to(headlineRef.current, {
        y: -44,
        ease: 'none',
        scrollTrigger: {
          trigger: headlineRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      /* Conteúdo da linha: número e título sobem juntos, o + gira pra dentro. */
      rows.forEach((row, i) => {
        const masks = row.querySelectorAll('[data-why="mask"]');
        const inners = row.querySelectorAll('[data-why="mask-inner"]');
        const plus = row.querySelector('[data-why="plus"]');

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        });

        tl.fromTo(inners,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.08,
            immediateRender: false,
            onComplete: () => {
              gsap.set(masks, { clearProps: 'clipPath' });
              gsap.set(inners, { clearProps: 'transform' });
            },
          }, 0.18)
          .fromTo(plus,
            { opacity: 0, rotate: -90 },
            { opacity: 1, rotate: 0, duration: 0.7, ease: 'power3.out', immediateRender: false },
            0.34);

        /* Contador do header segue a linha que está na altura da leitura. */
        ScrollTrigger.create({
          trigger: row,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* Flick do contador a cada troca de linha ativa. */
  useEffect(() => {
    if (!counterRef.current) return;
    gsap.fromTo(
      counterRef.current,
      { yPercent: -70, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }, [activeIndex]);

  /* ================================================================
     AS LINHAS QUE SE ABREM (uma por vez)
     ================================================================ */
  useEffect(() => {
    // Na montagem os painéis já nascem fechados pelo CSS (h-0 / opacity-0).
    // Rodar a passada aqui só geraria um ScrollTrigger.refresh() inútil que
    // reparseia as matrizes e corrompe os valores iniciais dos reveals.
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const inner = panel.firstElementChild;
      const isOpen = i === openIndex;

      gsap.to(panel, {
        height: isOpen ? 'auto' : 0,
        duration: 0.55,
        ease: 'power3.inOut',
        // A altura do documento mudou: realinha os triggers depois do movimento.
        onComplete: () => ScrollTrigger.refresh(),
      });

      gsap.to(inner, {
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : 10,
        duration: isOpen ? 0.5 : 0.25,
        delay: isOpen ? 0.12 : 0,
        ease: 'power2.out',
      });

      gsap.to(iconRefs.current[i], {
        rotate: isOpen ? 45 : 0,
        duration: 0.45,
        ease: 'power3.inOut',
      });
    });
  }, [openIndex]);

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="w-full bg-white text-slate-900 py-16 sm:py-24 px-4 sm:px-10 select-none overflow-hidden relative border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto">
        {/* 1. HEADER DA SEÇÃO */}
        <div className="flex items-center justify-between font-mono text-xs tracking-widest uppercase pb-4">
          <div data-why="head" className="flex items-center gap-2 text-black font-bold">
            <span className="w-2 h-2 rounded-full bg-pink-400 inline-block animate-pulse" />
            <span className="font-display font-black text-sm tracking-tight">POR QUE NÓS</span>
            <span className="text-slate-300">//</span>
            <span className="text-pink-400">WHY US</span>
          </div>

          <div data-why="head" className="flex items-baseline gap-1.5 text-black font-bold tabular-nums">
            <span className="inline-block overflow-hidden">
              <span ref={counterRef} className="inline-block">
                {REASONS[activeIndex].n}
              </span>
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">04</span>
          </div>
        </div>

        {/* 2. BARRA DE PROGRESSO DO SCROLL */}
        <div className="relative w-full h-px bg-slate-200/80">
          <div
            data-why="progress"
            className="absolute inset-0 h-px bg-pink-400 origin-left"
          />
        </div>

        {/* 3. HEADLINE CURTA, DUAS LINHAS MASCARADAS */}
        <div className="pt-12 sm:pt-20 pb-10 sm:pb-16">
          <h2
            ref={headlineRef}
            className="font-display font-black text-[13vw] sm:text-[8vw] md:text-[6.2vw] leading-[0.92] tracking-tighter uppercase text-[#09090b]"
          >
            <span data-why="mask" className="block">
              <span data-why="mask-inner" className="block">PROOF,</span>
            </span>
            <span data-why="mask" className="block">
              <span data-why="mask-inner" className="block">NOT PROMISES.</span>
            </span>
          </h2>
        </div>

        {/* 4. AS LINHAS QUE SE ABREM */}
        <div className="w-full">
          {REASONS.map((reason, i) => (
            <div key={reason.n} data-why="row" className="relative">
              {/* HAIRLINE QUE SE ABRE DA ESQUERDA */}
              <div
                data-why="rule"
                className="absolute top-0 left-0 w-full h-px bg-slate-200/80 origin-left"
              />

              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                className="w-full flex items-baseline gap-4 sm:gap-10 py-7 sm:py-9 text-left group cursor-pointer"
              >
                <span data-why="mask" className="block shrink-0">
                  <span
                    data-why="mask-inner"
                    className="block font-mono text-[11px] sm:text-xs font-bold tracking-widest text-pink-400"
                  >
                    {reason.n}
                  </span>
                </span>

                {/* O hover translada a máscara (clip-path), enquanto o GSAP
                    anima o yPercent do filho. Propriedades separadas, sem briga. */}
                <span
                  data-why="mask"
                  className="block group-hover:translate-x-2 transition-transform duration-500 ease-out"
                >
                  <span
                    data-why="mask-inner"
                    className="block font-display font-black text-[7vw] sm:text-[3.4vw] md:text-[2.6vw] leading-none tracking-tighter uppercase text-[#09090b]"
                  >
                    {reason.title}
                  </span>
                </span>

                <span
                  data-why="plus"
                  ref={(el) => (iconRefs.current[i] = el)}
                  className="ml-auto shrink-0 font-mono text-2xl sm:text-3xl font-light leading-none text-slate-300 group-hover:text-pink-400 transition-colors"
                >
                  +
                </span>
              </button>

              {/* CORPO — só existe se o usuário pedir */}
              <div
                ref={(el) => (panelRefs.current[i] = el)}
                className="h-0 overflow-hidden"
              >
                <div className="opacity-0 pb-9 pl-0 sm:pl-[4.5rem]">
                  <p className="max-w-xl font-mono text-[11px] sm:text-xs leading-relaxed tracking-wider uppercase text-slate-500">
                    {reason.body}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* LINHA DE FECHAMENTO DA LISTA */}
          <div className="relative h-px">
            <div
              data-why="rule"
              className="absolute top-0 left-0 w-full h-px bg-slate-200/80 origin-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
