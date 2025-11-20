<p align="center">
  <img src="https://raw.githubusercontent.com/bendhq/bend/main/packages/bend-core/public/bend_logo.png" width="200" alt="Bend Logo" />
</p>

# bend-core

[![npm version](https://img.shields.io/npm/v/bend-core.svg)](https://www.npmjs.com/package/bend-core)
[![CI](https://github.com/bendhq/bend/actions/workflows/ci.yml/badge.svg)](https://github.com/bendhq/bend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Bun Version](https://img.shields.io/badge/bun-%3E%3D1.0.0-orange)

**Core library for Bend** - Production-ready backend scaffolder with enterprise-grade security and logging.

## Features

- **Production-Ready Security**: helmet(), cors(), rate limiting, HPP protection
- **Enterprise Logging**: Winston with daily rotation and structured metadata
- **8 Template Combinations**: TypeScript/JavaScript × Express/Fastify × Mongoose/Prisma
- **Runtime Detection**: Auto-detects Node.js or Bun
- **Package Manager Detection**: Auto-detects npm, pnpm, yarn, or bun
- **TypeScript First**: Strict mode by default
- **Zero Config**: Works out of the box

## Installation

### Direct Usage (Recommended)

```bash
npx bend-core
```

### Install Globally

```bash
npm install -g bend-core
bend-core
```

### Install as Dependency

```bash
npm install bend-core
```

## Usage

### CLI Mode

```bash
# Interactive mode
npx bend-core

# With project name
npx bend-core my-backend

# Skip dependency installation
npx bend-core my-backend --no-install
```

### Programmatic API

```javascript
import { createProject } from 'bend-core';

await createProject({
  projectName: 'my-backend',
  runtime: 'nodejs',        // or 'bun'
  language: 'ts',           // or 'js'
  framework: 'express',     // or 'fastify'
  orm: 'mongoose',          // or 'prisma'
  packageManager: 'npm',    // or 'pnpm', 'yarn', 'bun'
  skipInstall: false,
});
```

## What You Get

Every generated project includes:

### Security Middlewares

- **helmet** - Security HTTP headers
- **cors** - Cross-origin resource sharing  
- **rate-limit** - DDoS protection (100 req/15min)
- **hpp** - HTTP parameter pollution prevention
- **compression** - Response compression
- **body limits** - Prevents memory exhaustion

### Logging & Monitoring

- **Winston** - Enterprise-grade logging
- **Daily rotation** - Automatic log archival
- **Structured metadata** - JSON format
- **HTTP logging** - Morgan middleware integration
- **Separate logs** - error, combined, exceptions

### Error Handling

- **Async error handling** - express-async-errors
- **Centralized middleware** - Single error handler
- **Graceful shutdown** - Proper cleanup
- **Unhandled rejection handlers** - No silent crashes

## Templates

All 8 template combinations are included:

| Language | Framework | ORM | Status |
|----------|-----------|-----|--------|
| TypeScript | Express | Mongoose | ✅ |
| TypeScript | Express | Prisma | ✅ |
| TypeScript | Fastify | Mongoose | ✅ |
| TypeScript | Fastify | Prisma | ✅ |
| JavaScript | Express | Mongoose | ✅ |
| JavaScript | Express | Prisma | ✅ |
| JavaScript | Fastify | Mongoose | ✅ |
| JavaScript | Fastify | Prisma | ✅ |

## Project Structure

Generated projects have this structure:

```
my-backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # DB connection
│   │   └── logger.ts        # Winston config
│   ├── controllers/         # Controllers
│   ├── models/              # DB models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middlewares/         # Custom middleware
│   ├── utils/               # Utilities
│   ├── app.ts               # App setup
│   └── server.ts            # Entry point
├── logs/                    # Auto-generated logs
├── .env                     # Environment vars
├── .gitignore
├── package.json
├── tsconfig.json            # (TypeScript)
└── README.md
```

## API Reference

### createProject(options)

Creates a new backend project.

**Parameters:**

```typescript
interface CLIOptions {
  projectName?: string;      // Project directory name
  runtime?: 'nodejs' | 'bun'; // Runtime (auto-detected)
  language?: 'ts' | 'js';    // Language
  framework?: 'express' | 'fastify'; // Framework
  orm?: 'mongoose' | 'prisma'; // ORM
  packageManager?: 'npm' | 'pnpm' | 'yarn' | 'bun'; // PM (auto-detected)
  skipInstall?: boolean;     // Skip npm install
  noInstall?: boolean;       // Alias for skipInstall
}
```

**Returns:** `Promise<void>`

**Example:**

```typescript
import { createProject } from 'bend-core';

await createProject({
  projectName: 'my-api',
  language: 'ts',
  framework: 'fastify',
  orm: 'prisma',
});
```

## Environment Variables

Generated projects support these environment variables:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/myapp

# Database (Prisma)
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"

# Security
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info  # error | warn | info | debug
```

## Dependencies

**Core Dependencies:**
- @clack/prompts - Interactive CLI prompts
- commander - CLI framework
- ejs - Template engine
- picocolors - Terminal colors

**Template Dependencies** (included in generated projects):
- express | fastify - Web framework
- mongoose | prisma - ORM
- helmet - Security headers
- cors - CORS handling
- express-rate-limit - Rate limiting
- hpp - Parameter pollution prevention
- winston - Logging
- winston-daily-rotate-file - Log rotation
- morgan - HTTP logging
- compression - Response compression
- dotenv - Environment variables

## Development

This is part of the Bend monorepo. See the [main README](../../README.md) for development instructions.

### Building

```bash
pnpm build
```

### Testing Locally

```bash
node dist/cli/index.js my-test-project
```

## Links

- **Main Project**: https://github.com/bendhq/bend
- **npm Package**: https://www.npmjs.com/package/bend-core
- **Documentation**: https://bendhq.org/docs
- **Issues**: https://github.com/bendhq/bend/issues

## License

MIT © [Bend](https://github.com/bendhq/bend)

---

Part of [Bend](https://github.com/bendhq/bend) - Production-ready backends in seconds.
