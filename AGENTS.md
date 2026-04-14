# AGENTS.md

## Repo layout

- `apps/web`: Next.js frontend
- `apps/room-server`: Cloudflare Worker authoritative room service
- `packages/*`: shared contracts and reusable logic
- `supabase`: SQL migrations and seeds
- `docs`: product and engineering docs
- `infrastructure`: deployment and env templates

## How to run

- Install dependencies: `pnpm install`
- Start web + room server: `pnpm dev`
- Build all packages: `pnpm build`
- Run tests: `pnpm test`
- Typecheck: `pnpm typecheck`

## Coding conventions

- TypeScript everywhere
- Shared event contracts belong in `packages/types`
- Live game logic belongs in `packages/game-engine` and `apps/room-server`
- Frontend is never the source of truth for gameplay state
- Prefer small, composable modules over giant room/game components

## Done criteria

- New room/game actions are validated server-side
- Shared contracts stay in sync between web and room server
- Tests cover engine transitions and critical validation
- Docs and env vars are updated when architecture changes

## Do-not rules

- Do not move authoritative game state into React components
- Do not expose secrets in client bundles
- Do not add new game modes before extending the shared engine contracts
- Do not bypass input validation for packs, chat, or gameplay actions

## Architecture rules

- Persistent data goes to Supabase/Postgres
- Live room state goes to Worker-managed room instances
- Voice is abstracted behind `packages/voice`
- New room events must be added to shared types before use

