FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY --from=prod-deps /app/node_modules /app/node_modules
WORKDIR /app

RUN pnpm build

FROM base
COPY --from=build /app/dist /app/dist

EXPOSE 5173

CMD ["pnpm", "start"]