/* Compõe frames já processados sobre a cor da seção, em contato,
   para auditar vários de uma vez. */
import sharp from 'sharp';

const indices = process.argv.slice(2).map(Number);
if (!indices.length) { console.error('uso: node scripts/previa-lote.mjs 20 32 85 90'); process.exit(1); }

const LARG = 420;
const partes = [];
for (const n of indices) {
  const arq = `public/ring-frames/ring-${String(n).padStart(3, '0')}.webp`;
  partes.push(await sharp(arq).resize({ width: LARG }).png().toBuffer());
}
const meta = await sharp(partes[0]).metadata();
const alt = meta.height;

await sharp({
  create: { width: LARG * partes.length, height: alt, channels: 4, background: '#0f0f16' },
})
  .composite(partes.map((input, i) => ({ input, left: i * LARG, top: 0 })))
  .png()
  .toFile('scripts/_previa-ring/lote.png');

console.log(`lote.png: frames ${indices.join(', ')}  (${LARG * partes.length}x${alt})`);
