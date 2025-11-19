#!/usr/bin/env node

// Import the CLI entry point from bend-core
// We use a try-catch to handle cases where bend-core is not built yet or path is wrong
try {
  const core = require('bend-core/dist/cli/index.js');
  if (core.main) {
    core.main();
  } else {
    console.error('Error: bend-core/dist/cli/index.js does not export main()');
    process.exit(1);
  }
} catch (err) {
  console.error('Error: Could not load bend-core. Make sure it is built.');
  console.error(err);
  process.exit(1);
}
