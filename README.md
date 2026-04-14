# Imposter Game MVP

Production-shaped monorepo scaffold for a low-cost online multiplayer party game platform. This repo is set up around a Next.js web app, a Cloudflare Worker room server, shared TypeScript packages, Supabase SQL scaffolding, and Docker-friendly local development.

## What is included right now

- `apps/web`: Next.js App Router frontend with landing, guest join, dashboard, pack editor, room creation, and live room scaffolding
- `apps/room-server`: Cloudflare Worker room service with health endpoints, room creation/join APIs, and an authoritative in-memory room skeleton
- `packages/types`: shared room/game/event contracts
- `packages/game-engine`: MVP party mode state machine and scoring helpers
- `packages/db`: database schema metadata and environment helpers
- `packages/shared`: validation, room-code generation, and constants
- `packages/ui`: lightweight shared UI components
- `packages/voice`: provider abstraction and LiveKit-first config model
- `supabase`: baseline schema migration and seed prompts
- `docs`: product, architecture, local dev, and deployment docs
- `infrastructure`: Docker, env example, Cloudflare, and Vercel scaffolding

## Quick start

1. Install `pnpm`.
2. Copy `infrastructure/env.example` to `.env`.
3. Install dependencies with `pnpm install`.
4. Start the apps with `pnpm dev`.
5. Or run the web and room server through Docker Compose:

```bash
docker compose up --build
```

The scaffold assumes:

- web app on `http://localhost:3000`
- room server on `http://localhost:8787`
- Supabase via hosted dev project or local CLI stack

## Main scripts

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`

## Docs

- [docs/product-spec.md](/home/robin/imposter-game/docs/product-spec.md)
- [docs/architecture.md](/home/robin/imposter-game/docs/architecture.md)
- [docs/local-development.md](/home/robin/imposter-game/docs/local-development.md)
- [docs/deployment.md](/home/robin/imposter-game/docs/deployment.md)
- [AGENTS.md](/home/robin/imposter-game/AGENTS.md)

## Current milestone

This milestone gives you a runnable foundation and the first end-to-end game/domain contracts. It is not the full finished MVP yet: auth wiring, persistent pack CRUD, real websocket gameplay sync, voice token issuance, and full reconnect logic still need implementation on top of this scaffold.

