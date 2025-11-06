# ⚡ Bend
[![npm version](https://img.shields.io/npm/v/bend.svg)](https://www.npmjs.com/package/bend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.11.0-green)](https://nodejs.org/)

**Bend - The modern backend project generator and bundler.**

Bend helps developers quickly create clean, production-ready backend projects.  
Choose your preferred language, framework, and ORM - Bend scaffolds a complete backend with everything configured and ready to run.

---

## Quick Start

```bash
# Using npx (recommended)
npx bend

# Or install globally
npm install -g bend
bend
```

### CLI Prompts

1️⃣ **Language** → JavaScript or TypeScript 
2️⃣ **Framework** → Express or Fastify  
3️⃣ **ORM** → Mongoose or Prisma  
4️⃣ **Project Name** → Used as your folder and package name  

Once you finish setup, Bend automatically installs dependencies and prepares your backend for development.

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

Your backend will start automatically with **nodemon** hot reloading.

---

## Features

- TypeScript & JavaScript support  
- Express or Fastify frameworks  
- Mongoose or Prisma ORM integration  
- Automatic Nodemon hot-reload setup  
- Esbuild bundling for lightning-fast builds  
- Pre-configured scripts for dev, build & start  

---

## Project Scripts

| Command | Description |
|----------|--------------|
| `npm run dev` | Runs the server with **nodemon** for live reload |
| `npm run build` | Bundles the project using **esbuild** |
| `npm start` | Runs the compiled app from the `dist` folder |
| `npm run prisma:generate` | Generates Prisma client (if Prisma selected) |

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

Contributions are always welcome!  
You can help improve templates, add frameworks, or optimize the CLI.  
Please open an issue or submit a pull request on [GitHub](https://github.com/bendhq/bend).

---

## License

This project is licensed under the [MIT License](./LICENSE.md).  
© 2025 [BendHQ](https://github.com/bendhq)

---

## Links

- **GitHub:** [github.com/bendhq/bend](https://github.com/bendhq/bend)  
- **npm:** [npmjs.com/package/bend](https://www.npmjs.com/package/bend)  
- **Issues:** [github.com/bendhq/bend/issues](https://github.com/bendhq/bend/issues)
