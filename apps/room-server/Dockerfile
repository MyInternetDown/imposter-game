FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/room-server/package.json apps/room-server/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/game-engine/package.json packages/game-engine/package.json

RUN pnpm install --filter room-server... --no-frozen-lockfile

COPY . .
WORKDIR /app/apps/room-server

EXPOSE 8787
CMD ["pnpm", "dev"]

