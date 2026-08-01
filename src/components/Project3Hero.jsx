import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Project3Nav from './Project3Nav';
import Project3Intro from './Project3Intro';

const HERO_IMG_DEFAULT = 'https://res.cloudinary.com/dwmrunhxa/image/upload/v1785437593/98ef51ed-7e2a-4ace-9e4c-f1aa28578e6f_1_g0ntjt.png';
const HERO_IMG_HOVER = 'https://res.cloudinary.com/dwmrunhxa/image/upload/v1785437851/cdb76d67-dd03-4230-94f1-454395dd5ca6_1_uptxh7.png';

/* Raio do holofote = 26% da largura do frame (o círculo visível fica em ~20%) */
const SPOT_RATIO = 0.26;

/* Suavidade do lerp: 1 gruda no cursor, 0.1 arrasta bastante */
const EASE_POS = 0.2;
const EASE_R = 0.12;

/* As duas fotos têm enquadramentos diferentes (1440x1024 e 1802x989, com o
   conteúdo da 2ª ~19% menor e deslocado). Este transform faz a mão e o anel
   coincidirem — sem ele a imagem salta quando o holofote passa por cima.
   Trocou por um par já alinhado? Use scale(1) sem translate e ajuste FRAME_RATIO. */
const HOVER_TRANSFORM = 'translate(-20.85%, -0.40%) scale(1.24)';

/* Área comum às duas imagens */
const FRAME_RATIO = '600 / 406';

/* Máscara do holofote: sólida até 52% do raio, some em 78% — é essa faixa
   que dá a borda macia, sem círculo recortado aparecendo. */
const SPOT_MASK =
  'radial-gradient(circle var(--r) at var(--x) var(--y), #000 0%, #000 52%, rgba(0,0,0,0) 78%)';

