#!/usr/bin/env node

// create-bend initializer
// Delegates directly to bend-core CLI

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
  // Load the CJS version of bend-core CLI
  const { run } = require('bend-core/cli');
  
  // Execute the CLI
  run().catch((err) => {
    console.error('Error executing CLI:', err);
    process.exit(1);
  });
} catch (err) {
  console.error('Failed to load bend-core/cli:', err);
  console.error(err);
  process.exit(1);
}
