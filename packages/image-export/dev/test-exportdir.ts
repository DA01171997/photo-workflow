import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { exportImage } from '../src/index.js';
import { join, parse } from 'node:path';
import { readdirSync } from 'node:fs';

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

      const exportOutput = await exportImage({
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