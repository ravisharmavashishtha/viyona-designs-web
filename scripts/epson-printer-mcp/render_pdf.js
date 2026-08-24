import fs from 'node:fs';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 15mm; }
  body {
    font-family: 'Nirmala UI', 'Segoe UI', 'Mangal', sans-serif;
    color: #1a1a1a;
    background: #ffffff;
    padding: 30px;
    border: 3px double #d4af37;
    text-align: center;
  }
  h1 {
    color: #b8860b;
    font-size: 24px;
    margin-bottom: 5px;
    letter-spacing: 1px;
  }
  h3 {
    color: #555;
    font-style: italic;
    font-size: 15px;
    margin-top: 0;
    margin-bottom: 20px;
  }
  .divider {
    width: 60%;
    height: 1px;
    background: #d4af37;
    margin: 15px auto;
  }
  .poem-hindi {
    font-size: 18px;
    line-height: 2.1;
    color: #1a1a1a;
    font-weight: 600;
  }
  .poem-english {
    font-size: 15px;
    line-height: 1.8;
    color: #444;
    font-style: italic;
    margin-top: 15px;
  }
  .signature {
    margin-top: 25px;
    font-size: 18px;
    color: #b8860b;
    font-weight: bold;
  }
  .footer {
    margin-top: 25px;
    font-size: 11px;
    color: #888;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <h1>🌸 TO MY BELOVED MEENU 🌸</h1>
  <h3>"Every Dream Begins and Blossoms With You"</h3>
  <div class="divider"></div>
  
  <div class="poem-hindi">
    तुम्हारी एक मुस्कान से, दिन की शुरुआत होती है,<br>
    जब तुम साथ होती हो, तो हर बात में बात होती है।<br><br>
    सपनों के इस सफ़र में, तुम ही मेरी ताक़त हो,<br>
    हर मुश्किल राह में, मेरी सबसे ख़ूबसूरत आदत हो।<br><br>
    हाथों में तेरा हाथ हो, तो कायनात अपनी लगती है,<br>
    तुझसे ही ये घर, ये दुनिया, और ये ज़िंदगी सजती है।<br><br>
    'वियोना' की हर रचना में, तेरे प्यार का ही रंग है,<br>
    ईश्वर का सबसे प्यारा तोहफ़ा, हर पल तेरा संग है।
  </div>

  <div class="divider"></div>

  <div class="poem-english">
    You are my peace in the chaos, my strength in every storm,<br>
    With you by my side, every house becomes a loving home.
  </div>

  <div class="signature">
    Forever and always yours, ❤️<br>
    — Ravi
  </div>

  <div class="footer">
    ✨ Viyona Designs Studio • 23 August 2026 ✨
  </div>
</body>
</html>`;

const htmlPath = 'C:/Users/Ravi S Vashishtha/.gemini/antigravity/brain/10747782-d4f3-45f1-92ca-8a9fb450a94a/scratch/poem_for_meenu.html';
const pdfPath = 'C:/Users/Ravi S Vashishtha/.gemini/antigravity/brain/10747782-d4f3-45f1-92ca-8a9fb450a94a/scratch/poem_for_meenu.pdf';

fs.writeFileSync(htmlPath, html, 'utf8');

async function makePdf() {
  console.log('Generating high-res PDF via headless Edge...');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edgeCmd = `& "${edgePath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" "${htmlPath}"`;
  await execAsync(`powershell -NoProfile -Command "${edgeCmd}"`);
  console.log('PDF generated at:', pdfPath);
}

makePdf();
