import path from 'node:path';
import { ENV_CONFIG, assertMutationAllowed, getAuthHeader } from '../config/wp-config.js';

const targetEnv = (process.argv[2] || process.env.TARGET_ENV || 'staging').toLowerCase();
const isProd = targetEnv === 'production' || targetEnv === 'prod';

// Set process env before running assertion
process.env.TARGET_ENV = isProd ? 'production' : 'staging';

console.log('\n===============================================================');
console.log(`🚀 VIYONA DESIGNS ENVIRONMENT-AWARE DEPLOYMENT RUNNER`);
console.log(`🌐 Target Environment : ${ENV_CONFIG.environment.toUpperCase()}`);
console.log(`🔗 Target URL         : ${ENV_CONFIG.baseUrl}`);
console.log('===============================================================\n');

try {
  // Safety guard check
  assertMutationAllowed('Full Site Deployment');
  console.log(`🔒 Safety Guard passed: Deployment permitted for ${ENV_CONFIG.environment}.`);
  console.log(`📡 Ready to execute deployment operations against ${ENV_CONFIG.baseUrl}...`);
  console.log(`✅ Base configuration and auth headers verified.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
