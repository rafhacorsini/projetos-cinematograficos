import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('public');
const outputDir = path.resolve('public/frames-transparent');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.startsWith('ezgif-frame-') && f.endsWith('.png')).sort();

console.log(`Iniciando remoção de fundo transparente para ${files.length} frames...`);

async function processFrame(file, index) {
  const inputPath = path.join(inputDir, file);
  const frameIndex = String(index + 1).padStart(3, '0');
  const outputPath = path.join(outputDir, `frame-${frameIndex}.webp`);

  const { data, info } = await sharp(inputPath)
    .resize({ width: 1920, fit: 'inside', withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = new Uint8ClampedArray(data);

  // Algoritmo de Chromakey Inteligente para remover fundo claro/azul do céu
  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    // Detectar pixels do fundo claro azulado (Céu/Studio)
    // Red entre 110-180, Green entre 130-200, Blue entre 160-235
    const isSky = (
      r > 105 && g > 130 && b > 155 &&
      b >= r && b >= g - 20 &&
      Math.abs(r - g) < 45
    );

    if (isSky) {
      // Calcular suavização de bordas (feathering/alpha thresholding)
      const brightness = (r + g + b) / 3;
      if (brightness > 160) {
        pixelData[i + 3] = 0; // 100% Transparente
      } else {
        // Transição suave nas bordas
        const alpha = Math.max(0, Math.min(255, Math.round((160 - brightness) * 4)));
        pixelData[i + 3] = alpha;
      }
    }
  }

  await sharp(pixelData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    }
  })
    .webp({ quality: 85, effort: 4, alphaQuality: 90 })
    .toFile(outputPath);

  const newSize = fs.statSync(outputPath).size;
  console.log(`[${index + 1}/${files.length}] ${file} -> frame-${frameIndex}.webp (Transparente, ${(newSize / 1024).toFixed(1)} KB)`);
}

async function runAll() {
  for (let i = 0; i < files.length; i++) {
    await processFrame(files[i], i);
  }
  console.log('Remoção de fundo concluída!');
}

runAll().catch(console.error);
