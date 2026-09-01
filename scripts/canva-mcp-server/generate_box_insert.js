#!/usr/bin/env node
/**
 * Generates an Ultra-HD 4x4 inch Luxury Box Insert Blessing Card for Ganesha Packaging
 * Formatted for Epson L3260 Photo Paper / Cardstock
 */

import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const outDir = 'd:/DevSpace/3dprintingbusiness/assets/marketing';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const svg = `
<svg width="1200" height="1200" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#F5D061"/>
      <stop offset="100%" stop-color="#AA771C"/>
    </linearGradient>
    <filter id="subtleShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Clean Off-White Matte Textured Card Background -->
  <rect width="1200" height="1200" fill="#FCFAF7" rx="32"/>
  <rect x="36" y="36" width="1128" height="1128" rx="24" stroke="url(#goldGrad)" stroke-width="3" fill="none"/>
  <rect x="48" y="48" width="1104" height="1104" rx="20" stroke="#D4AF37" stroke-opacity="0.3" stroke-width="1" fill="none"/>

  <!-- Top Sacred Symbol / Header -->
  <g transform="translate(600, 160)" text-anchor="middle">
    <text font-family="'Nirmala UI', 'Segoe UI', serif" font-size="52" font-weight="700" fill="#AA771C" letter-spacing="6">॥ श्री गणेशाय नमः ॥</text>
    <text font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#6B7280" letter-spacing="8" y="48">VIYONA DESIGNS • STUDIO COLLECTION</text>
  </g>

  <!-- Elegant Gold Divider -->
  <line x1="450" y1="260" x2="750" y2="260" stroke="url(#goldGrad)" stroke-width="2" stroke-linecap="round"/>

  <!-- Central Sanskrit Shloka & Blessing -->
  <g transform="translate(600, 360)" text-anchor="middle">
    <text font-family="'Nirmala UI', 'Mangal', serif" font-size="34" font-weight="600" fill="#1F2937" font-style="italic">
      <tspan x="0" dy="0">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।</tspan>
      <tspan x="0" dy="54">निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥</tspan>
    </text>
  </g>

  <!-- Message Body -->
  <g transform="translate(600, 560)" text-anchor="middle">
    <text font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="400" fill="#374151">
      <tspan x="0" dy="0">May Lord Ganesha bring peace, auspicious energy,</tspan>
      <tspan x="0" dy="44">and boundless prosperity into your sacred space.</tspan>
    </text>
  </g>

  <!-- Craftsmanship Highlights Box -->
  <g transform="translate(150, 710)">
    <rect width="900" height="220" rx="16" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5" filter="url(#subtleShadow)"/>
    
    <g transform="translate(60, 55)">
      <circle cx="20" cy="20" r="16" fill="#FEF3C7"/>
      <text x="20" y="27" text-anchor="middle" font-size="18" fill="#D97706">🌱</text>
      <text x="60" y="16" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#111827">100% Plant-Based Bio-PLA</text>
      <text x="60" y="42" font-family="system-ui, sans-serif" font-size="18" font-weight="400" fill="#6B7280">Sustainably crafted &amp; eco-friendly</text>
    </g>

    <g transform="translate(480, 55)">
      <circle cx="20" cy="20" r="16" fill="#FEF3C7"/>
      <text x="20" y="27" text-anchor="middle" font-size="18" fill="#D97706">✨</text>
      <text x="60" y="16" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#111827">0.08mm Layer Precision</text>
      <text x="60" y="42" font-family="system-ui, sans-serif" font-size="18" font-weight="400" fill="#6B7280">Ultra-smooth matte silk finish</text>
    </g>

    <g transform="translate(60, 135)">
      <circle cx="20" cy="20" r="16" fill="#FEF3C7"/>
      <text x="20" y="27" text-anchor="middle" font-size="18" fill="#D97706">🚗</text>
      <text x="60" y="16" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#111827">Multi-Surface Ready</text>
      <text x="60" y="42" font-family="system-ui, sans-serif" font-size="18" font-weight="400" fill="#6B7280">Ideal for Pooja Mandir, Desk &amp; Dashboard</text>
    </g>

    <g transform="translate(480, 135)">
      <circle cx="20" cy="20" r="16" fill="#FEF3C7"/>
      <text x="20" y="27" text-anchor="middle" font-size="18" fill="#D97706">🇮🇳</text>
      <text x="60" y="16" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#111827">Engineered in India</text>
      <text x="60" y="42" font-family="system-ui, sans-serif" font-size="18" font-weight="400" fill="#6B7280">Viyona Designs Smart Studio</text>
    </g>
  </g>

  <!-- Footer / Support / Review -->
  <g transform="translate(600, 1020)" text-anchor="middle">
    <text font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" fill="#4B5563">
      Love your idol? Share your blessing on Amazon or tag us <tspan fill="#D97706" font-weight="700">@viyonadesigns</tspan>
    </text>
    <text font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="500" fill="#9CA3AF" y="42">
      Official Support: viyonadesigns@gmail.com • WhatsApp: +91 95400 99931 • viyonadesigns.com
    </text>
  </g>
</svg>
`;

const svgPath = path.join(outDir, 'ganesha_luxury_box_insert_4x4.svg');
const htmlPath = path.join(outDir, 'temp_box_insert.html');
const pngPath = path.join(outDir, 'ganesha_luxury_box_insert_4x4.png');

fs.writeFileSync(svgPath, svg, 'utf8');
console.log('✅ Generated Luxury 4x4 Box Insert SVG to:\n', svgPath);

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;width:1200px;height:1200px;background:#FCFAF7;}</style></head><body>${svg}</body></html>`;
fs.writeFileSync(htmlPath, html, 'utf8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --window-size=1200,1200 --screenshot="${pngPath}" "${htmlPath}"`;

await execAsync(cmd);
if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);

console.log('🎉 Rendered 1200x1200 Ultra-HD Print Card to:\n', pngPath);
