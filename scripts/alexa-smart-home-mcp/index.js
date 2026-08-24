#!/usr/bin/env node
/**
 * Amazon Alexa & Smart Home Voice MCP Server for Viyona Designs
 * Delivers instant text-to-speech voice announcements directly to your Echo speakers
 *
 * Tools:
 * - alexa_speak_announcement (Instant Spoken Announcements on Echo speakers)
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';

const VOICE_MONKEY_TOKEN = process.env.VOICE_MONKEY_TOKEN || '10519-420c8-3c2cf-799a9-6ac87-5d411-47-c0756d75-cae0-4f2a-aecb-7ff2b453ae74';
const VOICE_MONKEY_DEVICE = process.env.VOICE_MONKEY_DEVICE || 'bedroom-alexa-bogsp';

const TOOLS = [
  {
    name: 'alexa_speak_announcement',
    description: 'Makes your Amazon Echo speaker speak any custom announcement or dynamic voice text out loud.',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The text message for Alexa to speak out loud'
        },
        device: {
          type: 'string',
          description: 'Target Echo device ID (default: bedroom-alexa-bogsp)'
        }
      },
      required: ['message']
    }
  }
];

async function speakAnnouncement(message, device) {
  const targetDevice = device || VOICE_MONKEY_DEVICE;
  const res = await fetch('https://api-v3.voicemonkey.io/announce', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: VOICE_MONKEY_TOKEN,
      device: targetDevice,
      speech: message
    })
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Alexa Speech Error: ${data.error}`);
  }
  return {
    success: true,
    spoken_message: message,
    device: targetDevice,
    result: data
  };
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
        if (params.name === 'alexa_speak_announcement') {
          const result = await speakAnnouncement(params.arguments?.message, params.arguments?.device);
          console.log(JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
          }));
        } else {
          throw new Error(`Unknown tool: ${params.name}`);
        }
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
