# Architecture

## System split

- `apps/web`: user-facing product, auth screens, room UI, pack builder
- `apps/room-server`: authoritative live room state and game flow orchestration
- `packages/game-engine`: deterministic phase transitions and scoring logic
- `packages/types`: shared event and domain contracts
- `supabase`: persistent schema for users, packs, rooms, and completed sessions

## State boundaries

Persistent state belongs in Supabase:

- profiles
- guest sessions
- question packs
- room metadata
- historical game sessions

Live state belongs in the room server:

- connected players
- ready states
- active prompt
- submissions
- votes
- timers
- current scores

## Current scaffold

The current room server uses an in-memory map for local development. Production should move room execution into Durable Objects so each room remains server-authoritative and isolated.

## Voice

Voice is abstracted in `packages/voice` with LiveKit as the default target. Token issuance should be handled on the server side only.

