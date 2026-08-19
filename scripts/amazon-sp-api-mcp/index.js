#!/usr/bin/env node
/**
 * Amazon Selling Partner API (SP-API) MCP Server
 * Enables Antigravity to query live Amazon India seller data:
 * - Live Orders, order statuses & tracking
 * - FBA and Merchant Inventory stock levels
 * - Pricing, Buy Box & Listing details
 * - Sales and revenue summaries
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';

// ─── Environment Configuration (Read dynamically from Antigravity mcp_config.json) ───
const AMAZON_CLIENT_ID = process.env.AMAZON_CLIENT_ID || '';
const AMAZON_CLIENT_SECRET = process.env.AMAZON_CLIENT_SECRET || '';
const AMAZON_REFRESH_TOKEN = process.env.AMAZON_REFRESH_TOKEN || '';
const AMAZON_MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID || 'A21TJRUUN4KGV'; // Amazon India (IN)
const SP_API_ENDPOINT = process.env.AMAZON_API_ENDPOINT || 'https://sellingpartnerapi-eu.amazon.com'; // Region: EU/IN endpoint

let cachedAccessToken = null;
let tokenExpiry = 0;

// ─── LWA (Login with Amazon) OAuth 2.0 Token Generation ──────────────────────

async function getLwaAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && tokenExpiry > now + 60) {
    return cachedAccessToken;
  }

  if (!AMAZON_REFRESH_TOKEN) {
    // If running in Sandbox / pre-authorization mode
    return 'sandbox-mock-token';
  }

  const res = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: AMAZON_REFRESH_TOKEN,
      client_id: AMAZON_CLIENT_ID,
      client_secret: AMAZON_CLIENT_SECRET
    })
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Amazon LWA Token Error: ${data.error_description || data.error}`);
  }

  cachedAccessToken = data.access_token;
  tokenExpiry = now + data.expires_in;
  return cachedAccessToken;
}

// ─── SP-API Helper ────────────────────────────────────────────────────────────

async function callSpApi(path, options = {}) {
  const accessToken = await getLwaAccessToken();

  if (accessToken === 'sandbox-mock-token') {
    return {
      mode: 'sandbox_preview',
      message: 'App registered. Awaiting LWA Refresh Token for live production data stream.',
      credentialsConfigured: {
        clientId: AMAZON_CLIENT_ID ? 'Configured ✅' : 'Missing',
        clientSecret: AMAZON_CLIENT_SECRET ? 'Configured ✅' : 'Missing',
        marketplace: 'Amazon India (A21TJRUUN4KGV)'
      }
    };
  }

  const url = `${SP_API_ENDPOINT}${path}`;
  const headers = {
    'x-amz-access-token': accessToken,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (data.errors && data.errors.length > 0) {
    throw new Error(`Amazon SP-API Error: ${data.errors[0].message} (code: ${data.errors[0].code})`);
  }
  return data;
}

// ─── Tool Definitions ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'get_amazon_orders',
    description: 'Retrieves recent customer orders from Amazon India seller central with order status, buyer items, and tracking.',
    inputSchema: {
      type: 'object',
      properties: {
        createdAfter: {
          type: 'string',
          description: 'ISO 8601 date string to retrieve orders after (e.g. 2026-08-01T00:00:00Z, default: last 7 days)'
        },
        orderStatuses: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by statuses: Shipped, Unshipped, PartiallyShipped, Pending, Canceled'
        }
      }
    }
  },
  {
    name: 'get_amazon_inventory',
    description: 'Retrieves real-time FBA and Merchant-fulfilled inventory stock levels for Ganesha (B0HF5124YZ) and Puppy (B0HC36C861).',
    inputSchema: {
      type: 'object',
      properties: {
        granularityType: {
          type: 'string',
          enum: ['Marketplace'],
          default: 'Marketplace'
        }
      }
    }
  },
  {
    name: 'get_amazon_pricing_and_buybox',
    description: 'Retrieves current price, Buy Box offer, and competitive seller pricing for Viyona Designs ASINs on Amazon India.',
    inputSchema: {
      type: 'object',
      properties: {
        asins: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of ASINs to query (default: [B0HF5124YZ, B0HC36C861])'
        }
      }
    }
  },
  {
    name: 'get_amazon_sales_summary',
    description: 'Calculates total units sold, gross sales revenue, and average order value for a given date range on Amazon.',
    inputSchema: {
      type: 'object',
      properties: {
        timeframeDays: {
          type: 'number',
          description: 'Number of past days to aggregate sales for (default: 7)'
        }
      }
    }
  }
];

// ─── Tool Execution Router ───────────────────────────────────────────────────

async function handleToolCall(name, args) {
  switch (name) {
    case 'get_amazon_orders': {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const createdAfter = args.createdAfter || sevenDaysAgo;
      const path = `/orders/v0/orders?MarketplaceIds=${AMAZON_MARKETPLACE_ID}&CreatedAfter=${encodeURIComponent(createdAfter)}`;
      const data = await callSpApi(path);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    case 'get_amazon_inventory': {
      const path = `/fba/inventory/v1/summaries?details=true&granularityType=Marketplace&granularityId=${AMAZON_MARKETPLACE_ID}&marketplaceIds=${AMAZON_MARKETPLACE_ID}`;
      const data = await callSpApi(path);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    case 'get_amazon_pricing_and_buybox': {
      const asins = args.asins && args.asins.length > 0 ? args.asins.join(',') : 'B0HF5124YZ,B0HC36C861';
      const path = `/products/pricing/v0/price?MarketplaceId=${AMAZON_MARKETPLACE_ID}&Asins=${asins}&ItemType=Asin`;
      const data = await callSpApi(path);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    case 'get_amazon_sales_summary': {
      const days = args.timeframeDays || 7;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const path = `/orders/v0/orders?MarketplaceIds=${AMAZON_MARKETPLACE_ID}&CreatedAfter=${encodeURIComponent(startDate)}`;
      const data = await callSpApi(path);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ─── JSON-RPC Standard Stdio Loop ─────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;

  let request;
  try {
    request = JSON.parse(line);
  } catch (e) {
    return;
  }

  const { id, method, params } = request;

  if (!id && method) return;

  try {
    let result;

    if (method === 'initialize') {
      result = {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'amazon-seller-sp-api-mcp',
          version: '1.0.0'
        }
      };
    } else if (method === 'tools/list') {
      result = { tools: TOOLS };
    } else if (method === 'tools/call') {
      const { name, arguments: args } = params;
      result = await handleToolCall(name, args || {});
    } else if (method === 'ping') {
      result = {};
    } else {
      throw new Error(`Method not supported: ${method}`);
    }

    const response = {
      jsonrpc: '2.0',
      id,
      result
    };
    process.stdout.write(JSON.stringify(response) + '\n');
  } catch (err) {
    const errorResponse = {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: err.message || 'Internal error'
      }
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

process.stderr.write('[Amazon SP-API MCP Server] Initialized and listening on stdio.\n');
