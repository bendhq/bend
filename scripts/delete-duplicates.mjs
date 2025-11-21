import fs from 'fs';
import path from 'path';

const duplicates = [
  'stacks/js/js-mongoose-express/.prettierrc',
  'stacks/js/js-mongoose-express/src/models/user.model.js',
  'stacks/js/js-mongoose-express/_gitignore',
  'stacks/js/js-mongoose-fastify/src/models/user.model.js',
  'stacks/js/js-mongoose-fastify/src/utils/helpers.js',
  'stacks/js/js-mongoose-fastify/_gitignore'
];

const templatesDir = path.join(process.cwd(), 'packages/bend-core/src/scaffold/templates');

for (const file of duplicates) {
  const fullPath = path.join(templatesDir, file);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`Deleted: ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
}
