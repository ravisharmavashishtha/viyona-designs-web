#!/usr/bin/env node
/**
 * Meta Social Media MCP (Model Context Protocol) Server
 * Enables Antigravity to interact directly with Instagram & Facebook Graph APIs:
 * - Publish Instagram photos & reels
 * - Publish Facebook page posts & photos
 * - Publish to both platforms simultaneously
 * - Fetch analytics & recent posts
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';

// ─── Environment Configuration ────────────────────────────────────────────────
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_PAGE_ID = process.env.META_PAGE_ID || '1264460143406250';
const META_IG_USER_ID = process.env.META_IG_USER_ID || '17841447302983726';
const GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';

// ─── Tool Definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'publish_instagram_post',
    description: 'Publishes a single photo post to the Viyona Designs Instagram Business Account (@viyonadesigns).',
    inputSchema: {
      type: 'object',
      properties: {
        image_url: {
          type: 'string',
          description: 'The public HTTPS URL of the image to publish (e.g. https://viyonadesigns.com/images/ganesha_lifestyle_2k.png)'
        },
        caption: {
          type: 'string',
          description: 'The Instagram post caption including emojis and hashtags'
        }
      },
      required: ['image_url', 'caption']
    }
  },
  {
    name: 'publish_facebook_post',
    description: 'Publishes a post or photo to the Viyona Designs Facebook Page (/viyonadesigns).',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The text message / caption for the Facebook post'
        },
        image_url: {
          type: 'string',
          description: 'Optional public HTTPS URL of an image to include with the post'
        }
      },
      required: ['message']
    }
  },
  {
    name: 'publish_to_both_platforms',
    description: 'Publishes a photo post simultaneously to both Instagram (@viyonadesigns) and Facebook Page (/viyonadesigns).',
    inputSchema: {
      type: 'object',
      properties: {
        image_url: {
          type: 'string',
          description: 'The public HTTPS URL of the image to publish'
        },
        caption: {
          type: 'string',
          description: 'The caption to use across both platforms (including emojis, links, and hashtags)'
        }
      },
      required: ['image_url', 'caption']
    }
  },
  {
    name: 'get_instagram_recent_posts',
    description: 'Retrieves recent posts, likes, comments, and permalinks from the Instagram Business Account.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of recent posts to retrieve (default: 5, max: 25)'
        }
      }
    }
  },
  {
    name: 'get_facebook_recent_posts',
    description: 'Retrieves recent posts, reach, and engagements from the Facebook Page.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of recent posts to retrieve (default: 5, max: 25)'
        }
      }
    }
  },
  {
    name: 'get_page_insights',
    description: 'Retrieves overall performance metrics and reach insights for the Facebook Page and Instagram Account.',
    inputSchema: {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          enum: ['day', 'week', 'days_28'],
          description: 'Reporting period for insights (default: days_28)'
        }
      }
    }
  }
];

// ─── API Helper Functions ─────────────────────────────────────────────────────

async function apiRequest(endpoint, options = {}) {
  const url = `${GRAPH_API_BASE}${endpoint}`;
  const res = await fetch(url, options);
  const data = await res.json();
  if (data.error) {
    throw new Error(`Meta API Error: ${data.error.message} (code: ${data.error.code})`);
  }
  return data;
}

async function publishInstagram(imageUrl, caption) {
  if (!META_ACCESS_TOKEN) throw new Error('META_ACCESS_TOKEN is not configured.');
  if (!META_IG_USER_ID) throw new Error('META_IG_USER_ID is not configured.');

  // Step 1: Create Container
  const containerUrl = `/${META_IG_USER_ID}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
  const container = await apiRequest(containerUrl, { method: 'POST' });
  const creationId = container.id;

  // Step 2: Publish Container
  const publishUrl = `/${META_IG_USER_ID}/media_publish?creation_id=${encodeURIComponent(creationId)}&access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
  const result = await apiRequest(publishUrl, { method: 'POST' });

  return {
    status: 'success',
    platform: 'Instagram',
    postId: result.id,
    message: `Post successfully published to Instagram (@viyonadesigns)! Post ID: ${result.id}`
  };
}

async function publishFacebook(message, imageUrl) {
  if (!META_ACCESS_TOKEN) throw new Error('META_ACCESS_TOKEN is not configured.');
  if (!META_PAGE_ID) throw new Error('META_PAGE_ID is not configured.');

  let result;
  if (imageUrl) {
    // Post with Photo
    const photoUrl = `/${META_PAGE_ID}/photos?url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(message)}&access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
    result = await apiRequest(photoUrl, { method: 'POST' });
  } else {
    // Text Post
    const feedUrl = `/${META_PAGE_ID}/feed?message=${encodeURIComponent(message)}&access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
    result = await apiRequest(feedUrl, { method: 'POST' });
  }

  return {
    status: 'success',
    platform: 'Facebook',
    postId: result.id || result.post_id,
    message: `Post successfully published to Facebook Page (/viyonadesigns)! ID: ${result.id || result.post_id}`
  };
}

async function getInstagramMedia(limit = 5) {
  if (!META_ACCESS_TOKEN || !META_IG_USER_ID) throw new Error('Meta credentials not configured.');
  const url = `/${META_IG_USER_ID}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
  return await apiRequest(url);
}

async function getFacebookFeed(limit = 5) {
  if (!META_ACCESS_TOKEN || !META_PAGE_ID) throw new Error('Meta credentials not configured.');
  const url = `/${META_PAGE_ID}/posts?fields=id,message,created_time,shares,reactions.summary(true),comments.summary(true)&limit=${limit}&access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
  return await apiRequest(url);
}

async function getInsights(period = 'days_28') {
  if (!META_ACCESS_TOKEN || !META_PAGE_ID) throw new Error('Meta credentials not configured.');
  const url = `/${META_PAGE_ID}/insights?metric=page_impressions_unique,page_engaged_users,page_post_engagements&period=${period}&access_token=${encodeURIComponent(META_ACCESS_TOKEN)}`;
  return await apiRequest(url);
}

// ─── Tool Call Router ─────────────────────────────────────────────────────────

async function handleToolCall(name, args) {
  switch (name) {
    case 'publish_instagram_post': {
      const { image_url, caption } = args;
      const res = await publishInstagram(image_url, caption);
      return { content: [{ type: 'text', text: JSON.stringify(res, null, 2) }] };
    }
    case 'publish_facebook_post': {
      const { message, image_url } = args;
      const res = await publishFacebook(message, image_url);
      return { content: [{ type: 'text', text: JSON.stringify(res, null, 2) }] };
    }
    case 'publish_to_both_platforms': {
      const { image_url, caption } = args;
      const [igResult, fbResult] = await Promise.allSettled([
        publishInstagram(image_url, caption),
        publishFacebook(caption, image_url)
      ]);
      const summary = {
        instagram: igResult.status === 'fulfilled' ? igResult.value : { error: igResult.reason.message },
        facebook: fbResult.status === 'fulfilled' ? fbResult.value : { error: fbResult.reason.message }
      };
      return { content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }] };
    }
    case 'get_instagram_recent_posts': {
      const res = await getInstagramMedia(args.limit || 5);
      return { content: [{ type: 'text', text: JSON.stringify(res, null, 2) }] };
    }
    case 'get_facebook_recent_posts': {
      const res = await getFacebookFeed(args.limit || 5);
      return { content: [{ type: 'text', text: JSON.stringify(res, null, 2) }] };
    }
    case 'get_page_insights': {
      const res = await getInsights(args.period || 'days_28');
      return { content: [{ type: 'text', text: JSON.stringify(res, null, 2) }] };
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

  // Handle Notifications (no response needed)
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
          name: 'meta-social-mcp',
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

process.stderr.write('[Meta Social MCP Server] Initialized and listening on stdio.\n');
