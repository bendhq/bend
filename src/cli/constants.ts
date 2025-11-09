export const CONFIG = {
  minNodeVersion: ">=18.0.0",
  templatesDir: "src/scaffold/templates"
} as const;

export const FILES = {

  gitignore: "_gitignore.ejs",
  readme: "README.md.ejs",
  env: ".env.example"
} as const;

export const META = {
  name: "bend",
  description: "Bend - modern backend project generator and bundler",
  version: "1.0.0"
} as const;
