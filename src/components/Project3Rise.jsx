import React, { useEffect, useRef, useState } from 'react';
import { Moon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* 102 frames com fundo transparente, gerados por scripts/ring-transparente.mjs */
const FRAMES = Array.from({ length: 102 }, (_, i) =>
  `/ring-frames/ring-${String(i + 1).padStart(3, '0')}.webp`,
);

/* Caixa que o anel ocupa dentro dos 900x991 do arquivo, medida em todos os
   102 frames por scripts/caixa-ring.mjs. O enquadramento usa ela, e não as
   dimensões do arquivo: o recorte dos JPGs precisou de folga para caber o
   anel em todas as poses, então enquadrar pelo arquivo o deixaria menor e
   fora do centro vertical (o centro dele fica em 45% da altura, não em 50%). */
const CAIXA_ANEL = { x: 36, y: 29, l: 822, a: 840 };

/* Quanto da menor dimensão do painel a caixa do anel ocupa */
const OCUPACAO = 0.36;

/* Comprimento da rolagem gasto percorrendo os frames e os três módulos */
const CURSO = '+=320%';

/* Fração do curso usada para cruzar um módulo com o seguinte */
const CRUZAMENTO = 0.16;

const TINTA = '#0f0f16';
const APAGADO = '#6e6e7a';
const AZUL = '#38BDF8';
const AZUL_GRADIENTE = 'linear-gradient(90deg, #A5DDFB 0%, #38BDF8 100%)';

/* Medidor no padrão do Sensiq: 39 barras finas, as primeiras acesas
   proporcionalmente ao percentual */
const BARRAS_MEDIDOR = 39;

const MODULOS = [
  {
    titulo: ['Entenda seu corpo', 'em tempo real'],
    metrica: {
      rotulo: 'Rastreando…',
      titulo: 'Frequência cardíaca 79 bpm',
      nota: 'Ligeiramente acima da sua faixa normal',
      pct: 32,
    },
    dados: [['Variabilidade', '62 ms'], ['Em repouso', '58 bpm']],
  },
  {
    titulo: ['Veja padrões que', 'outros não veriam'],
    metrica: {
      rotulo: 'Rastreando…',
      titulo: 'Pontuação do sono',
      nota: 'A qualidade do sono cai 18% nos dias em que se janta tarde',
      pct: 67,
    },
    dados: [['Sono profundo', '1h 42'], ['Latência', '12 min']],
  },
  {
    titulo: ['Transforme sinais', 'em decisões claras'],
    metrica: null,
    /* Fecha o arco das três telas: a primeira mede, a segunda encontra o
       padrão, a terceira devolve a decisão. É a mesma estrutura da última
       variante do Sensiq, que troca o gráfico por um cartão de recomendação. */
    recomendacao: {
      rotulo: 'Recomendação',
      texto: 'Faça a última refeição pelo menos 2 horas antes de dormir',
    },
    dados: [['Prontidão', '84%'], ['Carga', 'Moderada']],
  },
];

/* Curva em S: suaviza as pontas do cruzamento entre módulos, evitando o
   corte seco que uma interpolação linear deixaria */
const suave = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function Medidor({ pct }) {
  const acesas = Math.round((pct / 100) * BARRAS_MEDIDOR);
  return (
    <div className="flex items-end gap-4">
      <div className="flex h-[33px] items-end gap-[6px]">
        {Array.from({ length: BARRAS_MEDIDOR }, (_, i) => (
          <span
            key={i}
            className="block h-full w-[2px] shrink-0"
            style={{ backgroundColor: i < acesas ? AZUL : 'rgba(15,15,22,0.12)' }}
          />
        ))}
      </div>
      <span
        className="text-[2rem] font-medium leading-none tabular-nums sm:text-[2.5rem]"
        style={{ color: 'rgba(15,15,22,0.45)' }}
      >
        {pct}%
      </span>
    </div>
  );
}

export default function Project3Rise() {
  const painelRef = useRef(null);
  const canvasRef = useRef(null);
  const secaoRef = useRef(null);
  const preenchimentosRef = useRef([]);
  const modulosRef = useRef([]);

  const [progresso, setProgresso] = useState(0);
  const [pronto, setPronto] = useState(false);

  const imagensRef = useRef([]);
  const ultimaDesenhadaRef = useRef(null);
  const frameAtualRef = useRef(0);

  /* 1. Pré-carregamento */
  useEffect(() => {
    let carregadas = 0;
    const imagens = [];

    FRAMES.forEach((src, i) => {
      const img = new Image();
      img.src = src;

      const contar = () => {
        carregadas++;
        setProgresso(Math.round((carregadas / FRAMES.length) * 100));
        if (carregadas === FRAMES.length) {
          setPronto(true);
          setTimeout(() => ScrollTrigger.refresh(), 100);
        }
      };

      img.onload = () => {
        // decode() evita o engasgo do primeiro desenho de cada frame
        if ('decode' in img) img.decode().then(contar).catch(contar);
        else contar();
      };
      img.onerror = () => {
        console.warn(`Frame do anel não carregou: ${src}`);
        contar();
      };

      imagens[i] = img;
    });

    imagensRef.current = imagens;
  }, []);

  /* 2. Canvas, barra de progresso e troca de módulos — tudo no mesmo scrub */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* alpha: true (padrão) — ao contrário dos outros scrubbers do projeto,
       estes frames são recortados e o fundo da seção precisa aparecer. */
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const desenhar = (indice) => {
      const i = Math.min(FRAMES.length - 1, Math.max(0, Math.round(indice)));
      frameAtualRef.current = i;

      let img = imagensRef.current[i];
      if (!img || !img.complete || img.naturalWidth === 0) {
        img = ultimaDesenhadaRef.current;
      }
      if (!img) return;
      ultimaDesenhadaRef.current = img;

      const L = canvas.width;
      const A = canvas.height;
      ctx.clearRect(0, 0, L, A);

      /* Cabe inteiro (contain), não preenche cortando (cover): é um produto
         recortado, cortar a borda do anel apareceria. A escala e o
         centramento saem da caixa do anel, não do tamanho do arquivo. */
      const escala = Math.min(L / CAIXA_ANEL.l, A / CAIXA_ANEL.a) * OCUPACAO;
      const centroX = CAIXA_ANEL.x + CAIXA_ANEL.l / 2;
      const centroY = CAIXA_ANEL.y + CAIXA_ANEL.a / 2;
      ctx.drawImage(
        img,
        L / 2 - centroX * escala,
        A / 2 - centroY * escala,
        img.naturalWidth * escala,
        img.naturalHeight * escala,
      );
    };

    const redimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const l = painelRef.current?.clientWidth || window.innerWidth;
      const a = painelRef.current?.clientHeight || window.innerHeight;
      canvas.width = l * dpr;
      canvas.height = a * dpr;
      canvas.style.width = `${l}px`;
      canvas.style.height = `${a}px`;
      desenhar(frameAtualRef.current);
    };

    redimensionar();
    window.addEventListener('resize', redimensionar);

    /* Enquanto o painel está pinado, o ScrollTrigger fixa largura e altura
       nele. No resize o handler acima chega a ler esses valores antigos, e o
       canvas fica com o tamanho da viewport anterior. Medir de novo depois
       do refresh do ScrollTrigger corrige, porque aí o pin já recalculou. */
    ScrollTrigger.addEventListener('refresh', redimensionar);

    const ctxGsap = gsap.context(() => {
      /* Os cantos arredondados existem para o painel parecer subindo por
         cima do hero. Depois que ele encosta no topo eles viram um recorte
         parado mostrando o hero atrás, então são zerados na chegada. */
      gsap.to(secaoRef.current, {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: secaoRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      });

      /* quickSetter evita recriar o tween a cada frame do scrub */
      const porPreenchimento = preenchimentosRef.current.map((el) =>
        gsap.quickSetter(el, 'scaleX'),
      );
      const porOpacidade = modulosRef.current.map((el) => gsap.quickSetter(el, 'opacity'));
      const porDeslocamento = modulosRef.current.map((el) => gsap.quickSetter(el, 'y', 'px'));

      const aoAtualizar = (self) => {
        const p = self.progress;
        desenhar(p * (FRAMES.length - 1));

        /* Cada segmento cobre um terço do curso e enche de 0 a 1 dentro dele */
        const emTercos = p * MODULOS.length;
        for (let i = 0; i < MODULOS.length; i++) {
          porPreenchimento[i](Math.min(1, Math.max(0, emTercos - i)));

          /* O primeiro módulo já nasce visível e o último não desaparece no
             fim; sem essas duas exceções a seção abriria e fecharia em branco. */
          const entrada = i === 0 ? 1 : suave(i - CRUZAMENTO, i + CRUZAMENTO, emTercos);
          const saida =
            i === MODULOS.length - 1
              ? 1
              : 1 - suave(i + 1 - CRUZAMENTO, i + 1 + CRUZAMENTO, emTercos);
          const op = Math.min(entrada, saida);
          porOpacidade[i](op);
          porDeslocamento[i]((1 - op) * 18);
        }
      };

      ScrollTrigger.create({
        trigger: painelRef.current,
        start: 'top top',
        end: CURSO,
        pin: true,
        scrub: 0.1,
        onUpdate: aoAtualizar,
        onRefresh: aoAtualizar,
      });
    }, secaoRef);

    desenhar(0);

    return () => {
      window.removeEventListener('resize', redimensionar);
      ScrollTrigger.removeEventListener('refresh', redimensionar);
      ctxGsap.revert();
    };
  }, []);

  return (
    /* O #F2F2F5 é a média medida do fundo da foto do hero (varia de #F1F1F3
       a #F3F3F6), para a seção e o hero lerem como a mesma superfície. */
    <section
      ref={secaoRef}
      className="relative z-10 w-full rounded-t-[1.75rem] bg-[#F2F2F5] sm:rounded-t-[2.5rem]"
    >
      <div
        ref={painelRef}
        className="relative flex h-svh w-full items-center justify-center overflow-hidden"
      >
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block" />

        {/* Camada de conteúdo: barra no topo, módulos na base, anel entre os dois */}
        <div className="pointer-events-none absolute inset-0 flex flex-col px-6 py-7 sm:px-10 sm:py-9">
          {/* BARRA DE PROGRESSO estilo stories */}
          <div className="grid shrink-0 grid-cols-3 gap-4">
            {MODULOS.map((_, i) => (
              <div
                key={i}
                className="h-[2px] w-full overflow-hidden rounded-full"
                style={{ backgroundColor: 'rgba(15,15,22,0.08)' }}
              >
                <div
                  ref={(el) => { preenchimentosRef.current[i] = el; }}
                  className="h-full w-full origin-left rounded-full"
                  style={{ backgroundImage: AZUL_GRADIENTE, transform: 'scaleX(0)' }}
                />
              </div>
            ))}
          </div>

          {/* MÓDULOS empilhados no mesmo lugar, revezando pela rolagem.
              Cada um ocupa a altura toda: olho e título logo abaixo da barra,
              métrica ancorada na base. O anel fica no meio, por trás. */}
          <div className="relative w-full flex-1">
            {MODULOS.map((m, i) => (
              <div
                key={i}
                ref={(el) => { modulosRef.current[i] = el; }}
                className="absolute inset-0 flex flex-col"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {/* Texto — topo, colado na barra de progresso */}
                {/* A largura acompanha a fonte: as frases em português são
                    mais longas que as do layout original em inglês, e num
                    container estreito cada linha do título quebrava em duas. */}
                <div className="mt-7 max-w-[32rem] shrink-0">
                  <p
                    className="font-sans text-[11px] font-semibold uppercase leading-none tracking-[0.08em] sm:text-[13px]"
                    style={{ color: APAGADO }}
                  >
                    Sem assinatura
                  </p>
                  <h2
                    className="mt-4 font-sans text-[clamp(1.6rem,3.5vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.02em]"
                    style={{ color: TINTA }}
                  >
                    {m.titulo.map((linha) => (
                      <span key={linha} className="block">{linha}</span>
                    ))}
                  </h2>
                </div>

                {/* Base: métrica (ou recomendação) à esquerda, leitura à direita */}
                <div className="mt-auto hidden items-end justify-between gap-10 lg:flex">
                  {m.metrica && (
                    <div className="w-full max-w-[27rem]">
                      <p
                        className="font-sans text-[13px] font-semibold uppercase leading-none tracking-[0.08em]"
                        style={{ color: APAGADO }}
                      >
                        {m.metrica.rotulo}
                      </p>
                      <h3
                        className="mt-3 font-sans text-[22px] font-medium leading-tight tracking-[-0.01em]"
                        style={{ color: TINTA }}
                      >
                        {m.metrica.titulo}
                      </h3>
                      <p
                        className="mt-2 flex items-start gap-2 font-sans text-sm font-medium leading-snug"
                        style={{ color: APAGADO }}
                      >
                        <span
                          className="mt-[6px] block h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: AZUL }}
                        />
                        {m.metrica.nota}
                      </p>
                      <div className="mt-4">
                        <Medidor pct={m.metrica.pct} />
                      </div>
                    </div>
                  )}

                  {m.recomendacao && (
                    <div className="w-full max-w-[27rem]">
                      <p
                        className="font-sans text-[13px] font-semibold uppercase leading-none tracking-[0.08em]"
                        style={{ color: APAGADO }}
                      >
                        {m.recomendacao.rotulo}
                      </p>
                      <div className="mt-3 flex items-center gap-4 rounded-xl bg-white p-4 ring-1 ring-black/5">
                        <span
                          className="grid h-14 w-14 shrink-0 place-items-center rounded-lg"
                          style={{ backgroundColor: 'rgba(56,189,248,0.12)' }}
                        >
                          <Moon className="h-6 w-6" strokeWidth={1.6} style={{ color: AZUL }} />
                        </span>
                        <p
                          className="font-sans text-sm font-medium leading-snug"
                          style={{ color: TINTA }}
                        >
                          {m.recomendacao.texto}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Leitura à direita: duas linhas por módulo, só rótulo e
                      valor separados por um fio. Existe para equilibrar a
                      composição sem competir com o título. */}
                  <div className="w-[13rem] shrink-0">
                    {m.dados.map(([rotulo, valor]) => (
                      <div
                        key={rotulo}
                        className="flex items-baseline justify-between gap-4 border-t py-3"
                        style={{ borderColor: 'rgba(15,15,22,0.1)' }}
                      >
                        <span
                          className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em]"
                          style={{ color: APAGADO }}
                        >
                          {rotulo}
                        </span>
                        <span
                          className="font-sans text-[15px] font-medium tabular-nums"
                          style={{ color: TINTA }}
                        >
                          {valor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!pronto && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-sans text-xs tracking-[0.18em] text-[#0f0f16]/35 tabular-nums">
              {progresso}%
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
