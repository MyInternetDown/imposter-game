# Local Development

## Prerequisites

- Node.js 22+
- `pnpm`
- Docker Desktop or Docker Engine if you want containerized dev

## Environment

1. Copy `infrastructure/env.example` to `.env`
2. Fill in your Supabase and LiveKit values
3. For pure scaffold testing, placeholders are enough for the web UI and health endpoints

## Run with pnpm

```bash
pnpm install
pnpm dev
```

Expected ports:

- web: `http://localhost:3000`
- room server: `http://localhost:8787`

## Run with Docker

```bash
docker compose up --build
```

## Next milestones for local dev

- add Supabase CLI local stack if you want fully local Postgres/auth
- wire websocket transport between web and room server
- add LiveKit token endpoint for microphone sessions

