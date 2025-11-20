<p align="center">
  <img src="https://raw.githubusercontent.com/bendhq/bend/main/packages/bend-core/public/bend_logo.png" width="200" alt="Bend Logo" />
</p>

# Bend - The Backend Bundler

[![npm version](https://img.shields.io/npm/v/bend-core.svg)](https://www.npmjs.com/package/bend-core)
[![CI](https://github.com/bendhq/bend/actions/workflows/ci.yml/badge.svg)](https://github.com/bendhq/bend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Bun Version](https://img.shields.io/badge/bun-%3E%3D1.0.0-orange)

**Bend is a production-ready backend scaffolder** that creates secure, optimized backend projects with enterprise-grade features baked in from day one.

## Why Bend?

- **Production-Ready Security**: helmet(), cors(), rate limiting, and HPP protection out of the box
- **Enterprise Logging**: Winston with daily rotation, structured metadata, and HTTP request logging
- **Smart Detection**: Auto-detects runtime (Node.js/Bun) and package manager (npm/pnpm/yarn/bun)
- **Multiple Stacks**: 8 template combinations (TypeScript/JavaScript × Express/Fastify × Mongoose/Prisma)
- **Zero Configuration**: Works immediately, customizable when needed
- **TypeScript First**: Full TypeScript support with strict mode enabled

## Quick Start

### Recommended: Using npm create

```bash
# Latest version
npm create bend@latest

# With project name
npm create bend@latest my-backend
```

### Other Package Managers

```bash
# Using pnpm
pnpm create bend

# Using yarn
yarn create bend

# Using bun
bunx create-bend
```

## What You Get

Every Bend project includes:

### Security (Production-Ready)

- **[helmet](https://helmetjs.github.io/)** - Sets security HTTP headers
- **[cors](https://github.com/expressjs/cors)** - Configurable cross-origin resource sharing
- **[rate-limit](https://github.com/express-rate-limit/express-rate-limit)** - DDoS protection (100 req/15min per IP)
- **[hpp](https://github.com/analog-nico/hpp)** - HTTP parameter pollution prevention
- **Body size limits** - Prevents memory exhaustion (10MB default)
- **Error sanitization** - Hides sensitive info in production
- **Compression** - gzip/deflate response compression

### Logging & Monitoring

- **[Winston](https://github.com/winstonjs/winston)** - Enterprise-grade logging
- **Daily log rotation** - Automatic archival (30-day retention)
- **Separate log files** - error.log, combined.log, exceptions.log
- **HTTP request logging** - Morgan middleware integration
- **Structured metadata** - JSON format for easy parsing
- **Production-ready** - Compatible with DataDog, Splunk, ELK, CloudWatch

### Error Handling

- **Async error handling** - `express-async-errors` for cleaner code
- **Centralized error middleware** - Single point for error handling
- **Graceful shutdown** - Proper cleanup on SIGTERM/SIGINT
- **Unhandled rejection handlers** - No silent crashes

### Developer Experience

- **TypeScript strict mode** - Maximum type safety
- **ESLint + Prettier** - Code quality and formatting
- **Environment variables** - .env file support with dotenv
- **Project structure** - Clean, scalable architecture
- **Example models** - User model to get started quickly

## Tech Stack Options

### Runtimes
- **Node.js** (≥18.0.0) - Auto-detected
- **Bun** (≥1.0.0) - Auto-detected

### Languages
- **TypeScript** (Recommended) - Full type safety
- **JavaScript** (ESM) - Modern JavaScript

### Frameworks
- **Express** - Battle-tested, extensive ecosystem
- **Fastify** - High performance, modern

### Databases/ORMs
- **MongoDB + Mongoose** - NoSQL with schema validation
- **SQL + Prisma** - PostgreSQL, MySQL, SQLite support

**Total: 8 template combinations**

## Generated Project Structure

```
my-backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Database connection with retry logic
│   │   └── logger.ts        # Winston logger with daily rotation
│   ├── controllers/         # Route controllers
│   │   └── health.controller.ts
│   ├── models/              # Database models
│   │   └── User.model.ts    # Example user model
│   ├── routes/              # Express/Fastify routes
│   │   └── health.routes.ts
│   ├── services/            # Business logic layer
│   ├── middlewares/         # Custom middlewares
│   ├── utils/               # Utility functions
│   ├── app.ts               # App configuration + middlewares
│   └── server.ts            # Server entry point + graceful shutdown
├── logs/                    # Auto-generated log directory
│   ├── combined-YYYY-MM-DD.log
│   ├── error-YYYY-MM-DD.log
│   └── exceptions-YYYY-MM-DD.log
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json            # TypeScript strict mode
└── README.md                # Project-specific README
```

## Example: What Your API Includes

```typescript
// src/app.ts - Security & Logging (Auto-generated)

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import logger from './config/logger';

const app = express();

// Security
app.use(helmet());              // Security headers
app.use(cors({ /* config */ })); // CORS
app.use(hpp());                 // Parameter pollution prevention

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  max: 100,                     // 100 requests per IP
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) }
}));

// Compression
app.use(compression());

// Your routes...
```

```typescript
// src/config/logger.ts - Winston Logger (Auto-generated)

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      maxFiles: '30d',
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      maxFiles: '30d',
    }),
  ],
});
```

## Published Packages

Bend is published as three npm packages:

### 1. `create-bend` (Recommended)

Initializer package used via `npm create bend`.

```bash
npm create bend@latest
```

**What it does**: Downloads and runs `bend-core` automatically.

### 2. `bend-core`

Core library with all templates and scaffolding logic.

```bash
npx bend-core
```

**Use case**: Direct usage or programmatic access.

### 3. `bendjs`

Global CLI wrapper (optional).

```bash
npm install -g bendjs
bend
```

**Use case**: For users who prefer global installation.

## Development

### Prerequisites

- Node.js ≥18.0.0
- pnpm (recommended)

### Setup

```bash
# Clone repository
git clone https://github.com/bendhq/bend.git
cd bend

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format
```

### Project Structure (Monorepo)

```
bend/
├── packages/
│   ├── create-bend/        # npm create initializer
│   │   ├── bin/
│   │   │   └── index.js    # Delegates to bend-core
│   │   └── package.json
│   ├── bend-cli/           # Global CLI wrapper (bendjs)
│   │   ├── bin/
│   │   │   └── bend.js     # Wrapper script
│   │   └── package.json
│   └── bend-core/          # Core library
│       ├── src/
│       │   ├── cli/        # CLI implementation
│       │   ├── scaffold/   # Project scaffolding
│       │   │   └── templates/  # All 8 templates
│       │   ├── types/      # TypeScript types
│       │   └── utils/      # Utilities
│       └── package.json
├── scripts/                # Build scripts
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD pipeline
├── package.json            # Root package
├── pnpm-workspace.yaml     # Workspace config
└── tsconfig.json           # TypeScript config
```

### Testing Locally

```bash
# Test CLI locally
node packages/bend-core/dist/cli/index.js my-test-project

# Test with specific options
node packages/bend-core/dist/cli/index.js my-app --no-install
```

## Environment Variables

Configure your generated project via `.env`:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database (MongoDB example)
MONGODB_URI=mongodb://localhost:27017/myapp

# Database (Prisma example)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Security
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info  # error | warn | info | debug
```

## Roadmap

- [x] Core CLI functionality
- [x] Multiple runtime support (Node.js, Bun)
- [x] Express & Fastify frameworks
- [x] Mongoose & Prisma ORMs
- [x] TypeScript & JavaScript
- [x] Security middlewares (helmet, cors, rate-limit, hpp)
- [x] Winston logging with daily rotation
- [x] GitHub Actions CI/CD
- [x] ESLint + Prettier
- [ ] Docker support
- [ ] Authentication templates (JWT, OAuth)
- [ ] Testing setup (Jest)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] GraphQL support
- [ ] Microservices templates

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Bend](https://github.com/bendhq/bend)

## Links

- **GitHub**: https://github.com/bendhq/bend
- **npm (bend-core)**: https://www.npmjs.com/package/bend-core
- **npm (create-bend)**: https://www.npmjs.com/package/create-bend
- **npm (bendjs)**: https://www.npmjs.com/package/bendjs
- **Website**: https://bendhq.org
- **Issues**: https://github.com/bendhq/bend/issues
- **Discussions**: https://github.com/bendhq/bend/discussions

## Credits

Built with:
- [TypeScript](https://www.typescriptlang.org/)
- [Commander.js](https://github.com/tj/commander.js)
- [@clack/prompts](https://github.com/natemoo-re/clack)
- [EJS](https://ejs.co/)
- [tsup](https://github.com/egoist/tsup)

---

**Bend** - Production-ready backends in seconds, not hours.
