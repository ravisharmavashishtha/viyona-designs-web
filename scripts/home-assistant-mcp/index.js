#!/usr/bin/env node
/**
 * Home Assistant MCP Server for Viyona Designs
 * Integrates directly with Home Assistant Core REST API (Port 8123)
 *
 * Connected Systems:
 * - Google Gemini AI Conversation Agent (conversation.google_ai_conversation)
 * - Amazon Alexa Echo Speakers (Dynamic Voice Announcements & TTS)
 * - Panasonic MirAIe Smart Inverter ACs (Office AC, Bedroom AC, Papa AC)
 * - Bambu Lab A1 3D Printer & AMS Lite
 * - Philips WiZ RGB Smart Bulb
 * - TP-Link Tapo Smart Hub & Switches
 * - Wipro Smart Power Strip (4 Sockets + Energy Monitor)
 *
 * Tools:
 * - ha_ask_gemini (Ask Google Gemini conversational AI about studio status & devices)
 * - ha_speak_announcement (Dynamic Voice Announcements on Echo speakers)
 * - ha_control_climate (Panasonic AC power, temperature, cool/eco/fan mode, fan speed)
 * - ha_control_entity (Control smart lights, smart plugs, switches, fans, AC display)
 * - ha_list_entities (List all smart home entities and devices)
 * - ha_trigger_automation (Trigger scenes, scripts, and automations)
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';
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

const TOOLS = [
  {
    name: 'ha_ask_gemini',
    description: 'Queries Google Gemini AI inside Home Assistant. Gemini has real-time awareness of all 202 smart devices, 3D printer telemetry, ACs, and power consumption.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The natural language question or command for Gemini AI'
        }
      },
      required: ['prompt']
    }
  },
  {
    name: 'ha_speak_announcement',
    description: 'Broadcasts dynamic Text-to-Speech announcements directly to your Amazon Echo speakers (Ravi\'s Echo Dot or Alexa).',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The dynamic voice message to speak out loud'
        },
        speaker: {
          type: 'string',
          enum: ['all', 'ravi_echo_dot', 'alexa'],
          description: 'Target Echo speaker (default: "all")'
        }
      },
      required: ['message']
    }
  },
  {
    name: 'ha_control_climate',
    description: 'Controls Panasonic MirAIe Smart Inverter ACs (Office AC, Bedroom AC, Papa AC). Sets power, target temperature, HVAC mode, and fan speed.',
    inputSchema: {
      type: 'object',
      properties: {
        ac_name: {
          type: 'string',
          enum: ['office', 'bedroom', 'papa', 'all'],
          description: 'Which AC to control'
        },
        hvac_mode: {
          type: 'string',
          enum: ['cool', 'off', 'auto', 'dry', 'fan_only'],
          description: 'HVAC operation mode'
        },
        temperature: {
          type: 'number',
          description: 'Target temperature in Celsius (16 to 30)'
        },
        fan_mode: {
          type: 'string',
          enum: ['auto', 'low', 'medium', 'high'],
          description: 'Fan speed'
        },
        preset_mode: {
          type: 'string',
          enum: ['none', 'eco', 'boost', 'clean'],
          description: 'Special AC preset mode'
        }
      },
      required: ['ac_name']
    }
  },
  {
    name: 'ha_control_entity',
    description: 'Turns any smart light, smart plug, switch, fan, or appliance connected to Home Assistant ON or OFF.',
    inputSchema: {
      type: 'object',
      properties: {
        entity_id: {
          type: 'string',
          description: 'The entity ID in Home Assistant (e.g. "light.wiz_rgbw_tunable_04f02c", "switch.wipro_smart_extension_socket_1", "switch.office_ac_display")'
        },
        action: {
          type: 'string',
          enum: ['turn_on', 'turn_off', 'toggle'],
          description: 'Action to perform'
        },
        brightness_pct: {
          type: 'number',
          description: 'Optional brightness percentage (1 to 100) for smart dimmers/lights'
        },
        rgb_color: {
          type: 'array',
          items: { type: 'number' },
          description: 'Optional RGB color array e.g. [255, 100, 50]'
        }
      },
      required: ['entity_id', 'action']
    }
  },
  {
    name: 'ha_list_entities',
    description: 'Discovers and lists all smart home devices, lights, switches, ACs, sensors, and Echo speakers registered in Home Assistant.',
    inputSchema: {
      type: 'object',
      properties: {
        domain_filter: {
          type: 'string',
          description: 'Optional filter by domain (e.g. "climate", "light", "switch", "media_player", "sensor", "camera", "conversation")'
        }
      }
    }
  },
  {
    name: 'ha_trigger_automation',
    description: 'Triggers a Home Assistant automation, script, or scene.',
    inputSchema: {
      type: 'object',
      properties: {
        entity_id: {
          type: 'string',
          description: 'Automation or script entity ID'
        }
      },
      required: ['entity_id']
    }
  }
];

async function callHaApi(endpoint, method = 'GET', body = null) {
  const url = `${HA_URL}/api/${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${HA_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Home Assistant API error (${res.status}): ${errorText}`);
  }
  return await res.json();
}

async function handleToolCall(name, args) {
  if (name === 'ha_ask_gemini') {
    const res = await callHaApi('conversation/process', 'POST', {
      agent_id: 'conversation.google_ai_conversation',
      text: args.prompt
    });
    return {
      success: true,
      prompt: args.prompt,
      gemini_response: res.response?.speech?.plain?.speech || res
    };
  }

  if (name === 'ha_list_entities') {
    const states = await callHaApi('states');
    let filtered = states;
    if (args.domain_filter) {
      filtered = states.filter(s => s.entity_id.startsWith(args.domain_filter + '.'));
    }
    const simplified = filtered.map(s => ({
      entity_id: s.entity_id,
      state: s.state,
      friendly_name: s.attributes?.friendly_name || s.entity_id,
      current_temp: s.attributes?.current_temperature,
      target_temp: s.attributes?.temperature,
      energy_kwh: s.attributes?.unit_of_measurement === 'kWh' ? s.state : undefined
    }));
    return { count: simplified.length, entities: simplified };
  }

  if (name === 'ha_speak_announcement') {
    const targets = [];
    if (!args.speaker || args.speaker === 'all') {
      targets.push('notify.everywhere_announce', 'notify.ravi_s_echo_dot_announce', 'notify.alexa_announce', 'notify.home_theater_announce');
    } else if (args.speaker === 'ravi_echo_dot') {
      targets.push('notify.ravi_s_echo_dot_announce');
    } else if (args.speaker === 'alexa') {
      targets.push('notify.alexa_announce');
    } else if (args.speaker === 'home_theater') {
      targets.push('notify.home_theater_announce');
    }

    const results = [];
    for (const entity of targets) {
      try {
        const res = await callHaApi('services/notify/send_message', 'POST', {
          entity_id: entity,
          message: args.message
        });
        results.push({ target: entity, status: 'success' });
      } catch (err) {
        results.push({ target: entity, status: 'error', error: err.message });
      }
    }

    return {
      success: true,
      message_spoken: args.message,
      delivered_to: results
    };
  }

  if (name === 'ha_control_climate') {
    const acMap = {
      office: ['climate.office_ac_office_ac'],
      bedroom: ['climate.bedroom_ac_bedroom_ac'],
      papa: ['climate.papa_ac_papa_ac'],
      all: ['climate.office_ac_office_ac', 'climate.bedroom_ac_bedroom_ac', 'climate.papa_ac_papa_ac']
    };

    const targetAcs = acMap[args.ac_name] || [args.ac_name];
    const actionsTaken = [];

    for (const acEntity of targetAcs) {
      if (args.hvac_mode) {
        await callHaApi('services/climate/set_hvac_mode', 'POST', {
          entity_id: acEntity,
          hvac_mode: args.hvac_mode
        });
        actionsTaken.push(`Set mode to ${args.hvac_mode}`);
      }

      if (args.temperature) {
        await callHaApi('services/climate/set_temperature', 'POST', {
          entity_id: acEntity,
          temperature: args.temperature
        });
        actionsTaken.push(`Set temperature to ${args.temperature}°C`);
      }

      if (args.fan_mode) {
        await callHaApi('services/climate/set_fan_mode', 'POST', {
          entity_id: acEntity,
          fan_mode: args.fan_mode
        });
        actionsTaken.push(`Set fan to ${args.fan_mode}`);
      }

      if (args.preset_mode) {
        await callHaApi('services/climate/set_preset_mode', 'POST', {
          entity_id: acEntity,
          preset_mode: args.preset_mode
        });
        actionsTaken.push(`Set preset to ${args.preset_mode}`);
      }
    }

    return {
      success: true,
      controlled_acs: targetAcs,
      actions: actionsTaken
    };
  }

  if (name === 'ha_control_entity') {
    const domain = args.entity_id.split('.')[0] || 'homeassistant';
    const service = args.action; // turn_on, turn_off, toggle
    const payload = { entity_id: args.entity_id };
    if (args.brightness_pct && service === 'turn_on') {
      payload.brightness_pct = args.brightness_pct;
    }
    if (args.rgb_color && service === 'turn_on') {
      payload.rgb_color = args.rgb_color;
    }
    const res = await callHaApi(`services/${domain}/${service}`, 'POST', payload);
    return { success: true, entity_id: args.entity_id, action: args.action, result: res };
  }

  if (name === 'ha_trigger_automation') {
    const domain = args.entity_id.split('.')[0];
    const service = 'trigger';
    const res = await callHaApi(`services/${domain}/${service}`, 'POST', { entity_id: args.entity_id });
    return { success: true, triggered: args.entity_id, result: res };
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
