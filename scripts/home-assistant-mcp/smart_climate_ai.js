#!/usr/bin/env node
/**
 * Autonomous AI Climate Director for Bedroom AC (Viyona Smart Studio)
 *
 * Full Autonomous Decision Matrix:
 * 1. Circadian Sleep & Anti-Chill Protection:
 *    - Late Night (12 AM - 4 AM): Automatically lifts temp to 26°C-27°C Eco to prevent night chills.
 *    - Early Morning (4 AM - 7:30 AM): Switches to 27°C, 'fan_only', or 'off' if ambient <= 24.5°C to avoid freezing wakeups.
 * 2. Dynamic Weather & Humidity Adaptation:
 *    - High Humidity (>=72%): Switches to 'dry' (Dehumidification) mode to extract moisture without over-cooling.
 *    - Pleasant Weather: Switches to 'fan_only' to maintain fresh airflow with zero compressor load.
 * 3. Instant Powerful Boost Mode:
 *    - Warm/Stuffy Room (>=28.5°C): Activates 'boost' (Powerful mode) for fast thermal pull-down, then ramps down to steady mode.
 * 4. Autonomous Power Management:
 *    - Decides whether the AC should be ON, OFF, in ECO, or FAN_ONLY mode based on presence and thermal comfort.
 *
 * Sensor Inputs:
 * - Outdoor Weather (Mainpuri, UP: Temp, Humidity, Dew Point, Forecast)
 * - Bedroom Alexa Presence/Motion (binary_sensor.alexa_motion)
 * - Bedroom Alexa Ambient Temperature (sensor.alexa_temperature)
 * - Indoor Precision Temperature & Humidity (sensor.display_weather_sensor_*)
 * - Panasonic MirAIe Bedroom AC State & Power (climate.bedroom_ac_bedroom_ac)
 */

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
const logFile = 'd:/DevSpace/homeassistant_config/ai_climate_log.json';

