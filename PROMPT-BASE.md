# Prompt base — sites de produto com scroll animado

Cole o bloco abaixo no início de um projeto novo, em qualquer IDE com IA.
Ele só monta a fundação: stack, encanamento do scroll e regras de trabalho.
Conteúdo (referência, assets, textos, seções) entra depois.

---

## O prompt

````
Vamos montar a base de um site de produto com scroll animado. Só a fundação
agora — nada de conteúdo, seções ou textos ainda.

## Stack

- Vite + React 18 (JavaScript, sem TypeScript)
- Tailwind CSS 3.4
- GSAP 3.12 + ScrollTrigger — toda animação passa por aqui
- Lenis — scroll suave, sincronizado com o GSAP
- lucide-react — ícones
- sharp (devDependency) — tratamento de imagem em scripts, fora do runtime

Instale e configure. Tailwind com PostCSS, `content` cobrindo ./index.html
e ./src/**/*.{js,jsx}.

## Encanamento do scroll

Crie `src/components/SmoothScroll.jsx`: um componente que envolve a
aplicação, inicia o Lenis e o conecta ao GSAP. Três ligações obrigatórias,
nessa ordem:

1. `lenis.on('scroll', ScrollTrigger.update)`
2. o `raf` do Lenis rodando dentro do `gsap.ticker` (e não num
   requestAnimationFrame próprio, senão os dois disputam o frame)
3. `gsap.ticker.lagSmoothing(0)`

Limpe tudo no unmount: remova do ticker e destrua a instância do Lenis.

## Estrutura de arquivos

- Uma seção por arquivo (`HeroSection.jsx`, `FeatureSection.jsx`...).
  Uma página que só compõe as seções em ordem.
- Não junte várias seções num arquivo só. Além de ler melhor, limita o
  estrago quando algo sobrescreve um componente.

## Regras de animação

- Toda animação dentro de `gsap.context(() => {...}, refDaSecao)` e
  `ctx.revert()` na limpeza do effect. Sem exceção — é o que faz o
  StrictMode e o hot-reload não deixarem tweens órfãos.
- Prefira `gsap.from` a `gsap.set` + `gsap.to`. Se o JS falhar ou demorar,
  o conteúdo fica visível em vez de invisível.
- Em `scrub`, use `gsap.quickSetter`/`quickTo` para escrever a cada frame.
  Criar tween por frame engasga.
- Respeite `prefers-reduced-motion: reduce`: pule as animações e deixe o
  estado final aplicado.
- Entradas disparadas por scroll levam `once: true`. Reanimar toda vez que
  o elemento reaparece é o tique mais óbvio de site gerado.

## Armadilhas (todas já custaram retrabalho)

1. `overflow-x-hidden` no `<body>` ou num wrapper transforma o elemento em
   contêiner de scroll e QUEBRA `position: sticky` nos descendentes. Para
   prender algo no topo use `position: fixed` com espaçador, ou o `pin` do
   ScrollTrigger — os dois ignoram isso.

2. Nunca centralize com `transform: translate(-50%,-50%)` num elemento cujo
   transform o GSAP também vai animar. O GSAP relê o transform existente em
   pixels e soma com o que você pedir; no remount do StrictMode isso dobra
   o deslocamento. Centralize por flex/grid e deixe o transform livre.

3. Mudança no `tailwind.config.js` exige reiniciar o dev server. O
   hot-reload não relê o config, e a classe nova simplesmente não existe.

4. Com `pin`, o ScrollTrigger fixa width/height no elemento pinado. Se você
   dimensiona um canvas a partir dele, remeça também no evento `refresh` do
   ScrollTrigger — só o listener de `resize` lê valores velhos.

5. Em `srcset`, transformações de CDN separadas por vírgula quebram a lista
   (vírgula é o separador de candidatos). Na Cloudinary, encadeie com barra:
   `w_1440/e_sharpen:60/f_auto/q_auto`.

## Como quero que você trabalhe

- Meça antes de decidir. Se existe um site de referência, inspecione o DOM
  dele e copie os valores reais em vez de estimar. Se é uma imagem,
  amostre os pixels.
- Verifique no navegador depois de cada mudança, lendo o DOM — não confie
  em "deve ter funcionado". Screenshot não prova alinhamento; medida prova.
- Comente o PORQUÊ das decisões não óbvias, principalmente número mágico
  (por que 0.36 e não 0.5) e contorno de armadilha. Não comente o óbvio.
- Português nos nomes e comentários, seguindo o resto do código.
- Se algo ficar ambíguo e as leituras levarem a resultados diferentes,
  pergunte antes de construir.

Monte isso e me diga o que ficou pronto. Não invente conteúdo.
````

---

## O que deixei de fora de propósito

**Framer Motion** — sobrepõe o GSAP. Escolha um; para scroll o ScrollTrigger
ganha com folga.

**TypeScript** — vale em produto que dura. Em site de campanha, o atrito de
tipar refs e alvos de GSAP não se paga.

**Biblioteca de componentes** (shadcn, MUI) — este tipo de site é layout
sob medida. Componente pronto atrapalha mais do que ajuda.

**Next.js** — só se precisar de SEO ou rotas de verdade. Vite sobe mais
rápido e não tem pegadinha de server component com animação.
