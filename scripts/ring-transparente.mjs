/* Remove o fundo dos frames do anel e grava WebP com alfa.
 *
 * O caso é favorável: anel quase preto sobre fundo cinza claro. O histograma
 * mostra separação limpa (no frame 051 não há nenhum pixel entre luminância
 * 110 e 199), então uma chave de luminância resolve — sem precisar de modelo.
 *
 * Uso:
 *   node scripts/ring-transparente.mjs --teste   (3 frames + prévia sobre escuro)
 *   node scripts/ring-transparente.mjs           (os 102)
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const DIR_ENTRADA = 'C:/Users/Rafhael/Downloads/ezgif-3c0c8299495abd61-jpg';
const DIR_SAIDA = path.resolve('public/ring-frames');
const DIR_PREVIA = path.resolve('scripts/_previa-ring');

/* Até onde a inundação considera "fundo". Precisa ficar abaixo do núcleo da
   sombra de contato, medido em ~137, senão sobra um retalho cinza colado na
   base do anel. Fica seguro porque o histograma não tem nada entre 110 e
   199: acima deste valor só existe fundo, sombra e borda. */
/* Inundação agressiva: fica abaixo do núcleo da sombra de contato (medido em
   ~137) para levá-la junto. Sozinha ela também morde os vãos entre as
   ranhuras brilhantes da silhueta — quem conserta isso é o fechamento
   morfológico logo abaixo. */
const LIMIAR_FUNDO = 125;

/* Raio do fechamento que reconstrói as ranhuras. Os vãos entre elas têm
   poucos pixels de largura e são selados; a sombra tem mais de cem pixels
   de largura e continua removida. É a largura, não o brilho, que separa
   os dois casos. */
const RAIO_FECHAMENTO = 4;

/* Espessura máxima de barreira escura que a inundação consegue atravessar
   para alcançar retalhos de sombra presos contra a base do anel. */
const RAIO_TRAVESSIA = 2;

/* Faixa de transição da borda, abaixo do limiar da inundação: é o que
   preserva o antialiasing da silhueta. */
const LUM_OPACO = 55;
const LUM_TRANSPARENTE = 125;

/* Recorte comum a todos os frames, medido pelo script de análise
   (bounding box do anel em todos os 102), com folga de segurança. */
const CORTE = { esquerda: 700, topo: 130, largura: 1190, altura: 1310 };

/* Largura final. O anel recortado ocupa o quadro inteiro, então 900px aqui
   rende mais detalhe que os 2560px originais rendiam no anel. */
const LARGURA_SAIDA = 900;

const modoTeste = process.argv.includes('--teste');
const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

/* O nível do fundo muda de frame para frame (medido: 209 a 227), então é
   estimado por frame pela mediana das bordas em vez de fixado. */
function estimarFundo(data, W, H, C) {
  const amostras = [];
  for (let x = 0; x < W; x += 11) {
    for (const y of [2, 3, H - 3, H - 2]) {
      const i = (y * W + x) * C;
      amostras.push(lum(data[i], data[i + 1], data[i + 2]));
    }
  }
  for (let y = 0; y < H; y += 11) {
    for (const x of [2, 3, W - 3, W - 2]) {
      const i = (y * W + x) * C;
      amostras.push(lum(data[i], data[i + 1], data[i + 2]));
    }
  }
  amostras.sort((a, b) => a - b);
  return amostras[amostras.length >> 1];
}

/* Marca como fundo tudo que é claro E alcançável a partir da borda da
   imagem. A distinção importa: a sombra do anel é clara e encostada na
   borda, então entra; já um reflexo claro no interior do anel está cercado
   de pixels escuros, a inundação não chega nele e ele continua opaco.
   Um limiar simples de luminância não separaria esses dois casos. */