export default function Project3Hero() {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const spotRef = useRef(null);

  /* O holofote só passa a responder quando a entrada termina: durante a
     animação o frame ainda está em escala, e o getBoundingClientRect dele
     não bateria com o clientWidth usado para calcular o raio. */
  const entradaOkRef = useRef(false);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (semAnimacao) {
        gsap.set(frame, { scale: 1, opacity: 1 });
        /* nav-links fica de fora do reset de transform: ele se centraliza
           com translate do Tailwind, e um y:0 aqui apagaria isso. */
        gsap.set(
          '[data-anim="nav-item"], [data-anim="intro-olho"], [data-anim="intro-linha"], [data-anim="intro-sub"], [data-anim="intro-cta"]',
          { opacity: 1, y: 0, yPercent: 0 },
        );
        gsap.set('[data-anim="nav-links"]', { opacity: 1 });
        entradaOkRef.current = true;
        return;
      }

      // Estado inicial
      gsap.set(frame, { scale: 1.08, opacity: 0 });
      gsap.set('[data-anim="nav-item"]', { opacity: 0, y: -10 });
      gsap.set('[data-anim="nav-links"]', { opacity: 0 });
      gsap.set('[data-anim="intro-olho"]', { opacity: 0, y: 12 });
      gsap.set('[data-anim="intro-linha"]', { yPercent: 110 });
      gsap.set('[data-anim="intro-sub"]', { opacity: 0, y: 12 });
      gsap.set('[data-anim="intro-cta"]', { opacity: 0, y: 14 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => { entradaOkRef.current = true; },
      });

      /* A foto sobe do preto do fundo e assenta de 1.08 para 1 num expo bem
         longo — é esse decaimento que dá o peso cinematográfico. O resto
         entra escalonado por cima, já com a imagem quase parada. */
      tl.to(frame, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0)
        .to(frame, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
        .to('[data-anim="nav-item"]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.9)
        .to('[data-anim="nav-links"]', { opacity: 1, duration: 0.9 }, 1.05)
        .to('[data-anim="intro-olho"]', { opacity: 1, y: 0, duration: 0.8 }, 1.05)
        .to('[data-anim="intro-linha"]', {
          yPercent: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
        }, 1.2)
        .to('[data-anim="intro-sub"]', { opacity: 1, y: 0, duration: 0.9 }, 1.75)
        .to('[data-anim="intro-cta"]', { opacity: 1, y: 0, duration: 0.9 }, 1.9);
    }, stageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const spot = spotRef.current;
    if (!stage || !frame || !spot) return;

    const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const easePos = semAnimacao ? 1 : EASE_POS;
    const easeR = semAnimacao ? 1 : EASE_R;

    let x = 0, y = 0, r = 0;      // valores desenhados
    let alvoX = 0, alvoY = 0, alvoR = 0;
    let raf = null;
    let recentrar = true;
    let arrastando = false;

    const raioAlvo = () => frame.clientWidth * SPOT_RATIO;

    const desenhar = () => {
      x += (alvoX - x) * easePos;
      y += (alvoY - y) * easePos;
      r += (alvoR - r) * easeR;

      spot.style.setProperty('--x', `${x.toFixed(1)}px`);
      spot.style.setProperty('--y', `${y.toFixed(1)}px`);
      spot.style.setProperty('--r', `${Math.max(0, r).toFixed(1)}px`);

      // Fechou de vez? Encerra o loop até o próximo movimento.
      if (alvoR === 0 && r < 0.5) {
        r = 0;
        spot.style.setProperty('--r', '0px');
        raf = null;
        return;
      }
      raf = requestAnimationFrame(desenhar);
    };

    const ligar = () => {
      if (raf === null) raf = requestAnimationFrame(desenhar);
    };

    const mirar = (e) => {
      const b = frame.getBoundingClientRect();
      alvoX = e.clientX - b.left;
      alvoY = e.clientY - b.top;
      // Ao entrar, nasce embaixo do cursor em vez de deslizar de longe
      if (recentrar) {
        x = alvoX;
        y = alvoY;
        recentrar = false;
      }
    };

    const abrir = () => { alvoR = raioAlvo(); ligar(); };
    const fechar = () => { alvoR = 0; ligar(); };

    const aoEntrar = (e) => {
      if (!entradaOkRef.current || e.pointerType === 'touch') return;
      recentrar = true;
      mirar(e);
      abrir();
    };

    const aoMover = (e) => {
      if (!entradaOkRef.current) return;
      if (e.pointerType === 'touch') {
        if (!arrastando) return;
        mirar(e);
        ligar();
        return;
      }
      // Cobre o caso do mouse já estar sobre a seção na montagem,
      // quando o pointerenter nunca chega a disparar.
      if (alvoR === 0) {
        recentrar = true;
        mirar(e);
        abrir();
        return;
      }
      mirar(e);
      ligar();
    };

    const aoSair = (e) => {
      if (e.pointerType === 'touch') return;
      fechar();
    };

    /* Toque: o holofote segue o dedo, sem bloquear o scroll */
    const aoPressionar = (e) => {
      if (!entradaOkRef.current || e.pointerType === 'mouse') return;
      arrastando = true;
      recentrar = true;
      mirar(e);
      abrir();
    };

    const aoSoltar = (e) => {
      if (e.pointerType === 'mouse' || !arrastando) return;
      arrastando = false;
      fechar();
    };

    const aoRedimensionar = () => {
      if (alvoR > 0) { alvoR = raioAlvo(); ligar(); }
    };

    stage.addEventListener('pointerenter', aoEntrar);
    stage.addEventListener('pointermove', aoMover);
    stage.addEventListener('pointerleave', aoSair);
    stage.addEventListener('pointerdown', aoPressionar);
    window.addEventListener('pointerup', aoSoltar);
    window.addEventListener('resize', aoRedimensionar);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', aoEntrar);
      stage.removeEventListener('pointermove', aoMover);
      stage.removeEventListener('pointerleave', aoSair);
      stage.removeEventListener('pointerdown', aoPressionar);
      window.removeEventListener('pointerup', aoSoltar);
      window.removeEventListener('resize', aoRedimensionar);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-[#050508] select-none"
    >
      {/* FRAME: mantém a proporção das fotos e cobre a viewport inteira.
          Quem centraliza é o flex do <section>, não um translate(-50%,-50%).
          Isso é de propósito: a entrada anima o transform deste elemento, e
          se o centramento morasse ali também, o GSAP somaria o xPercent dele
          por cima do translate do CSS. No remount do StrictMode isso vira
          -100% e a foto encosta a borda direita no meio da tela, deixando
          metade do fundo preto à mostra. Aqui o transform é só da animação.
          O estado inicial vem no style para não haver piscada no 1º paint. */}
      <div
        ref={frameRef}
        className="relative shrink-0"
        style={{
          width: 'max(100vw, calc(100svh * 600 / 406))',
          aspectRatio: FRAME_RATIO,
          transform: 'scale(1.08)',
          opacity: 0,
        }}
      >
        {/* FOTO 1: sempre visível por baixo */}
        <img
          src={HERO_IMG_DEFAULT}
          alt="Mão usando o anel inteligente"
          draggable={false}
          fetchpriority="high"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* HOLOFOTE: a máscara mora aqui, num elemento sem transform, para as
            coordenadas do círculo baterem com a posição do mouse no frame */}
        <div
          ref={spotRef}
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            '--x': '50%',
            '--y': '50%',
            '--r': '0px',
            WebkitMaskImage: SPOT_MASK,
            maskImage: SPOT_MASK,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        >
          {/* FOTO 2: só aparece dentro do círculo */}
          <img
            src={HERO_IMG_HOVER}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute left-0 top-0 w-full h-auto"
            style={{ transformOrigin: '0 0', transform: HOVER_TRANSFORM }}
          />
        </div>
      </div>

      <Project3Intro />
      <Project3Nav />
    </section>
  );
}
