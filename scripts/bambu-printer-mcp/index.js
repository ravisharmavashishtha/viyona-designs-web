#!/usr/bin/env node
/**
 * Bambu Lab A1 Combo 3D Printer MCP Server for Viyona Designs
 * Communicates directly with Bambu A1 & AMS Lite via local high-speed MQTT (Port 8883 SSL)
 *
 * Tools:
 * - get_printer_status (Bed/Nozzle temp, print progress %, remaining time, print stage)
 * - get_ams_filament_status (AMS Lite 4-spool colors, types, remaining levels)
 * - control_printer_job (Pause, Resume, Stop print job, Change speed mode)
 * - toggle_chamber_light (Turn LED work light on/off)
 *
 * Runs over standard Stdio JSON-RPC protocol.
 */

import readline from 'node:readline';
import mqtt from 'mqtt';

// ─── Environment Configuration ────────────────────────────────────────────────
const BAMBU_PRINTER_IP = process.env.BAMBU_PRINTER_IP || '';
const BAMBU_ACCESS_CODE = process.env.BAMBU_ACCESS_CODE || '';
const BAMBU_SERIAL_NUMBER = process.env.BAMBU_SERIAL_NUMBER || '';

const TOOLS = [
  {
    name: 'get_printer_status',
    description: 'Fetches real-time status of the Bambu A1 printer: print progress %, remaining minutes, nozzle & bed temperatures, current layer, and job status.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_ams_filament_status',
    description: 'Retrieves filament information from the AMS Lite: slot 1-4 filament types, color hex codes, and spool status.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'control_printer_job',
    description: 'Controls the active print job on the Bambu A1: pause, resume, stop, or adjust print speed (silent, standard, sport, ludicrous).',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['pause', 'resume', 'stop', 'speed'],
          description: 'The control action to perform'
        },
        speed_level: {
          type: 'number',
          enum: [1, 2, 3, 4],
          description: 'Speed level (1: Silent 50%, 2: Standard 100%, 3: Sport 124%, 4: Ludicrous 166%). Only needed if action is "speed".'
        }
      },
      required: ['action']
    }
  },
  {
    name: 'toggle_chamber_light',
    description: 'Turns the Bambu A1 toolhead / chamber work light ON or OFF.',
    inputSchema: {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
          enum: ['on', 'off'],
          description: 'Turn light "on" or "off"'
        }
      },
      required: ['mode']
    }
  }
];

function fetchMqttReport(timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    if (!BAMBU_PRINTER_IP || !BAMBU_ACCESS_CODE || !BAMBU_SERIAL_NUMBER) {
      return reject(new Error('Bambu printer configuration missing. Please provide BAMBU_PRINTER_IP, BAMBU_ACCESS_CODE, and BAMBU_SERIAL_NUMBER in mcp_config.json.'));
    }

    const brokerUrl = `mqtts://${BAMBU_PRINTER_IP}:8883`;
    const client = mqtt.connect(brokerUrl, {
      username: 'bblp',
      password: BAMBU_ACCESS_CODE,
      rejectUnauthorized: false,
      connectTimeout: 4000
    });

    const reportTopic = `device/${BAMBU_SERIAL_NUMBER}/report`;
    const requestTopic = `device/${BAMBU_SERIAL_NUMBER}/request`;

    const timer = setTimeout(() => {
      client.end(true);
      reject(new Error(`Timeout connecting to Bambu printer at ${BAMBU_PRINTER_IP}:8883. Ensure printer is turned on and on the same Wi-Fi network.`));
    }, timeoutMs);

    client.on('connect', () => {
      client.subscribe(reportTopic, () => {
        // Send a pushall request to trigger full state report immediately
        const pushAllCmd = JSON.stringify({
          pushing: {
            command: 'pushall',
            version: 1,
            push_target: 1,
            sequence_id: '1'
          }
        });
        client.publish(requestTopic, pushAllCmd);
      });
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        if (payload && payload.print) {
          clearTimeout(timer);
          client.end(true);
          resolve(payload.print);
        }
      } catch (err) {
        // Continue waiting for valid JSON report
      }
    });

    client.on('error', (err) => {
      clearTimeout(timer);
      client.end(true);
      reject(err);
    });
  });
}

function sendMqttCommand(commandPayload) {
  return new Promise((resolve, reject) => {
    if (!BAMBU_PRINTER_IP || !BAMBU_ACCESS_CODE || !BAMBU_SERIAL_NUMBER) {
      return reject(new Error('Bambu printer configuration missing. Please configure BAMBU_PRINTER_IP, BAMBU_ACCESS_CODE, and BAMBU_SERIAL_NUMBER in mcp_config.json.'));
    }

    const brokerUrl = `mqtts://${BAMBU_PRINTER_IP}:8883`;
    const client = mqtt.connect(brokerUrl, {
      username: 'bblp',
      password: BAMBU_ACCESS_CODE,
      rejectUnauthorized: false,
      connectTimeout: 4000
    });

    const requestTopic = `device/${BAMBU_SERIAL_NUMBER}/request`;

    client.on('connect', () => {
      client.publish(requestTopic, JSON.stringify(commandPayload), {}, (err) => {
        client.end(true);
        if (err) return reject(err);
        resolve({ success: true, command: commandPayload.print?.command });
      });
    });

    client.on('error', (err) => {
      client.end(true);
      reject(err);
    });
  });
}

