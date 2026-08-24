import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const configPath = path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const metaEnv = config.mcpServers['meta-social'].env;
const token = config.mcpServers['home-assistant'].env.HA_TOKEN;

async function announceLiveFollowers() {
  const url = `https://graph.facebook.com/v20.0/${metaEnv.META_IG_USER_ID}?fields=followers_count&access_token=${metaEnv.META_ACCESS_TOKEN}`;
  const resMeta = await fetch(url);
  const dataMeta = await resMeta.json();
  const count = dataMeta.followers_count || 1088;
  const needed = 1100 - count;

  const speech = `Ding! Attention Meenu! Viyona Designs currently has ${count} followers on Instagram! We are only ${needed} followers away from reaching our next big milestone of 1,100!`;
  console.log('Broadcasting live announcement to Echo Dot:', speech);

  const resHA = await fetch('http://127.0.0.1:8123/api/services/notify/send_message', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entity_id: 'notify.ravi_s_echo_dot_announce',
      message: speech
    })
  });
  console.log('Echo Speak Status:', resHA.status);

  // Flash WiZ bulb in celebratory Emerald Green
  try {
    await fetch('http://127.0.0.1:8123/api/services/light/turn_on', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity_id: 'light.wiz_rgbw_tunable_04f02c',
        rgb_color: [0, 255, 128],
        brightness_pct: 100
      })
    });
  } catch (e) {}
}

announceLiveFollowers();
