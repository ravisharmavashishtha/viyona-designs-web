import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const configPath = path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const env = config.mcpServers['amazon-seller'].env;

async function getLwaToken() {
  const res = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: env.AMAZON_REFRESH_TOKEN,
      client_id: env.AMAZON_CLIENT_ID,
      client_secret: env.AMAZON_CLIENT_SECRET
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function getFinancialEventsForOrder(orderId, token) {
  const res = await fetch(`https://sellingpartnerapi-eu.amazon.com/finances/v0/orders/${orderId}/financialEvents`, {
    headers: { 'x-amz-access-token': token, 'Content-Type': 'application/json' }
  });
  return await res.json();
}

async function runFinances() {
  const token = await getLwaToken();
  const orderIds = ['405-6562459-1313955', '404-7006924-7557168', '408-9126460-5378707'];

  for (const id of orderIds) {
    const res = await getFinancialEventsForOrder(id, token);
    console.log(`=== Finances for ${id} ===`);
    const shipments = res.payload?.FinancialEvents?.ShipmentEventList || [];
    shipments.forEach(s => {
      s.ShipmentItemList?.forEach(item => {
        console.log(`  Item: ${item.SellerSKU}`);
        console.log(`  Item Charges:`, item.ItemChargeList);
        console.log(`  Item Fees:`, item.ItemFeeList);
      });
    });
  }
}

runFinances();
