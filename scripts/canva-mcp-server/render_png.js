import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const svgPath = 'H:/My Drive/Website/brandinfo/marketing/canva_instagram_post_1787476801432.svg';
const htmlPath = 'H:/My Drive/Website/brandinfo/marketing/temp_canva_preview.html';
const pngPath = 'H:/My Drive/Website/brandinfo/marketing/canva_ganesha_instagram_post_1080.png';

async function renderToPng() {
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:#000;width:1080px;height:1080px;}</style></head><body>${svgContent}</body></html>`;
  fs.writeFileSync(htmlPath, html, 'utf8');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cmd = `"${edgePath}" --headless --disable-gpu --window-size=1080,1080 --screenshot="${pngPath}" "${htmlPath}"`;
  
  await execAsync(cmd);
  if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);

  console.log('🎉 Rendered 1080x1080 Ultra-HD Instagram Post Banner to:\n', pngPath);
}

renderToPng();
