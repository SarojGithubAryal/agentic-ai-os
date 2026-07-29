# Agentic AI OS

A modular, provider‑agnostic intelligence platform between applications and AI providers.

**Phase 1 – Core Skeleton** ✅  
**Phase 2 – Gateway & Authentication** ✅  
**Phase 3 – Provider Abstraction** ✅  
**Phase 4 – Memory System** ✅  
**Phase 5 – Tool Engine** ✅  
**Phase 6 – Workflow Engine** ✅  
**Phase 7 – Agent Framework** ✅  

---

## Tech Stack

- **Language** – TypeScript (strict mode)
- **Runtime** – Node.js
- **Server** – Fastify
- **Database** – PostgreSQL (Neon serverless or local)
- **ORM** – Drizzle ORM
- **Validation** – Zod
- **Logging** – Pino
- **Auth** – JWT (access/refresh) + API keys
- **AI Providers** – OpenAI, Gemini, DeepSeek, Noop (mock)
- **Testing** – Vitest + Supertest (59 tests)
- **Docs** – OpenAPI / Swagger

---

## Getting Started

### 1. Install dependencies

```bash
npm install

### 2. Set up environment

If you don’t already have a `.env` file, create one from the example:

```powershell
Copy-Item .env.example .env