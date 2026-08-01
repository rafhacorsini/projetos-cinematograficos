import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

/* Mesma tinta do menu, para o texto e o menu lerem como um conjunto só */
const TINTA = '#0f0f16';
const APAGADO = '#6e6e7a';
const SUBTITULO = '#54545f';

/* Quebras manuais — cada linha vira um elemento próprio para a máscara
   de entrada poder revelar uma de cada vez */
const LINHAS_TITULO = [
  'Sensoriamento de',
  'precisão desenvolvido',
  'para a compreensão',
  'humana.',
];

/* O bloco fica na metade esquerda da foto, que é quase branca (luminância
   ~244) — por isso texto escuro. A mão começa por volta de 40% da largura,
   então a caixa é limitada para o texto não invadir ela. */
export default function Project3Intro() {
  const tituloRef = useRef(null);
  const [larguraTitulo, setLarguraTitulo] = useState(null);

  /* O botão deve terminar no mesmo ponto que a linha mais larga do título
     ("precisão desenvolvido"). Como o título tem quebras de linha manuais,
     um <h1> em inline-block encolhe para a largura da sua linha mais larga
     — daí só falta medir esse elemento e aplicar a mesma largura no botão.
     Um ResizeObserver mantém a medida certa quando a fonte fluida (clamp)
     muda de tamanho ao redimensionar a janela. */
  useLayoutEffect(() => {
    const el = tituloRef.current;
    if (!el) return;

    const medir = () => setLarguraTitulo(el.getBoundingClientRect().width);
    medir();

    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    /* No mobile o recorte da foto sobe a mão até o meio da tela, e o texto
       centralizado cairia em cima dela (luminância ~50, ilegível). A faixa
       à esquerda só se mantém clara até uns 360px, então ali o bloco ancora
       no topo; do sm pra cima volta a centralizar. */
    <div className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-start px-5 pt-28 sm:justify-center sm:px-7">
      <div className="pointer-events-auto max-w-[32rem] text-left">
        {/* OLHO */}
        <p
          data-anim="intro-olho"
          className="font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.18em] sm:text-xs"
          style={{ color: APAGADO }}
        >
          Sem assinatura
        </p>

        {/* TÍTULO — inline-block para encolher até a linha mais larga.
            Cada linha ganha um invólucro com overflow hidden: é a máscara
            por onde a linha sobe na animação de entrada. O par
            padding/margem negativa devolve o espaço dos acentos e das
            descidas (ç, ã), que o leading apertado de 1.12 cortaria. */}
        <h1
          ref={tituloRef}
          className="mt-5 inline-block font-sans text-[clamp(1.45rem,3vw,2.75rem)] font-medium leading-[1.12] tracking-tight"
          style={{ color: TINTA }}
        >
          {LINHAS_TITULO.map((linha) => (
            <span
              key={linha}
              className="-mt-[0.1em] -mb-[0.18em] block overflow-hidden pb-[0.18em] pt-[0.1em]"
            >
              <span className="block" data-anim="intro-linha">
                {linha}
              </span>
            </span>
          ))}
        </h1>

        {/* SUBTÍTULO — mesma largura do título, senão a frase (mais comprida
            que qualquer linha do título) estica além da coluna e cai em
            cima da mão/anel na foto */}
        <p
          data-anim="intro-sub"
          className="mt-4 font-sans text-sm font-normal leading-snug sm:text-base"
          style={{
            color: SUBTITULO,
            maxWidth: larguraTitulo ? `${larguraTitulo}px` : undefined,
          }}
        >
          Um anel inteligente que entende o seu corpo.
        </p>

        {/* CTA: texto à esquerda, seta na direita — largura = linha mais larga do título */}
        <button
          type="button"
          data-anim="intro-cta"
          className="mt-9 flex h-14 items-center justify-between gap-6 rounded-lg pl-6 pr-5 text-white transition-opacity hover:opacity-85"
          style={{
            backgroundColor: TINTA,
            width: larguraTitulo ? `${larguraTitulo}px` : 'fit-content',
          }}
        >
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.12em] sm:text-sm">
            Começar agora
          </span>
          <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
