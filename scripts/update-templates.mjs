import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '../packages/bend-core/src/scaffold/templates/stacks');

const prettierConfig = `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
`;

const eslintConfigTS = `import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];
`;

const eslintConfigJS = `import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {files: ["**/*.{js,mjs,cjs}"]},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];
`;

const nodemonConfig = `{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.test.js"],
  "exec": "node src/server.js"
}
`;

// TS Templates
const tsStacks = ['ts-mongoose-express', 'ts-mongoose-fastify', 'ts-prisma-express', 'ts-prisma-fastify'];
tsStacks.forEach(stack => {
  const dir = path.join(templatesDir, 'ts', stack);
  if (fs.existsSync(dir)) {
    fs.writeFileSync(path.join(dir, '.prettierrc'), prettierConfig);
    fs.writeFileSync(path.join(dir, 'eslint.config.mjs'), eslintConfigTS);
    console.log(`Updated ${stack}`);
  }
});

// JS Templates
const jsStacks = ['js-mongoose-express', 'js-mongoose-fastify', 'js-prisma-express', 'js-prisma-fastify'];
jsStacks.forEach(stack => {
  const dir = path.join(templatesDir, 'js', stack);
  if (fs.existsSync(dir)) {
    fs.writeFileSync(path.join(dir, '.prettierrc'), prettierConfig);
    fs.writeFileSync(path.join(dir, 'eslint.config.mjs'), eslintConfigJS);
    fs.writeFileSync(path.join(dir, 'nodemon.json'), nodemonConfig);
    console.log(`Updated ${stack}`);
  }
});
