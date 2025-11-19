import fs from 'fs/promises';
import path from 'path';

// Simple script to compile templates
// For now, this is a placeholder that just creates the expected directory
const distTemplatesPath = path.join(process.cwd(), 'packages/bend-core/dist/templates-compiled');

async function main() {
  try {
    await fs.mkdir(distTemplatesPath, { recursive: true });
    console.log('✓ Templates compiled directory created');
  } catch (err) {
    console.error('Error creating templates directory:', err);
    process.exit(1);
  }
}

main();