function inundarFundo(px, W, H, nivelFundo) {
  const claro = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) {
    claro[p] = lum(px[p * 4], px[p * 4 + 1], px[p * 4 + 2]) >= LIMIAR_FUNDO ? 1 : 0;
  }

  /* A inundação percorre uma versão dilatada da máscara de claros, e não ela
     própria. Motivo: retalhos da sombra de contato ficam isolados do fundo
     por uma linha escura de poucos pixels da borda do anel, e a inundação
     crua não atravessa — sobra um retângulo cinza colado na base. Dilatar
     costura essas barreiras finas. O corpo do anel tem dezenas de pixels de
     espessura, então continua intransponível e o furo segue protegido. */
    const transitavel = dilatar(claro, W, H, RAIO_TRAVESSIA);

  const alcancado = new Uint8Array(W * H);
  const pilha = new Int32Array(W * H);
  let topo = 0;

  const semear = (p) => {
    if (!alcancado[p] && transitavel[p]) { alcancado[p] = 1; pilha[topo++] = p; }
  };

  for (let x = 0; x < W; x++) { semear(x); semear((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { semear(y * W); semear(y * W + W - 1); }

  while (topo > 0) {
    const p = pilha[--topo];
    const x = p % W;
    const y = (p / W) | 0;
    if (x > 0) semear(p - 1);
    if (x < W - 1) semear(p + 1);
    if (y > 0) semear(p - W);
    if (y < H - 1) semear(p + W);
  }

  /* Interseção com a máscara original: a dilatação serviu só para atravessar
     as barreiras, não para dar à inundação o direito de apagar pixel escuro. */
  const ehFundo = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) ehFundo[p] = alcancado[p] & claro[p];
  return ehFundo;
}

/* Dilatação e erosão em passadas separadas por eixo — mesmo resultado de um
   kernel quadrado, com custo linear no raio em vez de quadrático. */
function morfologia(origem, W, H, raio, juntar) {
  const max = juntar === 'max';
  const meio = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let v = max ? 0 : 1;
      for (let d = -raio; d <= raio; d++) {
        const nx = x + d;
        if (nx < 0 || nx >= W) continue;
        const s = origem[y * W + nx];
        v = max ? (v | s) : (v & s);
      }
      meio[y * W + x] = v;
    }
  }
  const fim = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let v = max ? 0 : 1;
      for (let d = -raio; d <= raio; d++) {
        const ny = y + d;
        if (ny < 0 || ny >= H) continue;
        const s = meio[ny * W + x];
        v = max ? (v | s) : (v & s);
      }
      fim[y * W + x] = v;
    }
  }
  return fim;
}

const dilatar = (m, W, H, r) => morfologia(m, W, H, r, 'max');

/* Fechamento morfológico (dilata e depois erode) sobre o anel.
   Sela vãos mais estreitos que 2*raio e devolve as ranhuras que a inundação
   agressiva comeu, sem trazer de volta a sombra, que é larga demais. */
function fecharAnel(ehFundo, W, H, raio) {
  const frente = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) frente[p] = ehFundo[p] ? 0 : 1;
  const fechado = morfologia(dilatar(frente, W, H, raio), W, H, raio, 'min');
  for (let p = 0; p < W * H; p++) ehFundo[p] = fechado[p] ? 0 : 1;
}

/* O furo do anel também é fundo, mas a inundação da borda não chega nele:
   está cercado pelo anel. Aqui varro as regiões claras que sobraram e
   promovo a fundo as que se parecem com o fundo de verdade — grandes e com
   luminância média perto da dele. O critério separa o furo dos reflexos
   especulares do anel, que são pequenos e mais escuros que o fundo.
   Devolve também os diagnósticos, para eu conferir que a separação é
   limpa em vez de confiar no número escolhido. */
