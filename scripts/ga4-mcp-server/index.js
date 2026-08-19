#!/usr/bin/env node
/**
 * Google Analytics 4 (GA4) MCP (Model Context Protocol) Server
 * Enables Antigravity to query live GA4 reports, realtime traffic, conversions, and visitor insights.
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';
import crypto from 'node:crypto';
import fs from 'node:fs';

// ─── Environment Configuration ────────────────────────────────────────────────
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '550107962';
const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'H:/My Drive/Website/viyona-designs-6c7e1f965ed0.json';
const API_BASE = 'https://analyticsdata.googleapis.com/v1beta';

let cachedToken = null;
let tokenExpiry = 0;

// ─── Google OAuth 2.0 JWT Token Generation ────────────────────────────────────

function base64url(str) {
  return Buffer.from(str).toString('base64url');
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  if (!fs.existsSync(KEY_FILE_PATH)) {
    throw new Error(`Google Service Account key file not found at: ${KEY_FILE_PATH}`);
  }

  const keyData = JSON.parse(fs.readFileSync(KEY_FILE_PATH, 'utf8'));

  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: keyData.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedClaim = base64url(JSON.stringify(claimSet));
  const signatureInput = encodedHeader + '.' + encodedClaim;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(keyData.private_key, 'base64url');

  const jwt = signatureInput + '.' + signature;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt
  });

  const data = await res.json();
  if (data.error) throw new Error(`Google OAuth error: ${data.error_description || data.error}`);

  cachedToken = data.access_token;
  tokenExpiry = now + data.expires_in;
  return cachedToken;
}

async function runGA4Query(endpoint, payload) {
  const token = await getAccessToken();
  const url = `${API_BASE}/properties/${GA4_PROPERTY_ID}:${endpoint}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`GA4 API Error (${data.error.code}): ${data.error.message}`);
  }
  return data;
}

// ─── Tool Definitions ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'get_realtime_active_users',
    description: 'Retrieves current active visitors on viyonadesigns.com in the last 30 minutes, with country and active pages.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_traffic_overview',
    description: 'Retrieves total active users, sessions, page views, and bounce rate for a specified date range.',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: {
          type: 'string',
          description: 'Start date (e.g. 7daysAgo, 30daysAgo, yesterday, 2026-08-01, default: 30daysAgo)'
        },
        endDate: {
          type: 'string',
          description: 'End date (e.g. today, yesterday, 2026-08-19, default: today)'
        }
      }
    }
  },
  {
    name: 'get_top_pages',
    description: 'Retrieves most visited page paths and views on viyonadesigns.com.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of top pages to return (default: 10)'
        },
        startDate: {
          type: 'string',
          description: 'Start date (default: 30daysAgo)'
        }
      }
    }
  },
  {
    name: 'get_traffic_sources',
    description: 'Retrieves traffic channels and source/medium breakdown (e.g. Instagram, Google Search, Direct, Facebook).',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: {
          type: 'string',
          description: 'Start date (default: 30daysAgo)'
        }
      }
    }
  },
  {
    name: 'get_conversion_events',
    description: 'Retrieves counts of conversion events like InitiateCheckout, generate_lead, ViewContent, Contact, and Lead.',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: {
          type: 'string',
          description: 'Start date (default: 30daysAgo)'
        }
      }
    }
  },
  {
    name: 'get_geographic_breakdown',
    description: 'Retrieves visitors grouped by Country and City.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of top cities to return (default: 10)'
        }
      }
    }
  }
];

// ─── Tool Execution Router ───────────────────────────────────────────────────

async function handleToolCall(name, args) {
  const startDate = args.startDate || '30daysAgo';
  const endDate = args.endDate || 'today';
  const limit = args.limit || 10;

  switch (name) {
    case 'get_realtime_active_users': {
      const data = await runGA4Query('runRealtimeReport', {
        metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
        dimensions: [{ name: 'country' }, { name: 'unifiedScreenName' }]
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    case 'get_traffic_overview': {
      const data = await runGA4Query('runReport', {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' }
        ]
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    case 'get_top_pages': {
      const data = await runGA4Query('runReport', {
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        limit
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    case 'get_traffic_sources': {
      const data = await runGA4Query('runReport', {
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        dimensions: [{ name: 'sessionSourceMedium' }, { name: 'sessionDefaultChannelGroup' }],
        limit
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    case 'get_conversion_events': {
      const data = await runGA4Query('runReport', {
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
        dimensions: [{ name: 'eventName' }],
        limit: 20
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }

    case 'get_geographic_breakdown': {
      const data = await runGA4Query('runReport', {
        dateRanges: [{ startDate, endDate }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        dimensions: [{ name: 'country' }, { name: 'city' }],
        limit
      });
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
          name: 'ga4-analytics-mcp',
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

process.stderr.write('[GA4 Analytics MCP Server] Initialized and listening on stdio.\n');
