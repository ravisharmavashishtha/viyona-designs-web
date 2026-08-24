import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

async function installBambuIntegration() {
  const destDir = 'd:/DevSpace/homeassistant_config/custom_components/bambu_lab';
  const zipPath = 'd:/DevSpace/homeassistant_config/bambu_lab.zip';

  console.log('1. Downloading latest ha-bambulab release from GitHub...');
  const res = await fetch('https://github.com/greghesp/ha-bambulab/releases/latest/download/bambu_lab.zip');
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(zipPath, Buffer.from(buffer));
  console.log('Downloaded zip file, size:', buffer.byteLength, 'bytes');

  console.log('2. Extracting to custom_components/bambu_lab...');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  await execAsync(`powershell -Command "Expand-Archive -Path '${zipPath.replace(/\//g, '\\')}' -DestinationPath '${destDir.replace(/\//g, '\\')}' -Force"`);

  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  console.log('🎉 ha-bambulab extracted successfully into custom_components/bambu_lab!');
}

installBambuIntegration();