function promoverBuracos(px, W, H, ehFundo, nivelFundo) {
  const limiteClaro = LIMIAR_FUNDO;
  const visitado = new Uint8Array(W * H);
  const pilha = new Int32Array(W * H);
  const componentes = [];

  const claro = (p) => lum(px[p * 4], px[p * 4 + 1], px[p * 4 + 2]) >= limiteClaro;

  for (let inicio = 0; inicio < W * H; inicio++) {
    if (ehFundo[inicio] || visitado[inicio] || !claro(inicio)) continue;

    let topo = 0;
    pilha[topo++] = inicio;
    visitado[inicio] = 1;
    const membros = [];
    let somaLum = 0;
    let somaQuad = 0;

    while (topo > 0) {
      const p = pilha[--topo];
      membros.push(p);
      const l = lum(px[p * 4], px[p * 4 + 1], px[p * 4 + 2]);
      somaLum += l;
      somaQuad += l * l;
      const x = p % W;
      const y = (p / W) | 0;
      const tentar = (q) => {
        if (!visitado[q] && !ehFundo[q] && claro(q)) { visitado[q] = 1; pilha[topo++] = q; }
      };
      if (x > 0) tentar(p - 1);
      if (x < W - 1) tentar(p + 1);
      if (y > 0) tentar(p - W);
      if (y < H - 1) tentar(p + W);
    }

    /* Medido nos frames: o furo tem entre 69k e 204k pixels com média
       praticamente igual à do fundo (218/221, 208/211, 214/214), enquanto o
       maior reflexo do anel tem 2.468px. Com essa folga de ~28x, exigir
       10.000px e média perto do fundo separa os dois sem ambiguidade.
       O piso absoluto também protege o caso do anel de perfil, em que não
       há furo visível e o maior componente é só um reflexo. */
    const media = somaLum / membros.length;
    const desvio = Math.sqrt(Math.max(0, somaQuad / membros.length - media * media));

    /* Duas maneiras de ser fundo preso dentro do anel:
       - o furo: enorme e com média igual à do fundo;
       - retalho claro que uma linha fina escura isolou da inundação.
       A sombra de contato não entra aqui: quem cuida dela é a inundação
       agressiva mais o fechamento. Tentei também uma regra por variância
       ("liso = sombra"), mas ela apagava superfícies lisas legítimas do
       anel — o desvio do furo (9 a 15) se sobrepõe ao de partes do anel. */
    const ehFuroPrincipal = membros.length >= 10000 && media >= nivelFundo - 25;
    const ehRetalhoClaro = media >= nivelFundo - 35;
    const ehBuraco = ehFuroPrincipal || ehRetalhoClaro;
    componentes.push({
      tamanho: membros.length, media: Math.round(media),
      desvio: Math.round(desvio), ehBuraco,
    });
    if (ehBuraco) for (const p of membros) ehFundo[p] = 1;
  }

  componentes.sort((a, b) => b.tamanho - a.tamanho);
  return componentes.slice(0, 6);
}

/* Um pixel só recebe opacidade parcial se encostar no fundo — é ali que
   mora o antialiasing. Sem esse teste, qualquer pixel claro no meio do
   anel viraria semitransparente e abriria buraco. */
function encostaNoFundo(ehFundo, W, H, x, y) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      if (ehFundo[ny * W + nx]) return true;
    }
  }
  return false;
}

