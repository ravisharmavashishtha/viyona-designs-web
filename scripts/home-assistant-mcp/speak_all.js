import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const configPath = path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const token = config.mcpServers['home-assistant'].env.HA_TOKEN;

async function speakEverywhere(message) {
  const speech = message || 'Hello Laalu Beta!';
  const targets = [
    'notify.everywhere_announce',
    'notify.ravi_s_echo_dot_announce',
    'notify.alexa_announce',
    'notify.home_theater_announce'
  ];

  console.log('Broadcasting to ALL Alexa Speakers across the home:', speech);
  for (const t of targets) {
    try {
      const res = await fetch('http://127.0.0.1:8123/api/services/notify/send_message', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: t, message: speech })
      });
      console.log(`Speaker ${t} response status:`, res.status);
    } catch (e) {
      console.error(`Failed on ${t}:`, e.message);
    }
  }
}

speakEverywhere(process.argv[2]);
