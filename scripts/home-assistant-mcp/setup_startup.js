import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { exec } from 'node:child_process';

const startupFolder = path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
const vbsPath = path.join(startupFolder, 'ViyonaMobileBridge.vbs');

const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "node.exe d:\\DevSpace\\3dprintingbusiness\\scripts\\home-assistant-mcp\\mobile_bridge.js", 0, False
`;

fs.writeFileSync(vbsPath, vbsContent, 'utf8');
console.log('Installed silent background launcher in Windows Startup folder:\n', vbsPath);

exec(`wscript.exe "${vbsPath}"`, (err) => {
  if (err) console.error(err);
  console.log('🎉 Background Mobile Bridge is now running independently on Windows!');
});
