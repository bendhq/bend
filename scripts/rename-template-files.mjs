import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '../packages/bend-core/src/scaffold/templates/stacks');

// Files that need to be renamed to .ejs
const filesToRename = [
  // TS templates
  'ts/ts-mongoose-express/src/config/database.ts',
  'ts/ts-mongoose-express/src/app.ts',
  'ts/ts-mongoose-fastify/src/config/database.ts',
  'ts/ts-prisma-express/src/app.ts',
  // JS templates
  'js/js-mongoose-express/src/app.js',
  'js/js-prisma-express/src/app.js',
];

// Also check for js-mongoose-fastify and js-prisma-fastify
const additionalCheck = [
  'js/js-mongoose-fastify/src/config/database.js',
  'js/js-prisma-fastify/src/app.js',
  'ts/ts-prisma-fastify/src/app.ts',
];

console.log('Renaming template files to .ejs extension...\n');

[...filesToRename, ...additionalCheck].forEach(file => {
  const oldPath = path.join(templatesDir, file);
  const newPath = oldPath + '.ejs';
  
  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✓ Renamed: ${file} -> ${file}.ejs`);
    } catch (err) {
      console.error(`✗ Error renaming ${file}:`, err.message);
    }
  } else {
    console.log(`⊗ Skipped: ${file} (doesn't exist)`);
  }
});

console.log('\nDone!');
