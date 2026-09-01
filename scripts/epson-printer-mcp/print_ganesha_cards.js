import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const svgPath = 'D:/DevSpace/3dprintingbusiness/assets/marketing/ganesha_luxury_box_insert_4x4.svg';
const outDir = 'D:/DevSpace/3dprintingbusiness/assets/marketing';
const htmlPath = path.join(outDir, 'ganesha_cards_a4_layout.html');
const pdfPath = path.join(outDir, 'ganesha_cards_a4.pdf');

async function prepareAndPrint() {
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // A4 layout with 4 cards (2x2 grid with cutting guides)
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 210mm;
    height: 297mm;
    background: #FFFFFF;
    box-sizing: border-box;
    font-family: system-ui, sans-serif;
  }
  .grid-container {
    display: grid;
    grid-template-columns: 95mm 95mm;
    grid-template-rows: 95mm 95mm;
    gap: 8mm;
    justify-content: center;
    align-content: center;
    height: 275mm;
  }
  .card-box {
    width: 95mm;
    height: 95mm;
    border: 1px dashed #D1D5DB;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .card-box svg {
    width: 92mm;
    height: 92mm;
  }
  .cut-mark {
    position: absolute;
    bottom: -6mm;
    right: 0;
    font-size: 8px;
    color: #9CA3AF;
  }
</style>
</head>
<body>
  <div class="grid-container">
    <div class="card-box">${svgContent}</div>
    <div class="card-box">${svgContent}</div>
    <div class="card-box">${svgContent}</div>
    <div class="card-box">${svgContent}</div>
  </div>
</body>
</html>`;

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('1. Created A4 4-Card Grid Layout:', htmlPath);

  // Render to vector PDF using headless Edge
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const renderCmd = `"${edgePath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" "file:///${htmlPath}"`;
  await execAsync(renderCmd);
  console.log('2. Rendered Print-Ready Vector PDF:', pdfPath);

  // Send to Epson L3260
  console.log('3. Dispatching print job to EPSON L3260 Series...');
  const psPrint = `Start-Process -FilePath "${pdfPath.replace(/\\/g, '/')}" -Verb Print -PassThru | Out-Null`;
  await execAsync(`powershell -NoProfile -Command "${psPrint}"`);

  console.log('🎉 PRINT JOB SENT TO EPSON L3260!');
}

prepareAndPrint().catch(err => {
  console.error('Print failed:', err.message);
});
