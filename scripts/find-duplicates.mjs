import fs from 'fs';
import path from 'path';

const templatesDir = path.join(process.cwd(), 'packages/bend-core/src/scaffold/templates');

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      files.push(...getFiles(res));
    } else {
      files.push(res);
    }
  }
  return files;
}

async function findDuplicates() {
  const allFiles = getFiles(templatesDir);
  const ejsFiles = allFiles.filter(f => f.endsWith('.ejs'));
  
  const duplicates = [];
  for (const ejsFile of ejsFiles) {
    const baseFile = ejsFile.slice(0, -4); // Remove .ejs
    
    if (fs.existsSync(baseFile)) {
      duplicates.push(path.relative(templatesDir, baseFile));
    }
  }
  
  fs.writeFileSync('duplicates.txt', duplicates.join('\n'));
  console.log(`Found ${duplicates.length} duplicates. Written to duplicates.txt`);
}

findDuplicates();
