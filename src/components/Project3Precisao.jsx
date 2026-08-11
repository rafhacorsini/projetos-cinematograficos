import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Mesma receita do hero: f_auto,q_auto troca o PNG pesado por WebP/AVIF e
   e_sharpen:60 recupera a nitidez perdida no upscale de telas retina. */
const ID_FOTO = 'v1785708527/ChatGPT_Image_2_de_ago._de_2026_19_08_26_l2rpdp.png';
/* Barra e não vírgula: vírgula é o separador do srcset e quebraria a lista */
const urlFoto = (l) => `https://res.cloudinary.com/dwmrunhxa/image/upload/w_${l}/e_sharpen:60/f_auto/q_auto/${ID_FOTO}`;
const FOTO = urlFoto(2880);
const FOTO_SRCSET = [1440, 2160, 2880].map((l) => `${urlFoto(l)} ${l}w`).join(', ');

/* Medida da própria foto: a faixa inferior dela tem média rgb(100,95,91).
   O painel usa essa cor e o gradiente do rodapé termina nela, então a
   imagem derrete no painel em vez de recortar numa borda dura. */
const PAINEL = '#645F5B';

/* Recorte inicial da foto, em porcentagem de cada lado. Vai a zero conforme
   a rolagem. A foto em si nunca muda de tamanho — quem abre é a janela sobre
   ela, que é o que mantém o enquadramento estável durante todo o movimento. */
const RECORTE_Y = 20;
const RECORTE_X = 15;

/* Escala de apoio na imagem. Sozinho, o recorte faz a janela abrir; um leve
   contra-zoom junto vende melhor a ideia de que a foto está crescendo. */
const ZOOM_INICIAL = 1.12;

const RAIO = 24;

/* Comprimento da rolagem gasto abrindo a foto */
const CURSO = '+=140%';

const TITULO = ['Desenvolvido para', 'máxima precisão, com', 'a confiança de atletas.'];

export default function Project3Precisao() {
  const secaoRef = useRef(null);
  const painelRef = useRef(null);
  const cartaoRef = useRef(null);
  const fotoRef = useRef(null);

  useEffect(() => {
    const painel = painelRef.current;
    const cartao = cartaoRef.current;
    const foto = fotoRef.current;
    if (!painel || !cartao || !foto) return;

    const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const aplicar = (t) => {
      // t vai de 1 (foto pequena) a 0 (foto ocupando o painel inteiro)
      cartao.style.clipPath =
        `inset(${(RECORTE_Y * t).toFixed(2)}% ${(RECORTE_X * t).toFixed(2)}% round ${RAIO}px)`;
      foto.style.transform = `scale(${(1 + (ZOOM_INICIAL - 1) * t).toFixed(4)})`;
    };

    const ctxGsap = gsap.context(() => {
      if (semAnimacao) {
        aplicar(0);
        return;
      }

      aplicar(1);
      ScrollTrigger.create({
        trigger: painel,
        start: 'top top',
        end: CURSO,
        pin: true,
        scrub: 0.3,
        onUpdate: (self) => aplicar(1 - self.progress),
        onRefresh: (self) => aplicar(1 - self.progress),
      });
    }, secaoRef);

    return () => ctxGsap.revert();
  }, []);

  return (
    <section ref={secaoRef} className="relative z-20 w-full bg-[#F2F2F5]">
      {/* Margem pequena nas laterais: o painel arredondado não encosta na borda */}
      <div className="p-2 sm:p-4">
        <div
          ref={painelRef}
          className="relative w-full overflow-hidden"
          style={{
            height: 'calc(100svh - 1rem)',
            backgroundColor: PAINEL,
            borderRadius: RAIO,
          }}
        >
          {/* FOTO recortada — o clip-path abre com a rolagem */}
          <div ref={cartaoRef} className="absolute inset-0">
            <img
              ref={fotoRef}
              src={FOTO}
              srcSet={FOTO_SRCSET}
              sizes="100vw"
              alt="Atleta correndo usando o anel inteligente"
              draggable={false}
              className="absolute inset-0 h-full w-full origin-center object-cover"
            />
            {/* Véu uniforme leve */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ backgroundColor: 'rgba(20,18,16,0.18)' }}
            />

            {/* Scrim da esquerda */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(20,18,16,0.75) 0%, rgba(20,18,16,0.55) 35%, rgba(20,18,16,0) 68%)',
              }}
            />

            {/* Rodapé desvanecendo para a cor do painel */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
              style={{ backgroundImage: `linear-gradient(to bottom, rgba(100,95,91,0) 0%, ${PAINEL} 100%)` }}
            />
          </div>

          {/* TEXTO Clean & Minimalista por cima */}
          <div className="absolute inset-0 flex flex-col px-7 py-8 text-white sm:px-14 sm:py-11">
            <p className="font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-white/60 sm:text-[13px]">
              Maior precisão
            </p>

            <div className="my-auto flex w-full max-w-[44rem] flex-col items-start gap-6 sm:gap-8">
              <h2 className="font-clash text-[clamp(1.75rem,3.8vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.02em] text-white">
                {TITULO.map((linha) => (
                  <span key={linha} className="block">{linha}</span>
                ))}
              </h2>

              <p className="max-w-[28rem] font-sans text-base font-normal leading-relaxed tracking-[-0.01em] text-white/70 lg:text-[19px] lg:leading-[1.4]">
                Análises personalizadas de IA baseadas nos sinais reais do seu corpo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
