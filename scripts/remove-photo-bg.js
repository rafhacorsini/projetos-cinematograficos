import sharp from 'sharp';
import path from 'path';

async function removeBackground() {
  const inputPath = path.resolve('public/bg-scene1-distant.jpg');
  const outputPath = path.resolve('public/bg-scene1-transparent.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = new Uint8ClampedArray(data.buffer);

  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    // Identifica o fundo claro do estúdio (tons de cinza claro/branco)
    if (r > 210 && g > 208 && b > 208) {
      const avg = (r + g + b) / 3;
      if (avg > 232) {
        pixelData[i + 3] = 0; // 100% transparente
      } else {
        const factor = (232 - avg) / (232 - 210);
        pixelData[i + 3] = Math.round(Math.max(0, Math.min(255, factor * 255)));
      }
    }
  }

  await sharp(pixelData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath);

  console.log('Fundo da foto removido com sucesso -> public/bg-scene1-transparent.png');
}

removeBackground().catch(console.error);
