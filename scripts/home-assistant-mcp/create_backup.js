import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

async function createMasterBackup() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const backupDir = 'H:/My Drive/Website/brandinfo/backups';
  const targetZip = `${backupDir}/homeassistant_master_backup_${dateStr}.zip`;

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('1. Creating timestamped master backup of d:/DevSpace/homeassistant_config to Google Drive...');
  await execAsync(`powershell -Command "Compress-Archive -Path 'd:\\DevSpace\\homeassistant_config\\*' -DestinationPath '${targetZip.replace(/\//g, '\\')}' -Force"`);

  const stat = fs.statSync(targetZip);
  console.log(`🎉 Master Backup Created Successfully!\nPath: ${targetZip}\nSize: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
}

createMasterBackup();
