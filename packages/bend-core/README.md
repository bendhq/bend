<p align="center">
  <img src="https://raw.githubusercontent.com/bendhq/bend/main/public/bend_logo.png" width="200" alt="Bend App Logo" />
</p>

# bend-core

[![npm version](https://img.shields.io/npm/v/bend-core.svg)](https://www.npmjs.com/package/bend-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Node.js Version](https://img.shields.io/badge/node-%5E20.19.0%20%7C%7C%20%3E%3D22.12.0-green)

Production-ready backend scaffolder for Node.js and Bun.

## Features

- 🚀 **Fast Project Setup**: Generate complete backend projects in seconds
- 🎯 **Multiple Frameworks**: Express or Fastify
- 📝 **TypeScript & JavaScript**: Full support for both
- 💾 **Database Support**: Mongoose (MongoDB) or Prisma (SQL)
- ⚡ **Runtime Agnostic**: Works with Node.js and Bun
- 🔒 **Production Ready**: Security, logging, error handling included
- 📦 **Package Manager Agnostic**: npm, pnpm, yarn, bun all supported

## Installation

```bash
npm install bend-core
```

Or use without installing:

```bash
npx bend-core
```

## Usage

### As CLI

```bash
npx bend-core
```

### Programmatic API

```javascript
import { createProject } from 'bend-core';

await createProject({
  projectName: 'my-backend',
  runtime: 'nodejs',
  language: 'ts',
  framework: 'express',
  orm: 'mongoose',
  packageManager: 'npm'
});
```

## Generated Project Structure

Each generated project includes:

- ✅ **Security Headers** (Helmet)
- ✅ **CORS Configuration**
- ✅ **Rate Limiting**
- ✅ **Request Logging** (Morgan/Pino)
- ✅ **Error Handling** (Global error middleware)
- ✅ **Environment Variables** (.env setup)
- ✅ **Graceful Shutdown**
- ✅ **Production Structure** (controllers, services, models, routes)

## Supported Stacks

| Language | Framework | ORM     | Database   |
|----------|-----------|---------|------------|
| TypeScript | Express   | Mongoose | MongoDB    |
| TypeScript | Express   | Prisma   | PostgreSQL/MySQL/SQLite |
| TypeScript | Fastify   | Mongoose | MongoDB    |
| TypeScript | Fastify   | Prisma   | PostgreSQL/MySQL/SQLite |
| JavaScript | Express   | Mongoose | MongoDB    |
| JavaScript | Express   | Prisma   | PostgreSQL/MySQL/SQLite |
| JavaScript | Fastify   | Mongoose | MongoDB    |
| JavaScript | Fastify   | Prisma   | PostgreSQL/MySQL/SQLite |

## Requirements

- Node.js >= 18.0.0 or Bun >= 1.0.0

## License

MIT

## Related Packages

- [create-bend](https://www.npmjs.com/package/create-bend) - Official initializer
- [bendjs](https://www.npmjs.com/package/bendjs) - Global CLI wrapper
