#!/usr/bin/env node
/**
 * Gmail Customer Support MCP Server for Viyona Designs
 * Configured for: viyonadesigns@gmail.com
 *
 * Enables Antigravity to:
 * - Read unread customer emails & order queries
 * - Search emails by customer name or Amazon order ID
 * - Send/draft professional customer support replies
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';
import { ImapFlow } from 'imapflow';
import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER || 'viyonadesigns@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';

const TOOLS = [
  {
    name: 'get_unread_customer_emails',
    description: 'Fetches recent unread customer inquiries and order emails from viyonadesigns@gmail.com.',
    inputSchema: {
      type: 'object',
      properties: {
        max_results: {
          type: 'number',
          description: 'Maximum number of emails to fetch (default: 5)'
        }
      }
    }
  },
  {
    name: 'search_customer_emails',
    description: 'Searches Gmail emails for specific customer queries, Amazon Order IDs, or email addresses.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword (e.g. "Amazon", "Order", customer name or email)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'send_support_reply',
    description: 'Sends or drafts an official reply to a customer from viyonadesigns@gmail.com with brand signature.',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Customer email address'
        },
        subject: {
          type: 'string',
          description: 'Email subject line'
        },
        body: {
          type: 'string',
          description: 'Email body content'
        }
      },
      required: ['to', 'subject', 'body']
    }
  }
];

function getImapClient() {
  if (!GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_APP_PASSWORD is not configured in mcp_config.json.');
  }
  return new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD.replace(/\s+/g, '')
    },
    logger: false
  });
}

async function handleToolCall(name, args) {
  if (name === 'get_unread_customer_emails') {
    const client = getImapClient();
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    const messages = [];
    try {
      const max = args.max_results || 5;
      const searchResult = await client.search({ seen: false }, { uid: true });
      const uids = (searchResult || []).slice(-max);
      
      if (uids.length > 0) {
        for await (const message of client.fetch(uids, { envelope: true, bodyParts: ['text'] })) {
          messages.push({
            uid: message.uid,
            from: message.envelope.from?.[0]?.address || 'Unknown',
            fromName: message.envelope.from?.[0]?.name || '',
            subject: message.envelope.subject || 'No Subject',
            date: message.envelope.date
          });
        }
      }
    } finally {
      lock.release();
      await client.logout();
    }
    return { account: GMAIL_USER, unread_count: messages.length, messages };
  }

  if (name === 'search_customer_emails') {
    const client = getImapClient();
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    const messages = [];
    try {
      const searchResult = await client.search({ body: args.query }, { uid: true });
      const uids = (searchResult || []).slice(-5);
      
      if (uids.length > 0) {
        for await (const message of client.fetch(uids, { envelope: true })) {
          messages.push({
            uid: message.uid,
            from: message.envelope.from?.[0]?.address || 'Unknown',
            fromName: message.envelope.from?.[0]?.name || '',
            subject: message.envelope.subject || 'No Subject',
            date: message.envelope.date
          });
        }
      }
    } finally {
      lock.release();
      await client.logout();
    }
    return { account: GMAIL_USER, count: messages.length, messages };
  }

  if (name === 'send_support_reply') {
    if (!GMAIL_APP_PASSWORD) {
      throw new Error('GMAIL_APP_PASSWORD is not configured in mcp_config.json.');
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD.replace(/\s+/g, '')
      }
    });

    const fullBody = `${args.body}\n\n---\nWarm regards,\nViyona Designs Support\nInstagram: @viyonadesigns\nWebsite: https://viyonadesigns.com`;

    const info = await transporter.sendMail({
      from: `"Viyona Designs Support" <${GMAIL_USER}>`,
      to: args.to,
      subject: args.subject,
      text: fullBody
    });

    return { success: true, messageId: info.messageId, recipient: args.to };
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
