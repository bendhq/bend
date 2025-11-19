<p align="center">
  <img src="https://raw.githubusercontent.com/bendhq/bend/main/packages/bend-core/public/bend_logo.png" width="200" alt="Bend App Logo" />
</p>

# Bend - The Backend Bundler

[![npm version](https://img.shields.io/npm/v/bend-core.svg)](https://www.npmjs.com/package/bend-core)
[![CI](https://github.com/bendhq/bend/actions/workflows/ci.yml/badge.svg)](https://github.com/bendhq/bend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Bun Version](https://img.shields.io/badge/bun-%3E%3D1.0.0-orange)

**Bend is a production-ready backend scaffolder** - like Vite for backend development. Create clean, optimized backend projects with best practices baked in.

## Features

- **Smart Detection** - Automatically detects runtime (Node.js/Bun) and package manager (npm/pnpm/yarn/bun)
- **Interactive CLI** - User-friendly prompts for configuration
- **Multiple Stacks** - Support for Express/Fastify with Mongoose/Prisma
- **Production Ready** - Security headers, rate limiting, error handling, logging
- **Fast** - Optimized project setup with minimal dependencies
- **TypeScript First** - Full TypeScript support with proper typing

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

## Published Packages

Bend is published as three separate npm packages:

1. **`create-bend`** - Initializer (recommended for users)
   - Used via `npm create bend`
   - Downloads and runs `bend-core` automatically
   
2. **`bend-core`** - Core library with templates
   - Can be used programmatically
   - Contains all scaffolding logic
   
3. **`bendjs`** - Global CLI wrapper (optional)
   - For users who prefer `npm install -g bendjs`
# Build all packages
pnpm build

# Test the CLI locally
node packages/bend-core/dist/cli/index.js
```

## Tech Stack Options

### Runtimes
- **Node.js** (Auto-detected)
- **Bun** (Auto-detected)

### Languages
- **TypeScript** (Recommended)
- **JavaScript**

### Frameworks
- **Express** - Battle-tested, extensive ecosystem
- **Fastify** - High performance, modern

### Databases/ORMs
- **MongoDB + Mongoose** - NoSQL with schema validation
- **SQL + Prisma** - PostgreSQL, MySQL, SQLite support

## Generated Project Structure

```
my-backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Database connection
│   │   └── logger.ts        # Winston logger setup
│   ├── controllers/         # Route controllers
│   │   └── health.controller.ts
│   ├── models/              # Database models
│   │   └── User.model.ts
│   ├── routes/              # Express/Fastify routes
│   │   └── health.routes.ts
│   ├── services/            # Business logic layer
│   ├── middlewares/         # Custom middlewares
│   ├── utils/               # Utility functions
│   ├── app.ts               # App configuration
│   └── server.ts            # Server entry point
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Built-in Production Features

### Security
- Helmet - Security headers
- CORS - Cross-origin resource sharing
- HPP - HTTP parameter pollution prevention (Express)
- Rate Limiting - DDoS protection

### Logging
- Winston - Structured logging
- Daily log rotation
- Separate error logs
- Morgan - HTTP request logging

### Error Handling
- Async error handling
- Centralized error middleware
- Graceful shutdown
- Unhandled rejection/exception handling

### Performance
- Compression - Response compression
- Optimized configurations
- Connection pooling (MongoDB)

## Development

### Project Structure (Monorepo)

```
bend/
├── packages/
│   ├── create-bend/        # npm create initializer
│   │   ├── bin/
│   │   │   └── index.js    # Delegates to bend-core
│   │   └── package.json
│  │   ├── bend-cli/           # Tiny global CLI wrapper
│   │   ├── bin/
│   │   │   └── bend.js     # CLI entry point
│   │   └── package.json
│   └── bend-core/          # Core logic and templates
│       ├── src/
│       │   ├── cli/        # CLI implementation
│       │   ├── scaffold/   # Template system
│       │   │   ├── templates/  # Project templates
│       │   │   ├── deps.ts     # Dependency resolver
│       │   │   ├── normalize.ts
│       │   │   ├── renderer.ts
│       │   │   └── writer.ts
│       │   ├── utils/      # Utilities (PM detection, etc.)
│       │   └── types.ts
│       └── package.json
└── scripts/
    └── compile-templates.mjs
```

### Available Scripts

```bash
# Build all packages
pnpm build

# Build only core
pnpm build:core

# Test
pnpm test

# Lint
pnpm lint
```

### Adding New Templates

1. Create template directory: `packages/bend-core/src/scaffold/templates/stacks/{runtime}/{language}/{stack-name}/`
2. Add template files with EJS syntax
3. Update `deps.ts` for dependency resolution
4. Rebuild: `pnpm build:core`

## Usage Examples

### Basic Setup

```bash
# Create a new project
npm create bend my-api

# Navigate to project
cd my-api

# Start development
npm run dev
```

### Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/my-api
# or for Prisma
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb

# Server
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key
LOG_LEVEL=info
```

## Roadmap

- [x] CLI with interactive prompts
- [x] Runtime detection (Node.js/Bun)
- [x] Package manager detection  
- [x] All 8 template combinations (TS/JS × Express/Fastify × Mongoose/Prisma)
- [x] Bun runtime support
- [x] NPM publishing structure
- [ ] Testing setup (Jest/Vitest)
- [ ] Docker support (optional)
- [ ] Authentication templates
- [ ] API documentation (Swagger/OpenAPI)
- [ ] GraphQL support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](./LICENSE).  
© 2025 [BendHQ](https://bendhq.org)

---

## Links

- **Bend Website:** https://bendhq.org 
- **GitHub:** https://github.com/bendhq/bend  
- **npm (main CLI):** https://www.npmjs.com/package/bendjs  
- **npm (one-liner shim):** https://www.npmjs.com/package/create-bend  
- **Issues:** https://github.com/bendhq/bend/issues
## Acknowledgments

- Inspired by [Vite](https://vite.dev/)
- Built with [tsup](https://tsup.egoist.dev/)
- CLI powered by [@clack/prompts](https://github.com/natemoo-re/clack)
