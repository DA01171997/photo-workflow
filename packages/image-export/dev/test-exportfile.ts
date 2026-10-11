import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { exportImage } from '../src/index.js';
import { join, parse } from 'node:path';

async function main(): Promise<void> {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: pnpm dev:test <image-path>');
    process.exitCode = 1;
    return;
  }

  let data: Uint8Array;
  try {
    data = await readFile(filePath);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return;
  }

  const result = await exportImage({
    data,
    options: {
      width: 1080,
      height: 1350,
      fit: 'contain',
      backgroundColor: '#ffffff',
      compressionQuality: 85,
      upscaling: false,
    },
  });

  const { name } = parse(filePath);
  const outputFilePath = join('./dist', `${name}-modified.jpg`);

  await mkdir('./dist', { recursive: true });
  await writeFile('./dist/photosweet-export.jpg', result.data);
  await writeFile(outputFilePath, result.data);
  console.log('Modified export completed:', {
    width: result.width,
    height: result.height,
    bytes: result.data.length,
    location: outputFilePath,
  });
}

await main();