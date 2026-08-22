#!/usr/bin/env node
/**
 * WhatsApp Business Cloud API MCP Server for Viyona Designs
 * Enables Antigravity to:
 * - Send WhatsApp messages / replies to customers
 * - Send order updates & Amazon product links
 * - Fetch WhatsApp business profile & phone numbers
 * - Manage WhatsApp message templates
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';

// Environment Configuration
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';

const TOOLS = [
  {
    name: 'send_whatsapp_message',
    description: 'Sends a direct text message or reply to a customer on WhatsApp.',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient phone number with country code (e.g. 919876543210 without + or spaces)'
        },
        message: {
          type: 'string',
          description: 'The text message content to send'
        }
      },
      required: ['to', 'message']
    }
  },
  {
    name: 'send_whatsapp_product_link',
    description: 'Sends a branded product card with Amazon purchase link to a customer on WhatsApp.',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient phone number with country code (e.g. 919876543210)'
        },
        product_name: {
          type: 'string',
          description: 'Name of the product (e.g. Lord Ganesha Murti or Minimalist Phone Stand)'
        },
        price: {
          type: 'string',
          description: 'Price of the product (e.g. ₹550 or ₹349)'
        },
        amazon_link: {
          type: 'string',
          description: 'Direct Amazon / fast redirect link'
        }
      },
      required: ['to', 'product_name', 'price', 'amazon_link']
    }
  },
  {
    name: 'get_whatsapp_business_profile',
    description: 'Fetches the WhatsApp Business Profile details (About, Address, Website, Email, Description).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

async function handleToolCall(name, args) {
  if (!META_ACCESS_TOKEN) {
    throw new Error('META_ACCESS_TOKEN is not configured.');
  }

  if (name === 'send_whatsapp_message') {
    if (!WHATSAPP_PHONE_NUMBER_ID) {
      throw new Error('WHATSAPP_PHONE_NUMBER_ID is not configured. Please add WhatsApp to your Meta Developer App.');
    }
    const cleanTo = args.to.replace(/[^0-9]/g, '');
    const res = await fetch(`${GRAPH_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanTo,
        type: 'text',
        text: { preview_url: true, body: args.message }
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(`WhatsApp API Error: ${data.error.message}`);
    return { success: true, messageId: data.messages?.[0]?.id, recipient: cleanTo };
  }

  if (name === 'send_whatsapp_product_link') {
    if (!WHATSAPP_PHONE_NUMBER_ID) {
      throw new Error('WHATSAPP_PHONE_NUMBER_ID is not configured.');
    }
    const cleanTo = args.to.replace(/[^0-9]/g, '');
    const bodyText = `✨ *${args.product_name}* by Viyona Designs\n\n💰 Price: *${args.price}*\n🌿 100% Plant-Based Biodegradable Bio-Plastic\n\n🛒 *Order on Amazon:* ${args.amazon_link}\n\nFeel free to ask if you have any questions!`;
    const res = await fetch(`${GRAPH_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanTo,
        type: 'text',
        text: { preview_url: true, body: bodyText }
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(`WhatsApp API Error: ${data.error.message}`);
    return { success: true, messageId: data.messages?.[0]?.id, recipient: cleanTo };
  }

  if (name === 'get_whatsapp_business_profile') {
    if (!WHATSAPP_PHONE_NUMBER_ID) {
      throw new Error('WHATSAPP_PHONE_NUMBER_ID is not configured.');
    }
    const res = await fetch(`${GRAPH_API_BASE}/${WHATSAPP_PHONE_NUMBER_ID}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites`, {
      headers: { 'Authorization': `Bearer ${META_ACCESS_TOKEN}` }
    });
    const data = await res.json();
    if (data.error) throw new Error(`WhatsApp API Error: ${data.error.message}`);
    return data;
  }

  throw new Error(`Unknown tool: ${name}`);
}

// JSON-RPC Protocol Handler
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'tools/list') {
      console.log(JSON.stringify({ jsonrpc: '2.0', id, result: { tools: TOOLS } }));
    } else if (method === 'tools/call') {
      try {
        const result = await handleToolCall(params.name, params.arguments || {});
        console.log(JSON.stringify({
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
        }));
      } catch (err) {
        console.log(JSON.stringify({
          jsonrpc: '2.0',
          id,
          result: { isError: true, content: [{ type: 'text', text: `Error: ${err.message}` }] }
        }));
      }
    } else {
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method '${method}' not found` }
      }));
    }
  } catch (err) {
    console.error('Failed to parse request JSON:', err);
  }
});
