import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function inspectImages() {
  const files = fs.readdirSync('public').filter(f => f.startsWith('ezgif-frame-')).sort();
  console.log(`Analisando ${files.length} frames na pasta public...`);

  for (let f of files) {
    const image = sharp(path.join('public', f));
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
    let nonBgPixels = 0;

    for (let y = 0; y < info.height; y += 4) {
      for (let x = 0; x < info.width; x += 4) {
        const idx = (y * info.width + x) * info.channels;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        
        // Pixel de contraste em relação ao fundo claro da imagem
        if (r < 110 || g < 130 || b < 160) {
          nonBgPixels++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    console.log(`${f} | Dim: ${info.width}x${info.height} | Pixels Objeto: ${nonBgPixels} | Bounds: X[${minX}..${maxX}] Y[${minY}..${maxY}]`);
  }
}

inspectImages().catch(console.error);
