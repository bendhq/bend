<p align="center">
  <img src="https://raw.githubusercontent.com/bendhq/bend/main/public/bend_logo.png" width="200" alt="Bend App Logo" />
</p>

[![npm version](https://img.shields.io/npm/v/bendjs.svg)](https://www.npmjs.com/package/bendjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Node.js Version](https://img.shields.io/badge/node-%5E20.19.0%20%7C%7C%20%3E%3D22.12.0-green)

# Bend
**Bend - The modern backend project generator and bundler.**

Bend helps developers quickly create clean, production-ready backend projects.  
Choose your preferred language, framework, and ORM - Bend scaffolds a complete backend with everything configured and ready to run.

---

## Quick Start

### One-liner (recommended)
Use the creator package:

```bash
# npm
npm create bend@latest

# pnpm
pnpm create bend

# yarn
yarn create bend

# bun
bun create bend
# or
bunx create-bend
```

### Direct CLI (no shim)
Run the main CLI package directly:

```bash
# npx
npx bendjs

# or install globally
npm i -g bendjs
bend
```

---

## CLI Prompts

- **Language** → JavaScript or TypeScript  
- **Framework** → Express or Fastify  
- **ORM** → Mongoose or Prisma  
- **Project Name** → Used as your folder and package name  
- **Package Manager** → npm / pnpm / yarn / bun (auto-detected with fallback)

After setup, Bend installs dependencies and prepares your backend for development.

---

## Example Output

If you choose **TypeScript + Express + Prisma**, Bend generates:

```
my-api/
├─ package.json
├─ tsconfig.json
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ server.ts
│  ├─ routes/health.ts
│  ├─ middlewares/error.ts
│  └─ db/prisma.ts
├─ .env.example
└─ README.md
```

Then run:

```bash
cd my-api
npm run dev
```

Your backend starts with **nodemon** hot reloading.

---

## Features

- TypeScript & JavaScript support  
- Express or Fastify frameworks  
- Mongoose or Prisma ORM integration  
- Automatic **nodemon** hot-reload setup  
- **esbuild** bundling for fast builds  
- Preconfigured scripts for dev, build & start  
- Cross-platform (Windows, macOS, Linux) with smart PM detection + fallback

---

## Project Scripts

| Command                | Description                                   |
|------------------------|-----------------------------------------------|
| `npm run dev`          | Run the server with **nodemon** (live reload) |
| `npm run build`        | Bundle using **esbuild**                      |
| `npm start`            | Run the compiled app from `dist`              |
| `npm run prisma:generate` | Generate Prisma client (if Prisma selected) |

---

## Development (for contributors)

```bash
git clone https://github.com/bendhq/bend.git
cd bend
npm install
npm run build
npm link
bend
```

---

## Contributing

Contributions are welcome!  
Improve templates, add stacks, or optimize the CLI.  
Open an issue or PR on [GitHub](https://github.com/bendhq/bend).

---

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
