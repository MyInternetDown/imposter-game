FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/game-engine/package.json packages/game-engine/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --filter web... --no-frozen-lockfile

COPY . .
WORKDIR /app/apps/web

EXPOSE 3000
CMD ["pnpm", "dev"]