async function processar(arquivo, indice, total) {
  const entrada = path.join(DIR_ENTRADA, arquivo);

  const { data, info } = await sharp(entrada)
    .extract({
      left: CORTE.esquerda, top: CORTE.topo,
      width: CORTE.largura, height: CORTE.altura,
    })
    .resize({ width: LARGURA_SAIDA })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: W, height: H, channels: C } = info;
  const px = new Uint8ClampedArray(data);
  const fundo = estimarFundo(px, W, H, C);

  const ehFundo = inundarFundo(px, W, H, fundo);
  fecharAnel(ehFundo, W, H, RAIO_FECHAMENTO);
  const componentes = promoverBuracos(px, W, H, ehFundo, fundo);

  let opacos = 0;
  let parciais = 0;

  for (let p = 0; p < W * H; p++) {
    const i = p * 4;

    if (ehFundo[p]) {
      px[i + 3] = 0;
      continue;
    }

    const r = px[i], g = px[i + 1], b = px[i + 2];
    const l = lum(r, g, b);

    /* Fora da inundação: é anel. Só suaviza se estiver na fronteira e
       dentro da faixa de transição; o resto fica sólido, inclusive os
       reflexos claros do interior. */
    let a = 1;
    if (l > LUM_OPACO && encostaNoFundo(ehFundo, W, H, p % W, (p / W) | 0)) {
      a = l >= LUM_TRANSPARENTE
        ? 0
        : (LUM_TRANSPARENTE - l) / (LUM_TRANSPARENTE - LUM_OPACO);
    }

    if (a === 0) {
      px[i + 3] = 0;
      continue;
    }

    if (a === 1) {
      opacos++;
      px[i + 3] = 255;
      continue;
    }

    /* Pixel de borda: a cor gravada é uma mistura de anel e fundo claro.
       Se eu só baixasse o alfa, sobraria um halo claro em volta do anel
       quando ele fosse composto sobre a seção escura. Aqui desfaço a
       mistura — observado = a*anel + (1-a)*fundo, logo
       anel = (observado - (1-a)*fundo) / a. */
    parciais++;
    const desmisturar = (canal) => {
      const v = (canal - (1 - a) * fundo) / a;
      return Math.max(0, Math.min(255, v));
    };
    px[i] = desmisturar(r);
    px[i + 1] = desmisturar(g);
    px[i + 2] = desmisturar(b);
    px[i + 3] = Math.round(a * 255);
  }

  const cru = { raw: { width: W, height: H, channels: 4 } };
  const nome = `ring-${String(indice + 1).padStart(3, '0')}.webp`;

  await sharp(px, cru)
    .webp({ quality: 82, alphaQuality: 90, effort: 5 })
    .toFile(path.join(DIR_SAIDA, nome));

  if (modoTeste) {
    /* Prévia composta sobre a cor real da seção, que é onde o halo
       apareceria se a desmistura estivesse errada. */
    await sharp({
      create: { width: W, height: H, channels: 4, background: '#0f0f16' },
    })
      .composite([{ input: await sharp(px, cru).png().toBuffer() }])
      .png()
      .toFile(path.join(DIR_PREVIA, `sobre-escuro-${indice + 1}.png`));
  }

  const kb = (fs.statSync(path.join(DIR_SAIDA, nome)).size / 1024).toFixed(2);
  console.log(
    `[${indice + 1}/${total}] ${arquivo} -> ${nome}  ${W}x${H}  ${kb} KB  ` +
    `fundo=${Math.round(fundo)}  opacos=${opacos}  borda=${parciais}`,
  );
  if (modoTeste) {
    console.log('   regiões claras fechadas:', componentes
      .map((c) => `${c.tamanho}px m${c.media} dp${c.desvio}${c.ehBuraco ? ' -> FUNDO' : ''}`)
      .join(' | ') || 'nenhuma');
  }

  /* Rede de segurança para a rodada completa: em vez de conferir 102 frames
     a olho, sinalizo só o que ficar perto da fronteira de decisão. */
  const maiorNaoFuro = componentes.find((c) => !c.ehBuraco);
  if (maiorNaoFuro && maiorNaoFuro.tamanho > 6000) {
    console.warn(`   ATENÇÃO ${arquivo}: região clara de ${maiorNaoFuro.tamanho}px ` +
      `(média ${maiorNaoFuro.media}) ficou opaca — perto do limiar de furo`);
  }
  const furos = componentes.filter((c) => c.ehBuraco).length;
  if (furos > 1) {
    console.warn(`   ATENÇÃO ${arquivo}: ${furos} regiões viraram furo`);
  }
  return { kb: Number(kb), furos };
  return Number(kb);
}

async function main() {
  for (const dir of [DIR_SAIDA, DIR_PREVIA]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  const todos = fs.readdirSync(DIR_ENTRADA).filter((f) => f.endsWith('.jpg')).sort();
  const alvos = modoTeste
    ? [todos[0], todos[50], todos[101]]
    : todos;

  console.log(`${modoTeste ? 'TESTE: ' : ''}processando ${alvos.length} frames...`);

  let soma = 0;
  let semFuro = 0;
  for (let i = 0; i < alvos.length; i++) {
    const r = await processar(alvos[i], i, alvos.length);
    soma += r.kb;
    if (r.furos === 0) semFuro++;
  }

  console.log(`\nconcluído. total ${(soma / 1024).toFixed(2)} MB em ${alvos.length} frames`);
  console.log(`média ${(soma / alvos.length).toFixed(1)} KB/frame`);
  console.log(`frames sem furo detectado: ${semFuro} (esperado só nos de perfil)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
