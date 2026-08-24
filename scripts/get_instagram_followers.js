import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const configPath = path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const metaEnv = config.mcpServers['meta-social'].env;

async function getInstagramProfile() {
  const url = `https://graph.facebook.com/v20.0/${metaEnv.META_IG_USER_ID}?fields=id,username,name,followers_count,follows_count,media_count,biography,profile_picture_url&access_token=${metaEnv.META_ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('Instagram Profile Data:\n', JSON.stringify(data, null, 2));

  const pageUrl = `https://graph.facebook.com/v20.0/${metaEnv.META_PAGE_ID}?fields=id,name,fan_count,followers_count&access_token=${metaEnv.META_ACCESS_TOKEN}`;
  const pageRes = await fetch(pageUrl);
  const pageData = await pageRes.json();
  console.log('\nFacebook Page Data:\n', JSON.stringify(pageData, null, 2));
}

getInstagramProfile();
