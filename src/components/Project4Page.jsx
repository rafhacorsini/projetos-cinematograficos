import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* Lista de serviços do painel da seção 3. Só os itens com "descricao"
   abrem conteúdo — os outros são linhas simples, como na referência. */
const SERVICOS = [
  { nome: 'Implantes dentários Straumann' },
  { nome: 'Diagnóstico completo & Planejamento' },
  {
    nome: 'Próteses & Restaurações',
    descricao: 'Coroas, pontes e reconstruções de boca inteira.',
    preco: 'R$ 2.500 – R$ 9.000',
  },
  { nome: 'Ortodontia & Alinhadores' },
];

/* Máscara de linha: o invólucro corta, o filho sobe de baixo. O par
   padding/margem negativa devolve o espaço dos acentos e da pontuação que
   o leading apertado cortaria — mesma receita do Project3Intro. */
const MASCARA = '-mt-[0.1em] -mb-[0.18em] block overflow-hidden pb-[0.18em] pt-[0.1em]';

/* Recorte do retângulo nítido do hero. Os dois valores existem para a
   animação de cortina: no fechado o bottom vai a 100%, o que colapsa o
   recorte; animar até o aberto faz a moldura descer revelando a imagem.
   Só o bottom muda entre eles — o resto tem de bater, senão o recorte
   salta de posição no último quadro. */
const RECORTE_FECHADO = 'inset(15% 26% 100% 34% round 32px)';
const RECORTE_ABERTO = 'inset(15% 26% 55% 34% round 32px)';

/* O inset() é em %, então o mesmo recorte que enquadra bem no desktop vira
   uma fresta vertical no celular: 34% + 26% comem 60% da largura, sobrando
   um talho de 40% numa tela que já é estreita. No mobile ele abre quase
   toda a largura e ganha mais altura. */
const RECORTE_MOBILE_FECHADO = 'inset(14% 8% 100% 8% round 22px)';
const RECORTE_MOBILE_ABERTO = 'inset(14% 8% 46% 8% round 22px)';

const MQ_MOBILE = '(max-width: 767px)';

/* Mesma ideia nas fotos, sem raio: elas já têm border-radius próprio, e
   os dois clipes compõem — o canto arredondado sobrevive à cortina. */
const CORTINA_FECHADA = 'inset(0% 0% 100% 0%)';
const CORTINA_ABERTA = 'inset(0% 0% 0% 0%)';

/* Paleta e escalas da seção 2, em um lugar só — os rótulos pequenos
   apareciam repetidos em 3 lugares com valores levemente diferentes. */
const ROTULO_COR = '#B3B3B3';
const CORPO_COR = '#8C8C8C'; /* mais escuro que o rótulo: parágrafo precisa ser lido */

/* Uppercase minúsculo pede tracking generoso — 0.16em dá o ar editorial
   que 0.08em não alcançava. */
const ROTULO =
  'text-[0.7rem] font-medium uppercase tracking-[0.16em] md:text-[0.75rem]';

/* Mesma tinta e o mesmo peso leve do hero (450/-0.05em), para as duas
   seções lerem como uma peça só em vez de duas fontes diferentes. */
const TITULO = {
  fontWeight: 480,
  letterSpacing: '-0.045em',
  fontSize: 'clamp(1.3rem, 4.8vw, 4.2rem)',
  lineHeight: 1.02,
};

/* Mesmo raio do bloco do hero (1.75rem), com sombra difusa e um aro de 1px
   que impede a foto clara de "vazar" no fundo quase branco. */
const FOTO =
  'rounded-[1.5rem] object-cover shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] ring-1 ring-black/5';

/* Equipe da seção 4.
   ATENÇÃO: as fotos são as mesmas da seção 2/3, usadas só como marcador —
   troque pelos retratos reais. "desloco" quebra o alinhamento do grid pra
   fugir do "grid de equipe" parelho; "proporcao" varia a altura pelo mesmo
   motivo. */
const PROFISSIONAIS = [
  {
    nome: 'Dra. Helena Vasques',
    cargo: 'Implantodontia & Cirurgia',
    registro: 'CRO-SP 48.221',
    foto: 'https://res.cloudinary.com/dwmrunhxa/image/upload/v1785869122/ChatGPT_Image_4_de_ago._de_2026_15_44_41_mjzucf.png',
    proporcao: '3 / 4',
    desloco: 'md:mt-0',
  },
  {
    nome: 'Dr. Rafael Andrade',
    cargo: 'Odontologia Estética',
    registro: 'CRO-SP 51.907',
    foto: 'https://res.cloudinary.com/dwmrunhxa/image/upload/v1785870302/ChatGPT_Image_4_de_ago._de_2026_16_04_37_j5yag0.png',
    proporcao: '4 / 5',
    desloco: 'md:mt-20',
  },
  {
    nome: 'Dra. Marina Toledo',
    cargo: 'Ortodontia & Alinhadores',
    registro: 'CRO-SP 55.140',
    foto: 'https://res.cloudinary.com/dwmrunhxa/image/upload/v1785874908/ChatGPT_Image_4_de_ago._de_2026_17_20_41_rscgha.png',
    proporcao: '3 / 4',
    desloco: 'md:mt-8',
  },
];

/* Destino do formulário. TROQUE pelo e-mail real da clínica. */
const EMAIL_CONTATO = 'contato@dentaelite.com.br';

const CAMPOS = [
  { id: 'nome', rotulo: 'Nome completo', tipo: 'text', dica: 'Como podemos te chamar?' },
  { id: 'email', rotulo: 'E-mail', tipo: 'email', dica: 'seu@email.com' },
  { id: 'telefone', rotulo: 'Telefone', tipo: 'tel', dica: '(11) 90000-0000' },
];

