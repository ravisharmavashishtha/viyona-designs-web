import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const stateFile = 'd:/DevSpace/homeassistant_config/instagram_milestones.json';
const configPath = path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const metaEnv = config.mcpServers['meta-social'].env;
const haToken = config.mcpServers['home-assistant'].env.HA_TOKEN;

const speakerTargets = [
  'notify.everywhere_announce',
  'notify.ravi_s_echo_dot_announce',
  'notify.alexa_announce',
  'notify.home_theater_announce'
];

async function checkMilestone(forceTest = false) {
  let savedData = { last_milestone_25: 1075, last_milestone_100: 1000, current_followers: 1090 };
  try {
    if (fs.existsSync(stateFile)) {
      savedData = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    }
  } catch (e) {}

  const url = `https://graph.facebook.com/v20.0/${metaEnv.META_IG_USER_ID}?fields=followers_count&access_token=${metaEnv.META_ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.followers_count) {
    console.error('Failed to fetch follower count:', data);
    return;
  }

  const followers = data.followers_count;
  const currentTier100 = Math.floor(followers / 100) * 100;
  const currentTier25 = Math.floor(followers / 25) * 25;

  console.log(`Current Followers: ${followers}, 100s Tier: ${currentTier100}, 25s Tier: ${currentTier25}`);

  savedData.current_followers = followers;

  // 1. Grand 100s Milestone Check
  if (currentTier100 > (savedData.last_milestone_100 || 1000) || (forceTest && forceTest === '100')) {
    const milestone = forceTest ? 1100 : currentTier100;
    const speech = `Ding ding ding! Grand celebration Meenu! Viyona Designs has just reached ${milestone} followers on Instagram! Our design community is expanding rapidly!`;
    console.log(`🎉 100s Grand Milestone Reached! Announcing: "${speech}"`);

    for (const target of speakerTargets) {
      try {
        await fetch('http://127.0.0.1:8123/api/services/notify/send_message', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + haToken, 'Content-Type': 'application/json' },
          body: JSON.stringify({ entity_id: target, message: speech })
        });
      } catch (e) {}
    }

    try {
      await fetch('http://127.0.0.1:8123/api/services/light/turn_on', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + haToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: 'light.wiz_rgbw_tunable_04f02c', rgb_color: [255, 0, 128], brightness_pct: 100 })
      });
    } catch (e) {}

    savedData.last_milestone_100 = currentTier100;
    savedData.last_milestone_25 = currentTier25;
  }
  // 2. 25s Growth Milestone Check
  else if (currentTier25 > (savedData.last_milestone_25 || 1075) || (forceTest && forceTest === '25')) {
    const milestone = forceTest ? 1125 : currentTier25;
    const speech = `Ding! Great news Meenu! Viyona Designs has just crossed ${milestone} followers on Instagram! Our community is growing steadily!`;
    console.log(`✨ 25s Growth Milestone Reached! Announcing: "${speech}"`);

    for (const target of speakerTargets) {
      try {
        await fetch('http://127.0.0.1:8123/api/services/notify/send_message', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + haToken, 'Content-Type': 'application/json' },
          body: JSON.stringify({ entity_id: target, message: speech })
        });
      } catch (e) {}
    }

    try {
      await fetch('http://127.0.0.1:8123/api/services/light/turn_on', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + haToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: 'light.wiz_rgbw_tunable_04f02c', rgb_color: [0, 220, 255], brightness_pct: 100 })
      });
    } catch (e) {}

    savedData.last_milestone_25 = currentTier25;
  }

  fs.writeFileSync(stateFile, JSON.stringify(savedData, null, 2), 'utf8');
}

const testArg = process.argv[2];
checkMilestone(testArg);
