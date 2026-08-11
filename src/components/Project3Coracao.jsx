import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* f_auto,q_auto preserva o alfa (entrega WebP/AVIF com canal alfa) e derruba
   o peso; e_sharpen:60 é a mesma receita usada no hero. */
const ID_ANEL = 'v1785709483/Untitled_design_5_jjyuvb.png';
/* Barra e não vírgula: vírgula é o separador do srcset e quebraria a lista */
const urlAnel = (l) => `https://res.cloudinary.com/dwmrunhxa/image/upload/w_${l}/e_sharpen:60/f_auto/q_auto/${ID_ANEL}`;
const ANEL = urlAnel(1800);
const ANEL_SRCSET = [900, 1350, 1800].map((l) => `${urlAnel(l)} ${l}w`).join(', ');

const TINTA = '#0f0f16';
const FIO = 'rgba(15,15,22,0.12)';
const BPM = 154;

/* Um batimento dura 60/154 s. Amarrar a animação ao número em vez de chutar
   uma duração faz o coração pulsar literalmente na frequência exibida. */
const DURACAO_BATIDA = (60 / BPM).toFixed(3);

/* Caixa do anel dentro do arquivo (900x1125), medida pelo canal alfa:
   x 18..878, y 239..885. Ele ocupa 96% da largura mas só 57% da altura —
   há 239px vazios em cima e embaixo. Enquadrar pelo arquivo deixaria o anel
   pequeno demais, então a margem negativa abaixo puxa esse vazio para fora. */
const RECUO_TOPO = 18;   // % da largura: sobe a imagem até o anel encostar no topo
const ALTURA_BLOCO = 60; // % da largura: onde o bloco corta, ~72% do anel visível

/* Curso do parallax, como fração da largura do bloco.
   Precisa ficar abaixo da folga que sobra acima do anel, que é
   (23.9% - 18%) da largura = 5.9% dela. Um valor fixo em pixels não serve:
   no desktop a folga é 81px, mas no mobile cai para 31px e o topo do anel
   seria cortado ao deslizar. 3.5% deixa margem confortável nos dois. */
const DESLIZE_FRACAO = 0.035;

