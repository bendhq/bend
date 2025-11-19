# Bend Roadmap 🚀

Bend is designed to be the "Vite for Backend" - a blazing fast, production-ready backend scaffolder.

## 🌟 Core Features

### 1. Smart Detection 🧠
- **Runtime Detection**: Automatically detects if you are running **Node.js** or **Bun**.
- **Package Manager Detection**: Detects if you used `npm`, `pnpm`, `yarn`, or `bun` to launch the CLI and configures the project accordingly.

### 2. Interactive CLI 💬
- **Language**: TypeScript (Recommended) or JavaScript.
- **Framework**: Express (Classic) or Fastify (High Performance).
- **Database**: SQL (via Prisma) or NoSQL (via Mongoose/MongoDB).

### 3. Production Ready 🏭
- **Structured**: Clean architecture (Controllers, Services, Utils).
- **Configured**: Pre-configured `.env`, `README.md`, `tsconfig.json` (if TS).
- **Optimized**: Best practices for security and performance out of the box.

---

## 🗺️ Implementation Phases

### Phase 1: Foundation 🏗️
- [ ] **Monorepo Setup**: Ensure `bend-cli` and `bend-core` are properly linked.
- [ ] **CLI Entry Point**: Basic CLI that can be run with `npm create bend`.
- [ ] **Runtime & PM Detection**: Logic to identify the environment.

### Phase 2: The Generator Engine ⚙️
- [ ] **Template System**: A robust system to compose templates based on user choices (e.g., "TS + Fastify + Prisma").
- [ ] **File Generation**: Efficiently copy and transform template files.
- [ ] **Dependency Injection**: Dynamically generate `package.json` dependencies based on choices.

### Phase 3: Templates & Best Practices 📝
- [ ] **Express Template**:
    - Error Handling Middleware.
    - Async Handler.
    - Security Headers (Helmet).
- [ ] **Fastify Template**:
    - Schema Validation.
    - Hooks.
    - High-performance defaults.
- [ ] **Database Integration**:
    - **Mongoose**: Connection pooling, schema setup.
    - **Prisma**: Client generation, initial migration script.

### Phase 4: Polish & Release ✨
- [ ] **Beautiful CLI**: Use colors, spinners, and clear prompts.
- [ ] **Detailed READMEs**: Each generated project gets a custom README explaining how to run, build, and deploy.
- [ ] **Testing**: Verify all combinations (8 variants) work seamlessly.

---

## 🛠️ Tech Stack for Bend
- **CLI**: `prompts` (for interactivity), `commander` or `cac` (for args), `picocolors` (for style).
- **Core**: Node.js / Bun file system APIs.
- **Templates**: EJS or simple string replacement for dynamic content.