const STAGE_LOOKUP = {
  0: 'Printing',
  1: 'Auto Bed Leveling',
  2: 'Heating Hotbed',
  3: 'Sweeping XY Axis',
  4: 'Dynamic Flow Calibration',
  5: 'Nozzle Temperature Tuning',
  6: 'Vibration Compensation',
  7: 'Motor Noise Calibration',
  8: 'Homing Toolhead',
  9: 'Wiping Nozzle',
  10: 'Checking Extruder',
  11: 'Heating Nozzle',
  12: 'Calibrating Extruder',
  13: 'Cooling Down',
  14: 'Paused by User',
  15: 'Paused - Filament Runout',
  16: 'Paused - Filament Clog',
  255: 'Idle'
};

const SPEED_LOOKUP = {
  1: 'Silent (50%)',
  2: 'Standard (100%)',
  3: 'Sport (124%)',
  4: 'Ludicrous (166%)'
};

async function handleToolCall(name, args) {
  if (name === 'get_printer_status') {
    const p = await fetchMqttReport();
    const gcodeState = p.gcode_state || 'UNKNOWN';
    const percent = p.mc_percent !== undefined ? p.mc_percent : (p.percent !== undefined ? p.percent : 0);
    const remainingMins = p.mc_remaining_time !== undefined ? p.mc_remaining_time : 0;
    const stageId = p.stg_cur !== undefined ? p.stg_cur : 255;
    const stageName = STAGE_LOOKUP[stageId] || `Stage ${stageId}`;
    const speedLevel = p.spd_lvl !== undefined ? p.spd_lvl : 2;

    return {
      printer_model: 'Bambu Lab A1 Combo',
      serial_number: BAMBU_SERIAL_NUMBER,
      gcode_state: gcodeState,
      current_stage: stageName,
      progress_percent: `${percent}%`,
      remaining_time: `${Math.floor(remainingMins / 60)}h ${remainingMins % 60}m (${remainingMins} mins total)`,
      current_subtask: p.subtask_name || p.gcode_file || 'None',
      layer_info: {
        current_layer: p.layer_num || 0,
        total_layers: p.total_layer_num || 0
      },
      temperatures: {
        nozzle: {
          current: `${p.nozzle_temper || 0}°C`,
          target: `${p.nozzle_target_temper || 0}°C`
        },
        bed: {
          current: `${p.bed_temper || 0}°C`,
          target: `${p.bed_target_temper || 0}°C`
        }
      },
      speed_mode: SPEED_LOOKUP[speedLevel] || 'Standard (100%)',
      chamber_light: p.lights_report?.[0]?.mode === 'on' ? 'ON' : 'OFF',
      wifi_signal: p.wifi_signal || 'N/A'
    };
  }

  if (name === 'get_ams_filament_status') {
    const p = await fetchMqttReport();
    const amsList = p.ams?.ams || [];
    const trays = [];

    if (amsList.length > 0) {
      const amsUnit = amsList[0];
      for (const tray of (amsUnit.tray || [])) {
        trays.push({
          slot_id: parseInt(tray.id || 0) + 1,
          filament_type: tray.tray_type || 'Empty / Unknown',
          color_hex: `#${(tray.tray_color || 'FFFFFF').slice(0, 6)}`,
          tray_sub_brands: tray.tray_sub_brands || 'Bambu / Generic',
          remaining_percent: tray.remain !== undefined ? `${tray.remain}%` : 'Unknown',
          temp_range: `${tray.nozzle_temp_min || 190}°C - ${tray.nozzle_temp_max || 230}°C`
        });
      }
    }

    return {
      ams_unit: 'AMS Lite (4-Slot)',
      humidity_idx: p.ams?.ams?.[0]?.humidity || 'N/A',
      slots: trays.length > 0 ? trays : 'No AMS Lite trays detected'
    };
  }

  if (name === 'control_printer_job') {
    let payload = {};
    if (args.action === 'pause') {
      payload = { print: { sequence_id: '0', command: 'pause' } };
    } else if (args.action === 'resume') {
      payload = { print: { sequence_id: '0', command: 'resume' } };
    } else if (args.action === 'stop') {
      payload = { print: { sequence_id: '0', command: 'stop' } };
    } else if (args.action === 'speed') {
      payload = {
        print: {
          sequence_id: '0',
          command: 'print_speed',
          param: `${args.speed_level || 2}`
        }
      };
    }

    const res = await sendMqttCommand(payload);
    return { success: true, executed_action: args.action, details: res };
  }

  if (name === 'toggle_chamber_light') {
    const payload = {
      system: {
        sequence_id: '0',
        command: 'ledctrl',
        led_node: 'chamber_light',
        led_mode: args.mode === 'on' ? 'on' : 'off',
        led_on_time: 500,
        led_off_time: 500,
        loop_times: 0,
        interval_time: 0
      }
    };
    const res = await sendMqttCommand(payload);
    return { success: true, light_mode: args.mode, details: res };
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