export default function Project3Coracao() {
  const secaoRef = useRef(null);
  const anelRef = useRef(null);
  const numeroRef = useRef(null);

  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao) return;

    const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctxGsap = gsap.context(() => {
      if (!semAnimacao) {
        /* Parallax: o anel sobe enquanto a seção passa, reforçando a ideia
           de que ele desliza por trás da superfície em vez de estar colado.
           Curso em função da largura, recalculado no refresh — assim ele
           acompanha o redimensionamento em vez de estourar a folga. */
        const curso = () => (anelRef.current?.parentElement?.clientWidth || 0) * DESLIZE_FRACAO;

        gsap.fromTo(
          anelRef.current,
          { y: () => curso() },
          {
            y: () => -curso(),
            ease: 'none',
            scrollTrigger: {
              trigger: secao,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      /* Entrada dos blocos de texto: sobem 26px com fade, uma vez só.
         gsap.from (e não set+to) mantém tudo visível se o JS não rodar. */
      if (!semAnimacao) {
        secao.querySelectorAll('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 26,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
      }

      /* Contador do bpm: sobe de 0 até o valor quando a seção entra */
      const alvo = { v: 0 };
      gsap.to(alvo, {
        v: BPM,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: numeroRef.current, start: 'top 85%', once: true },
        onUpdate: () => {
          if (numeroRef.current) numeroRef.current.textContent = Math.round(alvo.v);
        },
      });
    }, secaoRef);

    return () => ctxGsap.revert();
  }, []);

  return (
    <section ref={secaoRef} className="relative w-full overflow-hidden bg-[#F2F2F5]">
      {/* Keyframes locais: mantém a seção autocontida em vez de espalhar
          configuração pelo tailwind.config */}
      <style>{`
        @keyframes coracao-bate {
          0%, 100% { transform: scale(1); }
          14%      { transform: scale(1.13); }
          30%      { transform: scale(1); }
        }
        @keyframes coracao-varre {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -100; }
        }
        .coracao-pulso { animation: coracao-bate ${DURACAO_BATIDA}s ease-in-out infinite; }
        .coracao-traco { animation: coracao-varre ${DURACAO_BATIDA}s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .coracao-pulso, .coracao-traco { animation: none; }
        }
      `}</style>

      {/* LISTRAS VERTICAIS no topo, desvanecendo para baixo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22rem]">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="coracao-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={TINTA} stopOpacity="0.14" />
              <stop offset="0.55" stopColor={TINTA} stopOpacity="0.07" />
              <stop offset="1" stopColor={TINTA} stopOpacity="0" />
            </linearGradient>
          </defs>
          {Array.from({ length: 140 }, (_, i) => (
            <line
              key={i}
              x1={i * 16 + 1}
              y1="0"
              x2={i * 16 + 1}
              y2="100%"
              stroke="url(#coracao-fade)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className="relative mx-auto flex w-full max-w-[80rem] flex-col items-center px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
        {/* ZONA DO ANEL.
            O bloco corta no rodapé e a imagem se estende para baixo dele —
            é esse recorte, alinhado com o fio, que faz o anel parecer
            mergulhar por baixo da superfície em vez de estar apoiado nela. */}
        <div className="relative w-full max-w-[52rem]">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: `100 / ${ALTURA_BLOCO}` }}
          >
            <div ref={anelRef} className="absolute inset-x-0 top-0">
              <img
                src={ANEL}
                srcSet={ANEL_SRCSET}
                sizes="(max-width: 1024px) 100vw, 52rem"
                alt="Anel inteligente visto de frente"
                draggable={false}
                className="block w-full"
                style={{ marginTop: `-${RECUO_TOPO}%` }}
              />
            </div>
          </div>
          {/* O fio onde o anel some */}
          <div className="h-px w-full" style={{ backgroundColor: FIO }} />
        </div>

        {/* TÍTULO */}
        <h2
          data-reveal
          className="mt-14 max-w-[46rem] text-center font-clash text-[clamp(1.75rem,4.2vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em] sm:mt-20"
          style={{ color: TINTA }}
        >
          Saúde do coração, claramente compreendida
        </h2>

        {/* PULSO: traçado, coração, traçado */}
        <div data-reveal className="mt-12 flex w-full max-w-[44rem] items-center justify-center gap-5 sm:mt-16 sm:gap-8">
          <Tracado className="hidden flex-1 sm:block" />

          <svg
            viewBox="0 0 32 32"
            className="coracao-pulso h-12 w-12 shrink-0 origin-center sm:h-16 sm:w-16"
            style={{ color: TINTA }}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M16 28S3.5 20.4 3.5 12.2A7.2 7.2 0 0 1 16 7.3a7.2 7.2 0 0 1 12.5 4.9C28.5 20.4 16 28 16 28Z"
            />
          </svg>

          <Tracado className="flex-1" espelhado />
        </div>

        {/* BPM */}
        <div
          data-reveal
          className="mt-8 flex flex-col items-center rounded-2xl bg-white/50 px-12 py-6 ring-1 ring-white/60 backdrop-blur-md"
        >
          <span
            ref={numeroRef}
            className="font-clash text-[clamp(2rem,4vw,3rem)] font-medium leading-none tabular-nums"
            style={{ color: TINTA }}
          >
            0
          </span>
          <span className="mt-2 font-sans text-base font-medium" style={{ color: TINTA }}>
            bpm
          </span>
        </div>
      </div>
    </section>
  );
}

/* Traçado de ECG: uma linha de base fraca e, por cima, um segmento curto que
   percorre o caminho. pathLength="100" normaliza o comprimento, então o dash
   funciona em unidades de porcentagem e independe da forma exata do path. */
function Tracado({ className = '', espelhado = false }) {
  const d = 'M0,34 H60 l7,-5 l6,9 l5,-27 l6,46 l6,-23 l8,0 H200';
  return (
    <svg
      viewBox="0 0 200 64"
      preserveAspectRatio="none"
      className={`h-14 sm:h-20 ${className}`}
      style={{ transform: espelhado ? 'scaleX(-1)' : undefined, color: TINTA }}
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path
        className="coracao-traco"
        d={d}
        pathLength="100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="16 84"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
