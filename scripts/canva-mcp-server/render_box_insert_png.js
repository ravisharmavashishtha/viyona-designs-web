import fs from 'node:fs';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const svgPath = 'D:/DevSpace/3dprintingbusiness/assets/marketing/ganesha_luxury_box_insert_4x4.svg';
const htmlPath = 'D:/DevSpace/3dprintingbusiness/assets/marketing/temp_box_insert.html';
const pngPath = 'D:/DevSpace/3dprintingbusiness/assets/marketing/ganesha_luxury_box_insert_4x4.png';
const artPath = 'C:/Users/Ravi S Vashishtha/.gemini/antigravity/brain/10747782-d4f3-45f1-92ca-8a9fb450a94a/ganesha_luxury_box_insert_4x4.png';

async function render() {
  const svg = fs.readFileSync(svgPath, 'utf8');
  const html = `<!DOCTYPE html><html><head><meta charset='utf-8'><style>html,body{margin:0;padding:0;overflow:hidden;width:1200px;height:1200px;background:#FCFAF7;}</style></head><body>${svg}</body></html>`;
  fs.writeFileSync(htmlPath, html, 'utf8');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cmd = `"${edgePath}" --headless --disable-gpu --window-size=1200,1200 --screenshot="${pngPath}" "file:///${htmlPath}"`;

  await execAsync(cmd);
  if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);

  if (fs.existsSync(pngPath)) {
    fs.copyFileSync(pngPath, artPath);
    console.log('🎉 Rendered 1200x1200 Luxury Insert Card to:\n', pngPath);
  }
}

render();
