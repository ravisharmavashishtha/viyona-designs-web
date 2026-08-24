#!/usr/bin/env node
/**
 * 15-Minute Daemon Runner for Bedroom AC AI Climate Optimization
 */

import { spawn } from 'node:child_process';
import path from 'node:path';

const scriptPath = 'd:/DevSpace/3dprintingbusiness/scripts/home-assistant-mcp/smart_climate_ai.js';
const INTERVAL_MS = 15 * 60 * 1000; // 15 Minutes

function executeOptimization() {
  console.log(`[${new Date().toISOString()}] ⏳ Triggering 15-minute AI Climate Optimization cycle...`);
  const child = spawn('node', [scriptPath], { stdio: 'inherit' });
  child.on('close', (code) => {
    console.log(`[${new Date().toISOString()}] 🏁 Cycle completed with exit code ${code}. Next run in 15 minutes.`);
  });
}

// Run immediately on boot
executeOptimization();

// Schedule every 15 minutes
setInterval(executeOptimization, INTERVAL_MS);

console.log(`================================================================`);
console.log(`🚀 Bedroom AC AI Smart Climate Optimizer 15-Min Daemon Active!`);
console.log(`================================================================`);
