import { spawn } from 'node:child_process';
import mqtt from 'mqtt';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

const ip = process.env.BAMBU_PRINTER_IP || '192.168.1.8';
const accessCode = process.env.BAMBU_ACCESS_CODE || '16017586';
const serial = process.env.BAMBU_SERIAL_NUMBER || '03900D622116577';
const outputPath = 'C:/Users/Ravi S Vashishtha/.gemini/antigravity/brain/10747782-d4f3-45f1-92ca-8a9fb450a94a/bambu_live_snapshot.jpg';

async function captureSnapshot() {
  console.log('1. Ensuring toolhead work light is ON via MQTT...');
  const client = mqtt.connect('mqtts://' + ip + ':8883', {
    username: 'bblp',
    password: accessCode,
    rejectUnauthorized: false
  });

  await new Promise((resolve) => {
    client.on('connect', () => {
      client.publish('device/' + serial + '/request', JSON.stringify({
        system: {
          sequence_id: '0',
          command: 'ledctrl',
          led_node: 'chamber_light',
          led_mode: 'on',
          led_on_time: 500,
          led_off_time: 500,
          loop_times: 0,
          interval_time: 0
        }
      }), {}, () => {
        console.log('Work light is ON.');
        client.end(true);
        resolve();
      });
    });
    client.on('error', () => {
      client.end(true);
      resolve();
    });
  });

  console.log('2. Capturing camera snapshot via RTSPS (port 322)...');
  const streamUrl = `rtsps://bblp:${accessCode}@${ip}:322/live`;
  
  const args = [
    '-y',
    '-rtsp_transport', 'tcp',
    '-i', streamUrl,
    '-frames:v', '1',
    '-q:v', '2',
    outputPath
  ];

  return new Promise((resolve, reject) => {
    const ffmpegProc = spawn(ffmpeg.path, args);
    let logs = '';

    ffmpegProc.stderr.on('data', (d) => {
      logs += d.toString();
    });

    ffmpegProc.on('close', (code) => {
      console.log('FFmpeg exited with code:', code);
      if (code === 0) {
        console.log('Snapshot successfully saved at:', outputPath);
        resolve(outputPath);
      } else {
        console.error('FFmpeg logs:\n', logs);
        reject(new Error('Failed to capture frame from printer camera.'));
      }
    });
  });
}

captureSnapshot();
