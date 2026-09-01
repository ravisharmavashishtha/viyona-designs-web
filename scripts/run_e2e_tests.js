import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const targetEnv = (process.argv[2] || process.env.TARGET_ENV || 'staging').toLowerCase();
const isProd = targetEnv === 'production' || targetEnv === 'prod';
const envName = isProd ? 'PRODUCTION (LIVE)' : 'STAGING';
const targetUrl = isProd ? 'https://viyonadesigns.com' : 'https://mintcream-antelope-246402.hostingersite.com';

console.log('\n===============================================================');
console.log(`🧪 VIYONA DESIGNS ON-DEMAND REGRESSION TEST RUNNER`);
console.log(`🌐 Target Environment : ${envName}`);
console.log(`🔗 Target URL         : ${targetUrl}`);
console.log('===============================================================\n');

// Ensure results directory exists
const resultsDir = path.resolve('test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Pass environment variables to child process
const env = {
  ...process.env,
  TARGET_ENV: isProd ? 'production' : 'staging'
};

const args = ['playwright', 'test', ...process.argv.slice(3)];

const child = spawn('npx', args, {
  stdio: 'inherit',
  shell: true,
  env
});

child.on('close', (code) => {
  console.log('\n===============================================================');
  if (code === 0) {
    console.log(`✅ ALL REGRESSION TESTS PASSED ON ${envName}!`);
  } else {
    console.log(`❌ REGRESSION TESTS DETECTED FAILURES (Exit code ${code})`);
  }
  console.log(`📊 View HTML Report: npx playwright show-report test-results/html-report`);
  console.log('===============================================================\n');
  process.exit(code);
});
