#!/usr/bin/env node

// create-bend initializer
// Delegates directly to bend-core CLI

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Load the CJS version of bend-core CLI to avoid ESM compatibility issues
const { run } = require('bend-core/cli');

// Execute the CLI
run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
