import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/* Azul do sistema — o mesmo da barra de progresso e do medidor.
   As veias da foto de hover medem #849AB7, um azul-aço dessaturado que
   como contorno fica sujo; este é o mesmo azul na versão vívida. */
const AZUL = '#38BDF8';

/* Vidro escuro sobre a foto clara do hero, na receita do site de referência:
   blur com saturate(1.4), que reforça a cor do que passa por trás em vez de
   só borrar — é o que separa vidro de retângulo translúcido. */
const VIDRO = 'rgba(15,15,22,0.55)';
const BORDA = 'rgba(255,255,255,0.09)';

/* Deslocamento máximo do parallax de mouse, por card. Valores diferentes
   dão profundidade: o de trás anda menos. */
const PARALLAX = [10, 16];

function Pilha({ children, tom = 'rgba(255,255,255,0.55)', cor = 'rgba(255,255,255,0.85)' }) {
  return (
    <span
      className="grid h-[22px] shrink-0 place-items-center rounded-full px-2.5 text-[11px] font-semibold leading-none tabular-nums"
      style={{ border: `1px solid ${tom}`, color: cor }}
    >
      {children}
    </span>
  );
}

export default function Project3Chips() {
  const raizRef = useRef(null);
  const cartoesRef = useRef([]);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* Parallax de mouse: os cards seguem o cursor com atraso, cada um a uma
       distância diferente. quickTo interpola sozinho, sem loop próprio. */
    const mover = cartoesRef.current.map((el, i) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
      d: PARALLAX[i] ?? 12,
    }));

    const aoMover = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mover.forEach((m) => { m.x(-nx * m.d); m.y(-ny * m.d * 0.6); });
    };

    window.addEventListener('pointermove', aoMover);
    return () => window.removeEventListener('pointermove', aoMover);
  }, []);

  return (
    /* Escondido abaixo de lg: no mobile a foto já está muito recortada e os
       cards cairiam sobre a mão. */
    <div
      ref={raizRef}
      className="pointer-events-none absolute inset-y-0 right-0 z-40 hidden items-center pr-7 lg:flex lg:pr-16"
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    >
      <div
        className="flex w-[300px] flex-col gap-2"
        /* Inclinação leve: dá volume sem virar truque. Vem do container,
           então os dois cards compartilham o mesmo ponto de fuga. */
        style={{ transform: 'rotateY(-9deg) rotateX(3deg)' }}
      >
        {/* CARD 1 — barra contínua com marcador */}
        <div
          data-anim="chip"
          ref={(el) => { cartoesRef.current[0] = el; }}
          className="rounded-lg px-[15px] py-[13px]"
          style={{ background: VIDRO, border: `1px solid ${BORDA}`, backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)' }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/60">
                VFC média
              </span>
              <span className="text-[13px] font-semibold text-white tabular-nums">62 ms</span>
            </div>
            <Pilha>−2%</Pilha>
          </div>

          <div
            className="relative mt-3 h-3.5 overflow-hidden rounded"
            /* Hachura no trecho não preenchido, como na referência */
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              backgroundImage:
                'repeating-linear-gradient(115deg, rgba(255,255,255,0.07) 0 2px, transparent 2px 6px)',
            }}
          >
            <div className="h-full w-[34%] rounded bg-white/85" />
            <span className="absolute inset-y-[-3px] left-[34%] w-px bg-white/70" />
          </div>
        </div>

        {/* CARD 2 — barra segmentada, acento azul */}
        <div
          data-anim="chip"
          ref={(el) => { cartoesRef.current[1] = el; }}
          className="rounded-lg px-[15px] py-[13px]"
          style={{ background: VIDRO, border: `1px solid ${BORDA}`, backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)' }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/60">
                Sono REM
              </span>
              <span className="text-[13px] font-semibold text-white tabular-nums">1:44</span>
            </div>
            <Pilha tom={AZUL} cor={AZUL}>22%</Pilha>
          </div>

          <div className="mt-3 flex h-3.5 items-stretch gap-1 overflow-hidden rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div className="w-[16%] rounded" style={{ backgroundColor: AZUL }} />
            <div className="w-[48%] rounded bg-white/85" />
            <div className="w-[15%] rounded bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
