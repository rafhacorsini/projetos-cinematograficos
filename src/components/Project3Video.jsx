import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEO = 'https://res.cloudinary.com/dwmrunhxa/video/upload/v1785710538/0802_tgabv7.mp4';

const TINTA = '#0f0f16';
const APAGADO = '#6e6e7a';

export default function Project3Video() {
  const secaoRef = useRef(null);

  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* Entrada: vídeo e texto sobem com fade, escalonados, uma vez só.
       gsap.from (e não set+to) mantém tudo visível se o JS não rodar. */
    const ctxGsap = gsap.context(() => {
      secao.querySelectorAll('[data-reveal]').forEach((el, i) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 1,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: secao, start: 'top 78%', once: true },
        });
      });
    }, secaoRef);

    return () => ctxGsap.revert();
  }, []);

  return (
    <section ref={secaoRef} className="relative w-full bg-[#F2F2F5]">
      <div className="mx-auto grid w-full max-w-[82rem] grid-cols-1 items-center gap-10 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
        {/* VÍDEO à esquerda. 2560x1440 no arquivo, então o bloco usa 16/9 e
            nada é cortado. Sem controles e em loop: é peça de cena, não
            conteúdo para assistir — daí muted e playsInline, que são o que
            os navegadores exigem para deixar tocar sozinho.
            O zoom no hover é no <video>, dentro do overflow-hidden — o
            container não muda de tamanho, só a imagem respira por dentro. */}
        <div
          data-reveal
          className="group overflow-hidden rounded-2xl bg-black/5"
          style={{ aspectRatio: '16 / 9' }}
        >
          <video
            src={VIDEO}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Anel inteligente em uso"
          />
        </div>

        {/* TEXTO à direita */}
        <div data-reveal className="max-w-[34rem]">
          <h2
            className="font-clash text-[clamp(1.75rem,3.8vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em]"
            style={{ color: TINTA }}
          >
            Pronto para entender melhor o seu corpo?
          </h2>

          <p
            className="mt-5 font-sans text-base font-medium leading-snug tracking-[-0.01em] sm:text-xl"
            style={{ color: APAGADO }}
          >
            A compreensão humana começa aqui. Comece sem assinatura.
          </p>

          <button
            type="button"
            className="group mt-9 flex h-13 items-center gap-1.5 rounded-lg py-4 pl-6 pr-4 text-sm font-semibold tracking-[-0.28px] text-white transition-opacity hover:opacity-85 active:scale-[0.98]"
            style={{ backgroundColor: TINTA }}
          >
            Comprar agora
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
