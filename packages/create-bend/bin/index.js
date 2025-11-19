#!/usr/bin/env node

// create-bend initializer
// This is executed when someone runs: npm create bend, pnpm create bend, etc.

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Detect which package manager was used to invoke this
function detectInvoker() {
  const userAgent = process.env.npm_config_user_agent;
  
  if (!userAgent) return 'npx';
  
  if (userAgent.includes('pnpm')) return 'pnpm dlx';
  if (userAgent.includes('yarn')) return 'yarn dlx';
  if (userAgent.includes('bun')) return 'bunx';
  return 'npx';
}

async function main() {
  console.log('Welcome to Bend - Backend Project Scaffolder\n');
  
  // Get the invoker command
  const invoker = detectInvoker();
  
  // Use bend-core CLI
  const args = ['bend-core', ...process.argv.slice(2)];
  
  console.log(`Using: ${invoker} ${args.join(' ')}\n`);
  
  // Spawn the bend-core CLI
  const child = spawn(invoker.split(' ')[0], [...invoker.split(' ').slice(1), ...args], {
    stdio: 'inherit',
    shell: true,
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
