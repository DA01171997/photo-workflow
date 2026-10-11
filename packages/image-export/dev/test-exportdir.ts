import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { exportImage } from '../src/index.js';
import { join, parse } from 'node:path';
import { readdirSync } from 'node:fs';
import sharp from 'sharp';

interface Output {
  error?: string,
  name?: string,
  outPath?: string,
}

async function main(): Promise<void> {
  const inputDirPath = process.argv[2];
  const ouputDirPath = process.argv[3];

  if (!inputDirPath || !ouputDirPath) {
    console.error('Usage: pnpm dev:test <input-dir-path> <output-dir-path>');
    process.exitCode = 1;
    return;
  }

  try {
    const inputStats = await stat(inputDirPath);
    if (!inputStats.isDirectory()) {
      console.error('Input path is not a directory');
      process.exitCode = 1;
      return;
    }
  } catch (error) {
    console.error(`Cannot access input directory ${inputDirPath}:`, error);
    process.exitCode = 1;
    return;
  }

  try {
    await mkdir(ouputDirPath, { recursive: true });
  } catch (error) {
    console.error(`Cannot create output directory ${ouputDirPath}:`, error);
    process.exitCode = 1;
    return;
  }

  const jpegFiles = readdirSync(inputDirPath)
    .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'));

  const outputs: Output[] = await Promise.all(jpegFiles.map(async (file): Promise<Output> =>  {
    const filePath = join(inputDirPath, file);

    try {
      const data = await readFile(filePath);
      const { name } = parse(file);
      const outputFilePath = join(ouputDirPath, `${name}-modified.jpg`);
      let width = 1080;
      let height = 1080;
      
      // Portrait (classic)	4:5	1080 × 1350
      // width = 1080,
      // height = 1350,

      // Portrait (taller)	3:4	1080 × 1440
      // width = 1080,
      // height = 1440,

      // Landscape	1.91:1	1080 × 566
      // width = 1080,
      // height = 566,

      // Square	1:1	1080 × 1080
      // width = 1080,
      // height = 1080,


      // square
      const metadata = await sharp(filePath).metadata();
      const max = Math.max(metadata.width, metadata.height)
      width = max;
      height = max;
      
      width = 1080;
      height = 566 ;
      const exportOutput = await exportImage({
        data,
        options: {
          width: width,
          height: height,
          fit: 'contain',
          backgroundColor: '#ffffff',
          compressionQuality: 95,
          upscaling: true,
          autoOrientation: true,
        },
      });
  
      await writeFile(outputFilePath, exportOutput.data);
      return {
        name: filePath,
        outPath: outputFilePath
      };
    } catch (error) {
      return {
        name: filePath,
        error: `Failed to export ${filePath}: ${error}`,
      };
    }
  }));

  outputs.forEach((output) => {
    if (output.error) {
      console.error(output.error);
      process.exitCode = 1;
    }

    if (output.outPath) {
      console.log(`File exported: ${output.outPath}`);
    }
  });
}

await main();