export const VERSIONS = {
  dotenv: "^16.4.5",
  express: "^4.19.2",
  fastify: "^4.26.2",
  mongoose: "^8.8.1",
  prisma: "^5.22.0",
  prismaClient: "^5.22.0",
  esbuild: "^0.25.12",
  nodemon: "^3.1.7",
  typescript: "^5.9.3",
  tsNode: "^10.9.2",
  "@types/express": "^4.17.21"
} as const;

export const CONFIG = {
  minNodeVersion: ">=18.0.0",
  templatesDir: "src/scaffold/templates"
} as const;

export const FILES = {
  gitignore: "_gitignore.ejs",
  readme: "README.md.ejs",
  env: ".env.example"
} as const;
