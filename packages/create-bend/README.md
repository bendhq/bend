<p align="center">
  <img src="https://raw.githubusercontent.com/bendhq/bend/main/public/bend_logo.png" width="200" alt="Bend App Logo" />
</p>

# create-bend

[![npm version](https://img.shields.io/npm/v/create-bend.svg)](https://www.npmjs.com/package/create-bend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Node.js Version](https://img.shields.io/badge/node-%5E20.19.0%20%7C%7C%20%3E%3D22.12.0-green)

The official initializer for [Bend](https://github.com/yourusername/bend) - a production-ready backend scaffolder.

## Usage

Create a new backend project using your preferred package manager:

### npm
```bash
npm create bend@latest
# or
npm init bend
```

### pnpm
```bash
pnpm create bend
```

### yarn
```bash
yarn create bend
```

### bun
```bash
bunx create-bend
```

## What is Bend?

Bend is a backend project scaffolder that helps you quickly create production-ready backend applications with:

- **Frameworks**: Express or Fastify
- **Languages**: TypeScript or JavaScript
- **ORMs**: Mongoose (MongoDB) or Prisma (SQL)
- **Runtimes**: Node.js or Bun

Each generated project includes:
- ✅ Security best practices (Helmet, CORS, Rate limiting)
- ✅ Logging with Winston (or Pino for Fastify)
- ✅ Error handling
- ✅ Environment configuration
- ✅ Production-ready structure

## Options

You can pass options directly:

```bash
npm create bend@latest my-project
```

Or answer interactive prompts to customize your project.

## Requirements

- Node.js >= 18.0.0 or Bun >= 1.0.0

## License

MIT