export default function Project4Page() {
  const raizRef = useRef(null);
  const fioRef = useRef(null); /* <line> do conector: precisa do comprimento real */
  const fotoFundoRef = useRef(null);
  /* Índice do serviço aberto no acordeão; -1 fecha todos */
  const [servicoAberto, setServicoAberto] = useState(2);
  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
  });

  /* O recorte do vídeo precisa de valores diferentes no celular, e clip-path
     em style inline não aceita media query — daí a decisão vir pro JS. */
  const [ehMobile, setEhMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MQ_MOBILE).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(MQ_MOBILE);
    const aoMudar = () => setEhMobile(mq.matches);
    mq.addEventListener('change', aoMudar);
    return () => mq.removeEventListener('change', aoMudar);
  }, []);

  const recorteAberto = ehMobile ? RECORTE_MOBILE_ABERTO : RECORTE_ABERTO;

  const alterarCampo = (id) => (e) =>
    setFormulario((atual) => ({ ...atual, [id]: e.target.value }));

  /* Sem back-end aqui: o submit monta um mailto e entrega para o cliente de
     e-mail do visitante, com tudo preenchido. Funciona de verdade, mas o
     visitante ainda precisa apertar enviar no programa dele. Quando houver
     endpoint, troque este corpo por um fetch e mantenha o resto. */
  const enviar = (e) => {
    e.preventDefault();
    const corpo = [
      `Nome: ${formulario.nome}`,
      `E-mail: ${formulario.email}`,
      `Telefone: ${formulario.telefone}`,
      '',
      formulario.mensagem,
    ].join('\n');

    window.location.href =
      `mailto:${EMAIL_CONTATO}` +
      `?subject=${encodeURIComponent('Consultoria gratuita — novo contato')}` +
      `&body=${encodeURIComponent(corpo)}`;
  };

  useLayoutEffect(() => {
    if (!raizRef.current) return;

    const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      /* Sem estado inicial escondido não há o que restaurar: os elementos já
         nascem visíveis no CSS. Zerar transforms aqui só quebraria os
         -translate-* que alguns deles usam para se posicionar. */
      if (semAnimacao) return;

      /* ---------- HERO: entrada no load ---------- */
      gsap.set('[data-anim="hero-fundo"]', { scale: 1.12, opacity: 0 });
      gsap.set('[data-anim="hero-nav"]', { opacity: 0, y: -14 });
      /* Cortina: o retângulo nítido nasce fechado (bottom 100%) e desce até
         o valor real do recorte. Só o número do bottom muda — o resto do
         inset tem de bater com o do CSS, senão o recorte salta no fim. */
      /* Lido aqui de novo (e não do state) de propósito: o efeito roda uma
         vez só, e o que importa é o recorte válido no primeiro quadro. */
      const noCelular = window.matchMedia(MQ_MOBILE).matches;
      const recFechado = noCelular ? RECORTE_MOBILE_FECHADO : RECORTE_FECHADO;
      const recAberto = noCelular ? RECORTE_MOBILE_ABERTO : RECORTE_ABERTO;

      gsap.set('[data-anim="hero-nitido"]', { clipPath: recFechado });
      /* Texto entra deslizando da direita dentro da máscara */
      gsap.set('[data-anim="hero-linha"]', { xPercent: 100, opacity: 0 });
      gsap.set('[data-anim="hero-social"]', { opacity: 0, x: 30 });
      gsap.set('[data-anim="hero-card"]', { opacity: 0, y: -18, scale: 0.94 });
      gsap.set('[data-anim="hero-origem"]', { opacity: 0, scale: 0 });
      gsap.set('[data-anim="hero-no"]', { opacity: 0, scale: 0 });

      /* Traço desenhado: dasharray igual ao comprimento e dashoffset animado
         até 0 faz a linha "crescer" do card em direção ao dente. */
      const fio = fioRef.current;
      const curso = fio ? fio.getTotalLength() : 0;
      if (fio) gsap.set(fio, { strokeDasharray: curso, strokeDashoffset: curso });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      /* A cena abre com a imagem assentando de 1.12 para 1 num expo longo —
         é esse decaimento que dá o peso de vídeo. A cortina do recorte desce
         por cima, e só então o texto começa a deslizar da direita. */
      tl.to('[data-anim="hero-fundo"]', { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0)
        .to('[data-anim="hero-fundo"]', { scale: 1, duration: 2.8 }, 0)
        .to('[data-anim="hero-nitido"]', { clipPath: recAberto, duration: 1.7 }, 0.35)
        .to('[data-anim="hero-nav"]', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.6)
        .to('[data-anim="hero-linha"]', { xPercent: 0, opacity: 1, duration: 1.4, stagger: 0.13 }, 1)
        .to('[data-anim="hero-social"]', { opacity: 1, x: 0, duration: 1.1 }, 1.75)
        .to('[data-anim="hero-card"]', { opacity: 1, y: 0, scale: 1, duration: 1.1 }, 1.85)
        .to('[data-anim="hero-origem"]', { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 2.35);

      if (fio) tl.to(fio, { strokeDashoffset: 0, duration: 0.85, ease: 'power2.inOut' }, 2.5);

      /* back.out dá o "assentar" do nó no dente, fecho da sequência */
      tl.to('[data-anim="hero-no"]', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, 3.2);

      /* ---------- SEÇÃO 2: entra por scroll, bloco a bloco ---------- */
      gsap.set('[data-anim="s2-rotulo"]', { opacity: 0, x: 20 });
      gsap.set('[data-anim="s2-linha"]', { xPercent: 100, opacity: 0 });
      gsap.set('[data-anim="s2-foto"]', { clipPath: CORTINA_FECHADA, scale: 1.14 });
      gsap.set('[data-anim="s2-fio"]', { scaleX: 0 });
      gsap.set('[data-anim="s2-texto"]', { opacity: 0, x: 24 });
      gsap.set('[data-anim="s2-linha2"]', { xPercent: 100, opacity: 0 });
      gsap.set('[data-anim="s2-foto2"]', { clipPath: CORTINA_FECHADA, scale: 1.2, rotation: -13 });
      /* Só opacidade: esse rótulo se centra com -translate-y-1/2, e animar x/y
         nele sobrescreveria o transform que o mantém no lugar. */
      gsap.set('[data-anim="s2-rotulo2"]', { opacity: 0 });

      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: '[data-bloco="s2-topo"]', start: 'top 78%' },
        })
        .to('[data-anim="s2-rotulo"]', { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 0)
        .to('[data-anim="s2-linha"]', { xPercent: 0, opacity: 1, duration: 1.4, stagger: 0.13 }, 0.1)
        /* A cortina desce enquanto a foto sai de 1.14 para 1: a imagem parece
           se acomodar atrás da moldura em vez de simplesmente aparecer. */
        .to('[data-anim="s2-foto"]', { clipPath: CORTINA_ABERTA, duration: 1.5 }, 0.35)
        .to('[data-anim="s2-foto"]', { scale: 1, duration: 2 }, 0.35);

      /* O fio de cabelo abre da esquerda e puxa o resto do bloco atrás */
      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: '[data-anim="s2-fio"]', start: 'top 88%' },
        })
        .to('[data-anim="s2-fio"]', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
        .to('[data-anim="s2-texto"]', { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }, 0.3)
        .to('[data-anim="s2-linha2"]', { xPercent: 0, opacity: 1, duration: 1.4, stagger: 0.11 }, 0.4)
        .to('[data-anim="s2-foto2"]', { clipPath: CORTINA_ABERTA, duration: 1.4 }, 1)
        .to('[data-anim="s2-foto2"]', { scale: 1, rotation: -6, duration: 1.8 }, 1)
        .to('[data-anim="s2-rotulo2"]', { opacity: 1, duration: 1, ease: 'power3.out' }, 1.35);

      /* ---------- SEÇÃO 3: entra conforme o piso é descoberto ---------- */
      gsap.set('[data-anim="s3-rotulo"]', { opacity: 0, x: 24 });
      gsap.set('[data-anim="s3-linha"]', { xPercent: 100, opacity: 0 });
      gsap.set('[data-anim="s3-item"]', { opacity: 0, x: 44 });

      /* O gatilho é o vão, não o painel: o painel é fixo, então nunca
         "entra" na viewport e um ScrollTrigger nele dispararia na hora
         errada. O vão é justamente o trecho de scroll que descobre o
         piso, então ele mede o momento certo. 'top 75%' começa a
         sequência com a revelação já em curso, não antes dela. */
      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: '[data-bloco="vao"]', start: 'top 75%' },
        })
        .to('[data-anim="s3-rotulo"]', { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 0)
        .to('[data-anim="s3-linha"]', { xPercent: 0, opacity: 1, duration: 1.4, stagger: 0.13 }, 0.1)
        .to('[data-anim="s3-item"]', { opacity: 1, x: 0, duration: 1.1, stagger: 0.12 }, 0.55);

      /* ---------- SEÇÃO 4: a equipe ---------- */
      gsap.set('[data-anim="s4-fio"]', { scaleX: 0 });
      gsap.set('[data-anim="s4-rotulo"]', { opacity: 0, x: 24 });
      gsap.set('[data-anim="s4-linha"]', { xPercent: 100, opacity: 0 });

      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: '[data-bloco="s4"]', start: 'top 72%' },
        })
        .to('[data-anim="s4-fio"]', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
        .to('[data-anim="s4-rotulo"]', { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 0.25)
        .to('[data-anim="s4-linha"]', { xPercent: 0, opacity: 1, duration: 1.4, stagger: 0.13 }, 0.15);

      /* Os retratos entram um a um. A cortina desce na moldura enquanto,
         por dentro, a foto sai de P&B para a cor e assenta de 1.15 para 1 —
         as três coisas em durações diferentes de propósito: a cor é a mais
         longa, então ela termina depois da cortina e o retrato parece
         "ganhar vida" já revelado, em vez de chegar pronto.

         O gatilho é a moldura de cada card (não a seção), senão os três
         disparariam juntos e o escalonamento sumiria em telas altas. */
      gsap.utils.toArray('[data-anim="s4-moldura"]').forEach((moldura) => {
        const foto = moldura.querySelector('[data-anim="s4-foto"]');
        const textos = moldura.parentElement.querySelectorAll('[data-anim="s4-nome"]');

        gsap.set(moldura, { clipPath: CORTINA_FECHADA });
        gsap.set(foto, { scale: 1.15, filter: 'grayscale(1)' });
        gsap.set(textos, { opacity: 0, y: 18 });

        gsap
          .timeline({
            defaults: { ease: 'expo.out' },
            scrollTrigger: { trigger: moldura, start: 'top 82%' },
          })
          .to(moldura, { clipPath: CORTINA_ABERTA, duration: 1.5 }, 0)
          .to(foto, { scale: 1, duration: 2 }, 0)
          .to(foto, { filter: 'grayscale(0)', duration: 2.4, ease: 'power2.out' }, 0.5)
          .to(textos, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, 0.7);
      });

      /* ---------- SEÇÃO 5: consultoria ---------- */
      gsap.set('[data-anim="s5-fio"]', { scaleX: 0 });
      gsap.set('[data-anim="s5-rotulo"]', { opacity: 0, x: 24 });
      gsap.set('[data-anim="s5-linha"]', { xPercent: 100, opacity: 0 });
      gsap.set('[data-anim="s5-texto"]', { opacity: 0, y: 16 });
      gsap.set('[data-anim="s5-campo"]', { opacity: 0, x: 40 });

      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: '[data-bloco="s5"]', start: 'top 72%' },
        })
        .to('[data-anim="s5-fio"]', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
        .to('[data-anim="s5-rotulo"]', { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 0.25)
        .to('[data-anim="s5-linha"]', { xPercent: 0, opacity: 1, duration: 1.4, stagger: 0.13 }, 0.15)
        .to('[data-anim="s5-texto"]', { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }, 0.6)
        /* Os campos entram depois do texto: primeiro o argumento, depois o
           pedido. Escalonados, um por linha, como uma ficha se montando. */
        .to('[data-anim="s5-campo"]', { opacity: 1, x: 0, duration: 1.1, stagger: 0.1 }, 0.75);

      /* ---------- RODAPÉ ---------- */
      gsap.set('[data-anim="rodape-col"]', { opacity: 0, y: 18 });
      /* yPercent 100 esconde a palavra inteira abaixo da máscara; ela sobe
         atrás do recorte, como um letreiro entrando em cena. */
      gsap.set('[data-anim="rodape-marca"]', { yPercent: 100 });

      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: '[data-bloco="rodape"]', start: 'top 85%' },
        })
        .to('[data-anim="rodape-col"]', { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, 0)
        .to('[data-anim="rodape-marca"]', { yPercent: 0, duration: 1.8 }, 0.3);
    }, raizRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={raizRef} className="relative">
    {/* SEÇÃO 3 — o piso. Fica fixo atrás de tudo desde o primeiro quadro;
     * as seções 1 e 2 são opacas e passam por cima. Quando a 2 termina, o
     * vão transparente no fim da página descobre ele, e a leitura é de que
     * ele sempre esteve ali embaixo — que é exatamente o efeito pedido.
     *
     * Fixo em vez de sticky de propósito: o App envolve a página em
     * overflow-x-hidden, o que torna aquele wrapper um contêiner de
     * rolagem e faz position:sticky não grudar em nada. */}
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      {/* Fixa: sem parallax, sem folga extra de altura. object-[78%_center]
       * escolhe qual faixa da foto o object-cover mantém visível — acima de
       * 50% mostra mais do lado direito, empurrando o assunto pra esquerda. */}
      <img
        ref={fotoFundoRef}
        src="https://res.cloudinary.com/dwmrunhxa/image/upload/v1785874908/ChatGPT_Image_4_de_ago._de_2026_17_20_41_rscgha.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[78%_center]"
      />

      {/* Painel de vidro sobre a metade esquerda da foto. O saturate no
       * backdrop-filter reforça a cor do que passa por trás em vez de só
       * borrar — é o que separa vidro de retângulo translúcido. */}
      <div
        className="absolute inset-y-0 left-0 flex w-full flex-col justify-center px-[6%] md:w-1/2 md:px-12 lg:px-16"
        style={{
          fontFamily: '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif',
          /* Só blur, sem tinta nenhuma: a própria foto continua visível
             atrás, apenas desfocada deste lado. */
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <span data-anim="s3-rotulo" className={`text-white/70 ${ROTULO}`}>
          Especialidades
        </span>

        <h2
          className="mt-4 text-white"
          style={{
            fontWeight: 480,
            letterSpacing: '-0.04em',
            fontSize: 'clamp(1.6rem, 2.6vw, 2.6rem)',
            lineHeight: 1.05,
          }}
        >
          <span className={`w-fit ${MASCARA}`}>
            <span className="block" data-anim="s3-linha">Especialistas em</span>
          </span>
          <span className={`w-fit ${MASCARA}`}>
            <span className="block" data-anim="s3-linha">transformar sorrisos</span>
          </span>
        </h2>

        <ul className="mt-9 border-t border-white/25">
          {SERVICOS.map((servico, i) => {
            const aberto = i === servicoAberto;
            return (
              <li key={servico.nome} data-anim="s3-item" className="border-b border-white/25">
                <button
                  type="button"
                  onClick={() => setServicoAberto(aberto ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 py-4 text-left"
                >
                  <span
                    className="text-white"
                    style={{
                      fontWeight: 450,
                      letterSpacing: '-0.02em',
                      fontSize: 'clamp(0.95rem, 1.3vw, 1.25rem)',
                      lineHeight: 1.15,
                    }}
                  >
                    {servico.nome}
                  </span>
                  {aberto ? (
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-white" strokeWidth={1.5} />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 shrink-0 text-white/55" strokeWidth={1.5} />
                  )}
                </button>

                {/* grid-rows 0fr -> 1fr anima a altura sem precisar medir o
                 * conteúdo em JS; o filho leva o overflow-hidden. */}
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    aberto && servico.descricao ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-white/75">
                      {servico.descricao}
                    </p>

                    <p className="mt-3 text-sm text-white/90">
                      Preço: <span className="text-white/55">{servico.preco}</span>
                    </p>

                    {/* Pílula branca com texto escuro: sobre vidro claro, o
                     * botão preto sumia — invertido ele volta a ser o ponto
                     * de maior contraste do painel. */}
                    <a
                      href="#"
                      className="mb-6 mt-5 inline-block rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition-transform hover:scale-105"
                    >
                      Agendar consulta
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>

    {/* h-svh e não h-screen: no celular 100vh conta a barra de endereço que
     * some ao rolar, então o hero ficava mais alto que a tela visível. */}
    <div
      className="relative z-10 w-full h-svh p-3 md:p-5"
      style={{
        background:
          'radial-gradient(58.07% 106.14% at -1.32% 57.06%, #C9C9C9 0%, #FFF 54.81%, #FFF 100%)',
      }}
    >
    <div className="relative w-full h-full overflow-hidden rounded-[1.75rem] bg-black">
      {/* Trocado pro master 1080p (confirmado via w_4000,c_limit: o arquivo
       * real é 1920x1080, 10s, ~7.46 Mbps — bitrate saudável pra essa
       * resolução, sem sinal de recompressão anterior).
       *
       * Isso já resolve o problema de raiz que o 720p tinha: até 1920px de
       * largura de tela, o browser agora REDUZ em vez de AMPLIAR o vídeo pra
       * preencher a área (object-cover). Redução sempre sai mais limpa.
       *
       * w_1920,c_scale fica de garantia — como o master já é 1920, normalmente
       * é um no-op; só entra em ação se um dia trocarem por um master maior
       * sem eu mexer aqui, evitando ampliação além do necessário sem querer.
       * q_auto:best reencoda pra bitrate ótimo (sem redução de qualidade,
       * só corta gordura de encode). Sharpen eu tirei: o 720p precisava pra
       * compensar a ampliação; nesse tamanho ele só criaria halo à toa. */}
      <video
        src="https://res.cloudinary.com/dwmrunhxa/video/upload/w_1920,c_scale,q_auto:best/v1785858811/Modelo_sorri_sem_movimentos_1080p_202608041253_lcwqbc.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        data-anim="hero-fundo"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(3px)' }}
      />

      {/* Filtro escuro bem leve sobre o vídeo de fundo, só pra dar um
       * pouco mais de contraste geral (não é a sombra de baixo, essa é
       * uniforme por cima de tudo). */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-black/15" />

      {/* Menu superior: logo à esquerda, links de navegação ao lado, e
       * botão "Contate-nos" (pílula branca) na extrema direita. */}
      <div
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[6%] py-4 md:py-6"
        style={{
          fontFamily: '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        <div className="flex items-center gap-6 md:gap-10">
          <div
            data-anim="hero-nav"
            className="flex items-baseline text-[1.15rem] text-white md:text-[1.4rem]"
            style={{ fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            Denta
            <span style={{ fontSize: '0.7rem', marginLeft: '2px', fontWeight: 500 }}>
              ®
            </span>
          </div>

          {/* Os três links somados ao botão não cabem numa tela de 375px —
           * some com eles no celular e deixa só marca + CTA. */}
          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#"
              data-anim="hero-nav"
              className="text-white/90 hover:text-white transition-colors"
              style={{ fontWeight: 400, fontSize: '0.95rem' }}
            >
              Implantes
            </a>
            <a
              href="#"
              data-anim="hero-nav"
              className="text-white/90 hover:text-white transition-colors"
              style={{ fontWeight: 400, fontSize: '0.95rem' }}
            >
              Sobre
            </a>
            <a
              href="#"
              data-anim="hero-nav"
              className="text-white/90 hover:text-white transition-colors"
              style={{ fontWeight: 400, fontSize: '0.95rem' }}
            >
              Preços
            </a>
          </nav>
        </div>

        <a
          href="#"
          data-anim="hero-nav"
          className="whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-[0.8rem] text-black transition-transform hover:scale-105 md:px-6 md:py-[0.65rem] md:text-[0.9rem]"
          style={{ fontWeight: 500 }}
        >
          Contate-nos
        </a>
      </div>

      {/* Segunda cópia do MESMO vídeo, em tela cheia e sem blur, igualzinha
       * à de fundo (mesmo object-cover, sem zoom/deslocamento) — por isso o
       * enquadramento bate perfeitamente com o vídeo borrado atrás. O
       * clip-path só "revela" essa cópia dentro do retângulo arredondado;
       * o resto continua transparente e deixa aparecer o blur de baixo.
       * Ajuste os 4 números do inset() = top right bottom left (%) pra
       * mover/redimensionar o recorte, e o valor depois de "round" pra
       * mudar o arredondamento das bordas. */}
      <video
        src="https://res.cloudinary.com/dwmrunhxa/video/upload/w_1920,c_scale,q_auto:best/v1785858811/Modelo_sorri_sem_movimentos_1080p_202608041253_lcwqbc.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        data-anim="hero-nitido"
        className="absolute inset-0 w-full h-full object-cover z-[5]"
        style={{ clipPath: recorteAberto, WebkitClipPath: recorteAberto }}
      />

      {/* Card glassmorphism "sistema de instalação de lâminas" + linha
       * conectora até o dente. Ajuste top-[...]/right-[...] pra mover o
       * card, e left-[...]/top-[...] do "nó" (bolinha) + o ângulo/tamanho
       * da linha pra apontar certinho pro incisivo central. */}
      {/* Escondido no celular: com o recorte ocupando quase toda a largura,
       * o card e a linha até o dente cairiam em cima do vídeo e do menu. */}
      <div className="absolute top-[10%] right-[20%] z-[15] hidden w-[12rem] md:block">
        <div
          data-anim="hero-card"
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.35)',
            boxShadow:
              'inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 12px rgba(255,255,255,0.05), 0 8px 30px rgba(0,0,0,0.35)',
          }}
        >
          {/* Ícone: dente + faceta se encaixando */}
          <img
            src="https://res.cloudinary.com/dwmrunhxa/image/upload/v1785865399/ChatGPT_Image_4_de_ago._de_2026_14_33_55_izapn6.png"
            alt=""
            className="w-12 h-12 object-contain flex-shrink-0"
          />

          <div
            className="text-white"
            style={{
              fontFamily: '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              fontSize: '0.85rem',
              lineHeight: 1.25,
            }}
          >
            Sistema
            <br />
            de instalação
            <br />
            de lâminas
          </div>
        </div>

        {/* Linha luminosa branca do canto inferior do card até o nó no dente.
         * "left"/"top" do svg = ponto de PARTIDA da linha (canto do card).
         * x2/y2 da <line> e cx/cy do <circle> final (têm que ser sempre
         * iguais entre si) = ponto de CHEGADA, em px, relativo ao ponto de
         * partida: x negativo vai pra esquerda, y positivo vai pra baixo.
         * cx/cy dos dois círculos do início (cinza + branco) ficam fixos em
         * 0,0 — é o "nó de origem" preso na ponta do card. */}
        <svg
          className="pointer-events-none absolute overflow-visible"
          style={{ left: '1.8rem', top: '100%', width: '1px', height: '1px' }}
        >
          <line
            ref={fioRef}
            x1="0"
            y1="0"
            x2="-80"
            y2="70"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.9))' }}
          />
          {/* Bolinha de origem: anel cinza com miolo branco */}
          <circle data-anim="hero-origem" cx="0" cy="0" r="6" fill="#C9CCD1" />
          <circle data-anim="hero-origem" cx="0" cy="0" r="3" fill="#FFFFFF" />
          {/* Nó de chegada, sobre o dente */}
          <circle
            data-anim="hero-no"
            cx="-80"
            cy="70"
            r="4.5"
            fill="#FFFFFF"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,1))' }}
          />
        </svg>
      </div>

      {/* Máscara de sombra preta na parte inferior, pra dar contraste pro texto */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-[45%] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Selo social, canto inferior esquerdo — placeholders nos avatares.
       * Não tenho fotos reais de pacientes; são círculos com gradiente até
       * o usuário trocar por fotos de verdade (basta substituir o <div> de
       * cada avatar por <img className="h-full w-full object-cover" />). */}
      <div
        className="absolute left-[6%] right-[6%] bottom-[6%] z-20 flex flex-col gap-2 md:right-auto md:bottom-[8%]"
        style={{
          fontFamily: '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        {/* Bloco principal: título + avatares + número + estrelas.
         * No celular o selo social não cabe ao lado do título — empilha. */}
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-8">
          {/* "Odontologia estética" — mesma escala de headline usada antes no
           * hero (clamp em vw, letter-spacing bem negativo pra não ficar solto
           * em fonte gigante). */}
          {/* O clamp antigo tinha piso de 2.4rem: num celular de 375px a
           * frase mais longa passava da largura útil e, dentro da máscara
           * com leading 0.85, a quebra ficaria cortada. O piso menor e o vw
           * maior seguram no mobile sem mudar nada do md pra cima. */}
          <div
            className={`w-fit whitespace-nowrap text-[clamp(1.3rem,6.2vw,2.2rem)] text-white md:text-[clamp(2.4rem,5.2vw,5rem)] ${MASCARA}`}
            style={{
              fontWeight: 450,
              letterSpacing: '-0.05em',
              lineHeight: 0.85,
            }}
          >
            <span className="block" data-anim="hero-linha">
              Odontologia Estética
            </span>
          </div>

          {/* Avatares + 1500+ + estrelas, agora ao lado do título em vez de
           * embaixo. Fica numa coluna própria pra estrelas reportarem só ao
           * número, não à linha inteira. */}
          <div className="flex items-center gap-2" data-anim="hero-social">
          <div className="flex -space-x-3">
            <div
              className="h-9 w-9 rounded-full border-2 border-white"
              style={{ background: 'linear-gradient(135deg, #C9D2DC, #9AA4B2)' }}
            />
            <div
              className="h-9 w-9 rounded-full border-2 border-white"
              style={{ background: 'linear-gradient(135deg, #9AA4B2, #6B7684)' }}
            />
            <div
              className="h-9 w-9 rounded-full border-2 border-white"
              style={{ background: 'linear-gradient(135deg, #E4E8EC, #9AA4B2)' }}
            />
          </div>

          <div className="flex flex-col">
            <span
              className="text-white"
              style={{ fontWeight: 600, fontSize: 'clamp(1rem, 1.6vw, 1.35rem)' }}
            >
              1500+
            </span>
            <div className="flex items-center gap-1 -mt-2">
              <div className="flex gap-0.5" style={{ color: '#FFD166' }}>
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i} style={{ fontSize: '0.85rem' }}>
                    {s}
                  </span>
                ))}
              </div>
              <span
                className="text-white/85"
                style={{ fontWeight: 400, fontSize: '0.8rem' }}
              >
                avaliações
              </span>
            </div>
          </div>
          </div>
        </div>

        {/* Tagline embaixo do bloco principal */}
        {/* O recuo de 12rem é quase metade de uma tela de celular — só entra
         * do md pra cima. */}
        <div
          className={`w-fit whitespace-nowrap text-[clamp(1.3rem,6.2vw,2.2rem)] text-white md:ml-48 md:text-[clamp(2.4rem,5.2vw,5rem)] ${MASCARA}`}
          style={{
            fontWeight: 450,
            letterSpacing: '-0.05em',
            lineHeight: 0.85,
          }}
        >
          <span className="block" data-anim="hero-linha">
            Saúde Bucal Avançada
          </span>
        </div>

        <div
          className={`w-fit whitespace-nowrap text-[clamp(1.3rem,6.2vw,2.2rem)] text-white md:text-[clamp(2.4rem,5.2vw,5rem)] ${MASCARA}`}
          style={{
            fontWeight: 450,
            letterSpacing: '-0.05em',
            lineHeight: 0.85,
          }}
        >
          <span className="block" data-anim="hero-linha">
            Sorriso Natural & Perfeito
          </span>
        </div>
      </div>
    </div>
    </div>

    {/* Segunda seção: "Sobre nós" pequeno e cinza claro, alinhado à
     * esquerda; ao lado, o headline grande em 3 linhas. Os dois começam
     * na mesma altura (items-start), e o gap entre as colunas controla
     * a distância entre "Sobre nós" e o início do headline. */}
    <section
      className="relative z-10 w-full px-[6%] py-24 md:py-32"
      style={{
        fontFamily: '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif',
        background:
          'radial-gradient(58.07% 106.14% at -1.32% 57.06%, #C9C9C9 0%, #FFF 54.81%, #FFF 100%)',
      }}
    >
      {/* Máscara de luz branca bem no canto superior esquerdo, suavizando a
       * divisão entre a seção 1 (vídeo) e a seção 2. */}
      <div
        className="pointer-events-none absolute -left-[6%] -top-1 z-0 h-72 w-72 md:h-[28rem] md:w-[28rem]"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 65%)',
        }}
      />

      <div
        data-bloco="s2-topo"
        className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-stretch md:gap-16 lg:gap-32"
      >
        {/* Traço curto antes do rótulo: marca a coluna sem pesar, e repete
         * como assinatura nos outros rótulos da seção. */}
        <span
          data-anim="s2-rotulo"
          className={`flex flex-shrink-0 items-center gap-3 whitespace-nowrap ${ROTULO}`}
          style={{ color: ROTULO_COR }}
        >
          <span aria-hidden className="h-px w-6" style={{ background: ROTULO_COR }} />
          Sobre nós
        </span>

        {/* Cada linha ganha a própria máscara para subir uma de cada vez */}
        {/* No celular o headline alinha à esquerda: empilhado embaixo do
         * "Sobre nós" (que é alinhado à esquerda), o texto à direita ficaria
         * solto no meio do nada. */}
        <h2
          className="flex-shrink-0 whitespace-nowrap text-left text-black md:text-right"
          style={TITULO}
        >
          {/* w-fit + ml-auto: a máscara abraça o texto (senão o xPercent:100
           * da animação mediria a largura do bloco todo) e continua colada
           * à direita, mantendo o alinhamento do headline. */}
          <span className={`w-fit md:ml-auto ${MASCARA}`}>
            <span className="block" data-anim="s2-linha">SEU SORRISO</span>
          </span>
          <span className={`w-fit md:ml-auto ${MASCARA}`}>
            <span className="block" data-anim="s2-linha">MERECE O MELHOR</span>
          </span>
          <span className={`w-fit md:ml-auto ${MASCARA}`}>
            <span className="block" data-anim="s2-linha">
              TRATAMENTO.{' '}
              <span
                className={`relative top-[0.20em] whitespace-nowrap ${ROTULO}`}
                style={{ color: ROTULO_COR }}
              >
                Denta Elite
              </span>
            </span>
          </span>
        </h2>

        {/* Foto ao lado do headline, tamanho fixo (não encolhe nem cresce) —
         * altura sempre igual à do bloco de texto (items-stretch no pai +
         * h-full aqui). Ajuste w-[...] pra mudar a largura fixa. */}
        <img
          src="https://res.cloudinary.com/dwmrunhxa/image/upload/v1785869122/ChatGPT_Image_4_de_ago._de_2026_15_44_41_mjzucf.png"
          alt=""
          data-anim="s2-foto"
          className={`h-56 w-full md:h-full md:w-64 md:flex-shrink-0 lg:w-80 ${FOTO}`}
        />
      </div>

      {/* Fio de cabelo separando os dois blocos — dá a pausa que antes só
       * existia como espaço vazio, e ancora a leitura na largura da seção. */}
      <div
        data-anim="s2-fio"
        className="relative z-10 mt-24 h-px w-full origin-left bg-black/[0.07] md:mt-32"
      />

      {/* Parágrafo (esquerda) + headline "bagunçado" (direita), lá embaixo,
       * bem depois da linha do "TRATAMENTO.". Ajuste mt-* pra afastar/
       * aproximar do bloco de cima. */}
      <div className="relative z-10 mt-14 flex flex-col items-start gap-10 md:mt-20 md:flex-row md:items-end md:justify-between">
        <p
          data-anim="s2-texto"
          className="max-w-none text-sm font-normal leading-[1.75] md:max-w-[15rem]"
          style={{ color: CORPO_COR }}
        >
          Combinamos tecnologia de ponta com atendimento personalizado para
          garantir uma experiência perfeita e agradável para cada paciente.
          Desde clareamento dental e ortodontia até implantes complexos,
          oferecemos não apenas resultados impecáveis, mas também um nível
          de conforto incomparável durante todo o processo.
        </p>

        {/* Headline "bagunçado": cada palavra/linha com um alinhamento
         * diferente (esquerda/centro/direita) pra preencher o espaço em
         * branco de forma assimétrica, mesmo tamanho de fonte do
         * "SEU SORRISO...". */}
        {/* No celular este bloco é uma pilha simples, tudo à esquerda. O
         * jogo de alinhamentos alternados precisa de largura sobrando dos
         * dois lados, e em 375px não sobra — vira colisão. Todo o desenho
         * bagunçado (self-end, foto flutuante, rótulo ao lado) mora atrás
         * de md:; no celular fica a leitura limpa. */}
        <div
          className="relative flex w-full flex-col text-black md:w-auto md:mr-[10%]"
          style={TITULO}
        >
          <span className={`self-start ${MASCARA}`}>
            <span className="block" data-anim="s2-linha2">EXPERIMENTE</span>
          </span>

          <span className={`self-start md:self-end ${MASCARA}`}>
            <span className="block" data-anim="s2-linha2">A ARTE</span>
          </span>
          <span className={`self-start md:self-end ${MASCARA}`}>
            <span className="block" data-anim="s2-linha2">DA</span>
          </span>
          <span className={`self-start ${MASCARA}`}>
            <span className="block" data-anim="s2-linha2">ODONTOLOGIA</span>
          </span>
          {/* A máscara envolve só o texto: o rótulo fica fora dela, senão o
           * overflow-hidden cortaria ele (mora à esquerda, em right-full). */}
          <span className="relative self-start md:self-end">
            <span className={MASCARA}>
              <span className="block" data-anim="s2-linha2">DE LUXO</span>
            </span>
            {/* Em fluxo no celular, logo abaixo de "DE LUXO". Do md pra cima
             * volta a flutuar ao lado, com leading-[1.9] casando as duas
             * linhas com a altura da palavra grande. */}
            <span
              data-anim="s2-rotulo2"
              className={`mt-2 block leading-[1.5] md:absolute md:right-full md:top-1/2 md:mr-6 md:mt-0 md:-translate-y-1/2 md:whitespace-nowrap md:text-right md:leading-[1.9] ${ROTULO}`}
              style={{ color: ROTULO_COR }}
            >
              Profissionais
              <br />
              credenciados
            </span>
          </span>

          {/* Última no DOM por causa do celular: ali ela fecha a pilha sem
           * atravessar nada. Do md pra cima vira absolute, sai do fluxo e a
           * ordem no DOM deixa de importar — volta a flutuar por cima do
           * texto exatamente como antes. */}
          <img
            src="https://res.cloudinary.com/dwmrunhxa/image/upload/v1785870302/ChatGPT_Image_4_de_ago._de_2026_16_04_37_j5yag0.png"
            alt=""
            data-anim="s2-foto2"
            className={`pointer-events-none z-10 mt-8 h-28 w-44 self-start md:absolute md:left-0 md:top-[1.2em] md:mt-0 md:h-32 md:w-52 ${FOTO}`}
          />
        </div>
      </div>
    </section>

    {/* O vão que descobre o piso. Ele é transparente e não tem fundo
     * próprio: rolar até aqui simplesmente tira a seção 2 da frente e o
     * que aparece é a seção 3, que esteve fixa atrás o tempo todo.
     *
     * pointer-events-none é obrigatório: por vir depois do piso no DOM,
     * este vão é pintado por cima dele e engoliria os cliques do acordeão. */}
    <div data-bloco="vao" className="pointer-events-none relative h-screen" />

    {/* Quarta seção: a equipe. Sobe por cima do piso fixo igual a seção 2
     * fez — mesma gramática de revelação, agora no sentido de "cobrir" de
     * volta. Precisa de fundo opaco e z-10 por isso. */}
    <section
      data-bloco="s4"
      className="relative z-10 w-full px-[6%] py-28 md:py-36"
      style={{
        fontFamily: '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif',
        background:
          'radial-gradient(58.07% 106.14% at -1.32% 57.06%, #C9C9C9 0%, #FFF 54.81%, #FFF 100%)',
      }}
    >
      {/* Cabeçalho: rótulo à esquerda, headline à direita — mesma
       * diagramação da seção 2, pra ler como a mesma peça. */}
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <span
            data-anim="s4-fio"
            className="block h-px w-10 origin-left bg-black/25"
          />
          <span data-anim="s4-rotulo" className={ROTULO} style={{ color: ROTULO_COR }}>
            Nossa equipe
          </span>
        </div>

        <h2 className="text-left text-black md:text-right" style={TITULO}>
          {/* w-fit + md:ml-auto: a máscara abraça o texto (o xPercent da
           * animação mede a própria largura) sem perder o alinhamento. */}
          <span className={`w-fit md:ml-auto ${MASCARA}`}>
            <span className="block" data-anim="s4-linha">QUEM CUIDA</span>
          </span>
          <span className={`w-fit md:ml-auto ${MASCARA}`}>
            <span className="block" data-anim="s4-linha">DO SEU SORRISO</span>
          </span>
        </h2>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 md:mt-28 md:grid-cols-3">
        {PROFISSIONAIS.map((pessoa) => (
          <article key={pessoa.nome} className={pessoa.desloco}>
            {/* A moldura leva a cortina; a foto dentro leva o zoom e a cor.
             * Separar os dois é o que permite a imagem "assentar" enquanto
             * a cortina desce, em vez de simplesmente aparecer. */}
            <div
              data-anim="s4-moldura"
              className="overflow-hidden rounded-[1.5rem] ring-1 ring-black/5"
              style={{ aspectRatio: pessoa.proporcao }}
            >
              <img
                src={pessoa.foto}
                alt={pessoa.nome}
                data-anim="s4-foto"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-5 border-t border-black/10 pt-4">
              <h3
                data-anim="s4-nome"
                className="text-black"
                style={{
                  fontWeight: 480,
                  letterSpacing: '-0.03em',
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.35rem)',
                  lineHeight: 1.1,
                }}
              >
                {pessoa.nome}
              </h3>

              <p data-anim="s4-nome" className="mt-1.5 text-sm" style={{ color: CORPO_COR }}>
                {pessoa.cargo}
              </p>

              <span
                data-anim="s4-nome"
                className={`mt-3 block ${ROTULO}`}
                style={{ color: ROTULO_COR }}
              >
                {pessoa.registro}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* Quinta seção: consultoria gratuita. Duas colunas — a esquerda
     * argumenta, a direita coleta. */}
    <section
      data-bloco="s5"
      className="relative z-10 w-full px-[6%] pb-28 pt-16 md:pb-36 md:pt-24"
      style={{
        fontFamily: '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif',
        background:
          'radial-gradient(58.07% 106.14% at -1.32% 57.06%, #C9C9C9 0%, #FFF 54.81%, #FFF 100%)',
      }}
    >
      {/* items-start: as duas colunas começam na mesma altura em vez de a
       * esquerda centralizar sozinha quando o formulário cresce. */}
      <div className="flex flex-col items-start gap-14 md:flex-row md:justify-between md:gap-20">
        <div className="w-full md:max-w-[26rem]">
          <div className="flex items-center gap-3">
            <span data-anim="s5-fio" className="block h-px w-10 origin-left bg-black/25" />
            <span data-anim="s5-rotulo" className={ROTULO} style={{ color: ROTULO_COR }}>
              Consultoria gratuita
            </span>
          </div>

          <h2 className="mt-7 text-black" style={TITULO}>
            <span className={`w-fit ${MASCARA}`}>
              <span className="block" data-anim="s5-linha">AGENDE SUA</span>
            </span>
            <span className={`w-fit ${MASCARA}`}>
              <span className="block" data-anim="s5-linha">PRIMEIRA VISITA</span>
            </span>
          </h2>

          <p
            data-anim="s5-texto"
            className="mt-7 max-w-[24rem] text-sm leading-relaxed md:text-base"
            style={{ color: CORPO_COR }}
          >
            A primeira avaliação é por nossa conta. Conversamos sobre o que te
            incomoda, fazemos o diagnóstico e desenhamos o plano — sem
            compromisso de fechar nada.
          </p>

          <div data-anim="s5-texto" className="mt-9 space-y-1">
            <span className={`block ${ROTULO}`} style={{ color: ROTULO_COR }}>
              Ou fale direto
            </span>
            <a
              href={`mailto:${EMAIL_CONTATO}`}
              className="text-black underline decoration-black/20 underline-offset-4 transition-colors hover:decoration-black/60"
              style={{ fontWeight: 450, letterSpacing: '-0.02em' }}
            >
              {EMAIL_CONTATO}
            </a>
          </div>
        </div>

        {/* Campos sem caixa, só o fio embaixo: mesma linguagem dos fios que
         * separam os blocos no resto da página. */}
        <form onSubmit={enviar} className="w-full md:max-w-[30rem]">
          {CAMPOS.map((campo) => (
            <label key={campo.id} data-anim="s5-campo" className="mb-8 block">
              <span className={`block ${ROTULO}`} style={{ color: ROTULO_COR }}>
                {campo.rotulo}
              </span>
              <input
                type={campo.tipo}
                required
                value={formulario[campo.id]}
                onChange={alterarCampo(campo.id)}
                placeholder={campo.dica}
                className="mt-3 w-full border-b border-black/15 bg-transparent pb-3 text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/60"
                style={{ fontWeight: 450, letterSpacing: '-0.02em' }}
              />
            </label>
          ))}

          <label data-anim="s5-campo" className="mb-10 block">
            <span className={`block ${ROTULO}`} style={{ color: ROTULO_COR }}>
              O que você procura
            </span>
            <textarea
              rows={3}
              value={formulario.mensagem}
              onChange={alterarCampo('mensagem')}
              placeholder="Conte um pouco sobre o seu caso"
              className="mt-3 w-full resize-none border-b border-black/15 bg-transparent pb-3 text-black outline-none transition-colors placeholder:text-black/25 focus:border-black/60"
              style={{ fontWeight: 450, letterSpacing: '-0.02em' }}
            />
          </label>

          <button
            data-anim="s5-campo"
            type="submit"
            className="group flex w-full items-center justify-between gap-6 rounded-full bg-black px-7 py-4 text-white transition-transform hover:scale-[1.02] active:scale-100"
          >
            <span className="text-xs font-medium uppercase tracking-[0.14em]">
              Solicitar consultoria
            </span>
            <ArrowUpRight
              className="h-5 w-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
              strokeWidth={1.5}
            />
          </button>
        </form>
      </div>
    </section>

    {/* Rodapé */}
    <footer
      data-bloco="rodape"
      className="relative z-10 w-full overflow-hidden px-[6%] pt-16"
      style={{
        fontFamily: '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif',
        background:
          'radial-gradient(58.07% 106.14% at -1.32% 57.06%, #C9C9C9 0%, #FFF 54.81%, #FFF 100%)',
      }}
    >
      <div className="flex flex-col gap-10 border-t border-black/10 pt-10 sm:flex-row sm:justify-between">
        {[
          { titulo: 'Contato', itens: [EMAIL_CONTATO, '+55 11 4000-0000'] },
          { titulo: 'Endereço', itens: ['Rua dos Pinheiros, 1024', 'São Paulo — SP'] },
          { titulo: 'Social', itens: ['Instagram', 'LinkedIn'] },
        ].map((coluna) => (
          <div key={coluna.titulo} data-anim="rodape-col">
            <span className={`block ${ROTULO}`} style={{ color: ROTULO_COR }}>
              {coluna.titulo}
            </span>
            <ul className="mt-3 space-y-1.5">
              {coluna.itens.map((item) => (
                <li key={item} className="text-sm" style={{ color: CORPO_COR }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Wordmark gigante. O tamanho é em vw para a palavra atravessar a
       * largura em qualquer tela — em rem ela sobraria no desktop e
       * estouraria no celular. leading apertado + o overflow-hidden do
       * invólucro cortam a folga da fonte, encostando a palavra na base. */}
      <div className="mt-16 overflow-hidden">
        <span
          data-anim="rodape-marca"
          className="block w-full text-center text-black"
          style={{
            fontSize: '30vw',
            fontWeight: 480,
            letterSpacing: '-0.055em',
            lineHeight: 0.78,
          }}
        >
          DENTA
        </span>
      </div>

      <div className="flex flex-col gap-2 border-t border-black/10 py-6 sm:flex-row sm:justify-between">
        <span className="text-xs" style={{ color: ROTULO_COR }}>
          © {new Date().getFullYear()} Denta Elite. Todos os direitos reservados.
        </span>
        <span className="text-xs" style={{ color: ROTULO_COR }}>
          CRO-SP 12.345
        </span>
      </div>
    </footer>
    </div>
  );
}