async function fetchEntity(entityId) {
  try {
    const res = await fetch(`${HA_URL}/api/states/${entityId}`, {
      headers: { 'Authorization': `Bearer ${HA_TOKEN}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function callService(domain, service, data) {
  try {
    const res = await fetch(`${HA_URL}/api/services/${domain}/${service}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HA_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (e) {
    console.error(`Failed to call ${domain}/${service}:`, e.message);
    return null;
  }
}

async function askGeminiForClimatePlan(telemetry) {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const timeFormatted = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

  let timePhase = 'Daytime';
  if (currentHour >= 0 && currentHour < 4) {
    timePhase = 'Late Night (Deep Sleep — High Risk of Chilling)';
  } else if (currentHour >= 4 && currentHour < 8) {
    timePhase = 'Early Morning (Coldest Ambient Window — Prevent Morning Shivers)';
  } else if (currentHour >= 8 && currentHour < 17) {
    timePhase = 'Afternoon / Peak Heat';
  } else if (currentHour >= 17 && currentHour < 22) {
    timePhase = 'Evening Relaxation';
  } else {
    timePhase = 'Night Sleep Entry';
  }

  const prompt = `You are the Autonomous AI Climate Director for Ravi's bedroom at Viyona Smart Studio in Mainpuri, Uttar Pradesh, India.
Current Time: ${timeFormatted} (IST).
Time Phase: ${timePhase}.

ENVIRONMENTAL & SENSOR TELEMETRY:
1. Bedroom Presence & Motion:
   - Status: ${telemetry.presence === 'on' ? 'OCCUPIED (Motion Detected)' : 'VACANT (No Motion)'}

2. Outdoor Weather (Mainpuri, UP):
   - Outdoor Temperature: ${telemetry.outdoor_temp}°C
   - Outdoor Humidity: ${telemetry.outdoor_humidity}%
   - Condition: ${telemetry.outdoor_condition}
   - Dew Point: ${telemetry.outdoor_dew_point}°C

3. Indoor Ambient Sensors:
   - Bedroom Alexa Ambient Temp: ${telemetry.alexa_temp}°C
   - Indoor Precision Room Temp: ${telemetry.indoor_temp}°C
   - Indoor Relative Humidity: ${telemetry.indoor_humidity}%

4. Panasonic Inverter AC Status:
   - Current HVAC State: ${telemetry.ac_state}
   - Current Target Temp: ${telemetry.ac_target_temp}°C
   - AC Internal Sensor Temp: ${telemetry.ac_internal_temp}°C
   - Current Fan Speed: ${telemetry.ac_fan_mode}
   - Current Preset Mode: ${telemetry.ac_preset_mode}

DECISION RULES (Ravi's Personal Preferences):
1. ANTI-CHILL & SLEEP COMFORT:
   - Late Night (12 AM - 4 AM): Body temperature drops during sleep. Prevent the room from feeling uncomfortably cold. Set target to 26°C or 27°C with 'eco' preset or 'low' fan.
   - Early Morning (4 AM - 7:30 AM): Ambient temperature outside is at its coolest. If room is already <= 24.5°C, switch to 'fan_only', set 27°C Eco, or turn 'off' so Ravi does not wake up chilled.
2. DYNAMIC MODE SELECTION:
   - High Humidity (>=72%): If room feels sticky/humid even at moderate temps (24-27°C), choose 'dry' (Dehumidification) mode to pull moisture out without making the room freezing.
   - Pleasant/Cool (Room <= 24°C & Humidity < 65%): Choose 'fan_only' or 'off' to maintain gentle circulation without compressor power.
   - Warm/Hot: Choose 'cool' mode.
3. INSTANT POWERFUL / BOOST MODE:
   - If the room is hot (>=28.5°C) and needs fast cool-down, set preset_mode to 'boost' (Powerful mode) with high/medium fan.
   - Once the room approaches target temperature, drop preset_mode to 'none' or 'eco'.
4. AUTONOMOUS ON / OFF:
   - You have full authority to turn the AC 'off' if the room is cool and pleasant or vacant during the day, and turn it ON ('cool'/'dry') when needed.

OUTPUT FORMAT:
Respond ONLY with a valid JSON object in this exact schema without markdown fences:
{"hvac_mode":"cool","target_temperature":25,"fan_mode":"medium","preset_mode":"none","reasoning":"Clear 1-sentence explanation of mode, anti-chill, or boost choice"}`;

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
    const reply = data.response?.speech?.plain?.speech || '';

    const jsonMatch = reply.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error('Gemini query error:', err.message);
  }

  // Fallback Rule-Based Thermal Optimizer
  const isLateNight = currentHour >= 0 && currentHour < 4;
  const isEarlyMorning = currentHour >= 4 && currentHour < 8;
  const isHighHumidity = (telemetry.indoor_humidity || 75) >= 72;
  const isHot = (telemetry.indoor_temp || 26) >= 28.5;

  if (isEarlyMorning && (telemetry.alexa_temp || 25) <= 24.5) {
    return {
      hvac_mode: 'fan_only',
      target_temperature: 27,
      fan_mode: 'low',
      preset_mode: 'eco',
      reasoning: 'Early morning anti-chill protection: room is already cool (<=24.5°C). Switched to fan-only mode to prevent over-chilling.'
    };
  }

  if (isLateNight) {
    return {
      hvac_mode: 'cool',
      target_temperature: 26,
      fan_mode: 'low',
      preset_mode: 'eco',
      reasoning: 'Late night sleep mode: Set to 26°C Eco with gentle low fan to avoid deep-sleep shivering.'
    };
  }

  if (isHot) {
    return {
      hvac_mode: 'cool',
      target_temperature: 24,
      fan_mode: 'high',
      preset_mode: 'boost',
      reasoning: 'Room temperature is elevated (>=28.5°C). Engaged powerful boost mode for fast thermal pull-down.'
    };
  }

  if (isHighHumidity) {
    return {
      hvac_mode: 'dry',
      target_temperature: 25,
      fan_mode: 'medium',
      preset_mode: 'none',
      reasoning: `High indoor humidity (${telemetry.indoor_humidity}%). Switched to dry mode for effective dehumidification without over-cooling.`
    };
  }

  return {
    hvac_mode: 'cool',
    target_temperature: 25,
    fan_mode: 'auto',
    preset_mode: 'none',
    reasoning: `Optimal daytime steady cooling at 25°C.`
  };
}

async function runOptimization() {
  console.log(`[${new Date().toISOString()}] 🚀 Running Autonomous AI Climate Optimizer...`);

  const weather = await fetchEntity('weather.forecast_home');
  const alexaMotion = await fetchEntity('binary_sensor.alexa_motion');
  const alexaTemp = await fetchEntity('sensor.alexa_temperature');
  const indoorTemp = await fetchEntity('sensor.display_weather_sensor_temperature');
  const indoorHumidity = await fetchEntity('sensor.display_weather_sensor_humidity');
  const bedroomAc = await fetchEntity('climate.bedroom_ac_bedroom_ac');

  if (!bedroomAc) {
    console.error('Could not find climate.bedroom_ac_bedroom_ac entity!');
    return;
  }

  const telemetry = {
    presence: alexaMotion?.state || 'on',
    outdoor_temp: weather?.attributes?.temperature || 31.7,
    outdoor_humidity: weather?.attributes?.humidity || 77,
    outdoor_condition: weather?.state || 'cloudy',
    outdoor_dew_point: weather?.attributes?.dew_point || 27.6,
    alexa_temp: parseFloat(alexaTemp?.state) || 26.5,
    indoor_temp: parseFloat(indoorTemp?.state) || 28.0,
    indoor_humidity: parseInt(indoorHumidity?.state) || 78,
    ac_state: bedroomAc.state,
    ac_target_temp: bedroomAc.attributes?.temperature || 24,
    ac_internal_temp: bedroomAc.attributes?.current_temperature || 26,
    ac_fan_mode: bedroomAc.attributes?.fan_mode || 'medium',
    ac_preset_mode: bedroomAc.attributes?.preset_mode || 'none'
  };

  console.log('📊 Telemetry:', JSON.stringify(telemetry, null, 2));

  const decision = await askGeminiForClimatePlan(telemetry);
  console.log('🧠 Gemini Autonomous Decision:', JSON.stringify(decision, null, 2));

  const acEntity = 'climate.bedroom_ac_bedroom_ac';

  // 1. Handle Power / HVAC Mode
  if (decision.hvac_mode && decision.hvac_mode !== telemetry.ac_state) {
    if (decision.hvac_mode === 'off') {
      await callService('climate', 'turn_off', { entity_id: acEntity });
    } else {
      if (telemetry.ac_state === 'off') {
        await callService('climate', 'turn_on', { entity_id: acEntity });
      }
      await callService('climate', 'set_hvac_mode', { entity_id: acEntity, hvac_mode: decision.hvac_mode });
    }
  }

  // 2. Set Temperature (Clamped safely between 20°C and 28°C)
  if (decision.hvac_mode !== 'off') {
    const safeTemp = Math.min(28, Math.max(20, decision.target_temperature || 25));
    if (safeTemp !== telemetry.ac_target_temp) {
      await callService('climate', 'set_temperature', { entity_id: acEntity, temperature: safeTemp });
    }

    // 3. Set Fan Mode
    if (decision.fan_mode && decision.fan_mode !== telemetry.ac_fan_mode) {
      await callService('climate', 'set_fan_mode', { entity_id: acEntity, fan_mode: decision.fan_mode });
    }

    // 4. Set Preset Mode (none, eco, boost / powerful)
    if (decision.preset_mode && decision.preset_mode !== telemetry.ac_preset_mode) {
      await callService('climate', 'set_preset_mode', { entity_id: acEntity, preset_mode: decision.preset_mode });
    }
  }

  // 5. Audit Log
  const logEntry = {
    timestamp: new Date().toISOString(),
    telemetry,
    decision
  };

  let logs = [];
  try {
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
  } catch (e) {}

  logs.unshift(logEntry);
  if (logs.length > 100) logs = logs.slice(0, 100);

  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');
  console.log('✅ Autonomous Climate Action Applied Successfully!');

  return logEntry;
}

runOptimization();
