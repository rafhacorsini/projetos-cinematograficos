/* Verificação final dos 102 frames processados.
   Procura o que sobrou de errado, sem depender de inspeção visual:
   - pixels opacos claros demais para um anel preto (resto de fundo);
   - furo do anel que tenha ficado tapado;
   - variação brusca de área entre frames vizinhos (recorte instável). */
import fs from 'fs';
import sharp from 'sharp';

const arquivos = fs.readdirSync('public/ring-frames')
  .filter((f) => f.endsWith('.webp')).sort();

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const linhas = [];

for (const arq of arquivos) {
  const { data, info } = await sharp(`public/ring-frames/${arq}`)
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  let opacos = 0, clarosOpacos = 0, transparentes = 0;
  for (let p = 0; p < W * H; p++) {
    const i = p * C;
    const a = data[i + 3];
    if (a < 20) { transparentes++; continue; }
    opacos++;
    if (lum(data[i], data[i + 1], data[i + 2]) > 170) clarosOpacos++;
  }
  linhas.push({
    arq, opacos, clarosOpacos,
    pctClaros: (100 * clarosOpacos / opacos),
    pctTransp: (100 * transparentes / (W * H)),
  });
}

const areas = linhas.map((l) => l.opacos);
const saltos = areas.slice(1).map((a, i) => Math.abs(a - areas[i]) / areas[i] * 100);

console.log(`frames verificados: ${linhas.length}`);
console.log(`\ntransparência: ${Math.min(...linhas.map(l => l.pctTransp)).toFixed(1)}% a ` +
  `${Math.max(...linhas.map(l => l.pctTransp)).toFixed(1)}% da área ` +
  `(se algum frame estivesse sem recorte, ficaria perto de 0%)`);

const piores = [...linhas].sort((a, b) => b.pctClaros - a.pctClaros).slice(0, 5);
console.log('\nresíduo claro (pixels opacos com luminância > 170, em % da área do anel):');
for (const l of piores) {
  console.log(`  ${l.arq}  ${l.pctClaros.toFixed(2)}%  (${l.clarosOpacos}px)`);
}
console.log(`  média geral: ${(linhas.reduce((s, l) => s + l.pctClaros, 0) / linhas.length).toFixed(2)}%`);

console.log(`\nmaior salto de área entre frames vizinhos: ${Math.max(...saltos).toFixed(1)}% ` +
  `(salto grande indicaria recorte instável na animação)`);
