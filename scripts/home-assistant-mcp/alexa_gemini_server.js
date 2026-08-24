import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function getHaToken() {
  if (process.env.HA_TOKEN) return process.env.HA_TOKEN;
  try {
    const configPath = path.join(os.homedir(), '.gemini', 'config', 'mcp_config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.mcpServers?.['home-assistant']?.env?.HA_TOKEN) {
        return config.mcpServers['home-assistant'].env.HA_TOKEN;
      }
    }
  } catch (e) {}
  return '';
}

const HA_URL = process.env.HA_URL || 'http://127.0.0.1:8123';
const HA_TOKEN = getHaToken();
const PORT = 8125;

async function askGemini(prompt) {
  try {
    const res = await fetch(`${HA_URL}/api/conversation/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HA_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: 'conversation.google_ai_conversation',
        text: prompt
      })
    });
    const data = await res.json();
    return data.response?.speech?.plain?.speech || "I am connected, but didn't receive a response from Gemini.";
  } catch (err) {
    return `Error connecting to Gemini: ${err.message}`;
  }
}

async function handleAlexaRequest(alexaReq) {
  const reqType = alexaReq.request?.type;
  console.log(`[Alexa Event] Type: ${reqType}`);

  // Launch Request: "Alexa, open Gemini"
  if (reqType === 'LaunchRequest') {
    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Greetings Ravi! Gemini AI is online. What would you like to ask or play?'
        },
        reprompt: {
          outputSpeech: {
            type: 'PlainText',
            text: 'I am still listening. You can ask anything about your studio or request a song.'
          }
        },
        shouldEndSession: false
      }
    };
  }

  // Intent Request: User said something to Gemini
  if (reqType === 'IntentRequest') {
    const intentName = alexaReq.request?.intent?.name;
    const query = alexaReq.request?.intent?.slots?.query?.value ||
                  alexaReq.request?.intent?.slots?.SearchQuery?.value ||
                  alexaReq.request?.intent?.slots?.CatchAll?.value;

    console.log(`[Alexa Intent] Name: ${intentName}, Query: "${query}"`);

    // Stop / Cancel
    if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
      return {
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'PlainText',
            text: 'Goodbye Ravi! Talk to you soon.'
          },
          shouldEndSession: true
        }
      };
    }

    const userPrompt = query || 'Hello Gemini, what can you do?';
    
    // Check if user requested a song or music playback
    if (userPrompt.toLowerCase().startsWith('play ') || userPrompt.toLowerCase().includes('song')) {
      // Trigger media playback in Home Assistant
      const songTitle = userPrompt.replace(/^play\s+/i, '');
      try {
        await fetch(`${HA_URL}/api/services/media_player/play_media`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${HA_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entity_id: 'media_player.ravi_s_echo_dot',
            media_content_id: songTitle,
            media_content_type: 'SPOTIFY'
          })
        });
      } catch (e) {}
    }

    const geminiReply = await askGemini(userPrompt);

    return {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: geminiReply
        },
        reprompt: {
          outputSpeech: {
            type: 'PlainText',
            text: 'What else can I help you with?'
          }
        },
        shouldEndSession: false // Keeps continuous conversation open!
      }
    };
  }

  // Session Ended
  return {
    version: '1.0',
    response: {
      shouldEndSession: true
    }
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const alexaReq = JSON.parse(body);
        const alexaRes = await handleAlexaRequest(alexaReq);
        res.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
        res.end(JSON.stringify(alexaRes));
      } catch (err) {
        console.error('Server error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.message);
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Alexa Gemini AI Skill Endpoint Live');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`================================================================`);
  console.log(`🚀 Alexa Gemini Continuous Dialogue Server Live on Port ${PORT}`);
  console.log(`================================================================`);
});
