/* Onde o anel realmente fica dentro dos 900x991 de cada frame?
   Serve para o canvas enquadrar pela caixa do anel, e não pela do arquivo —
   senão ele desenha pequeno, descentralizado e balançando durante o scrub. */
import fs from 'fs';
import sharp from 'sharp';

const arquivos = fs.readdirSync('public/ring-frames')
  .filter((f) => f.endsWith('.webp')).sort();

let uniaoMinX = Infinity, uniaoMaxX = -Infinity;
let uniaoMinY = Infinity, uniaoMaxY = -Infinity;
const centros = [];
let W = 0, H = 0;

for (const arq of arquivos) {
  const { data, info } = await sharp(`public/ring-frames/${arq}`)
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  W = info.width; H = info.height;
  let minX = W, maxX = -1, minY = H, maxY = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * info.channels + 3] > 25) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  centros.push({ arq, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, l: maxX - minX, a: maxY - minY });
  uniaoMinX = Math.min(uniaoMinX, minX); uniaoMaxX = Math.max(uniaoMaxX, maxX);
  uniaoMinY = Math.min(uniaoMinY, minY); uniaoMaxY = Math.max(uniaoMaxY, maxY);
}

const cxs = centros.map((c) => c.cx), cys = centros.map((c) => c.cy);
console.log(`quadro do arquivo: ${W}x${H}`);
console.log(`união do anel: x ${uniaoMinX}..${uniaoMaxX}  y ${uniaoMinY}..${uniaoMaxY}  ` +
  `(${uniaoMaxX - uniaoMinX} x ${uniaoMaxY - uniaoMinY})`);
console.log(`  ocupa ${(100 * (uniaoMaxX - uniaoMinX) / W).toFixed(0)}% da largura e ` +
  `${(100 * (uniaoMaxY - uniaoMinY) / H).toFixed(0)}% da altura do arquivo`);
console.log(`\ndeslocamento do centro do anel entre frames:`);
console.log(`  x: ${Math.min(...cxs).toFixed(0)} a ${Math.max(...cxs).toFixed(0)} ` +
  `(amplitude ${(Math.max(...cxs) - Math.min(...cxs)).toFixed(0)}px)`);
console.log(`  y: ${Math.min(...cys).toFixed(0)} a ${Math.max(...cys).toFixed(0)} ` +
  `(amplitude ${(Math.max(...cys) - Math.min(...cys)).toFixed(0)}px)`);
console.log(`\ntamanho do anel: largura ${Math.min(...centros.map(c=>c.l))} a ${Math.max(...centros.map(c=>c.l))}, ` +
  `altura ${Math.min(...centros.map(c=>c.a))} a ${Math.max(...centros.map(c=>c.a))}`);
console.log(`\nconstante sugerida p/ o componente:`);
console.log(`const CAIXA_ANEL = { x: ${uniaoMinX}, y: ${uniaoMinY}, ` +
  `l: ${uniaoMaxX - uniaoMinX}, a: ${uniaoMaxY - uniaoMinY} };`);
