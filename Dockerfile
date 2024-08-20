FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS prod

COPY . /app
WORKDIR /app

RUN pnpm install --frozen-lockfile --prod

RUN pnpm run build

FROM base
COPY --from=prod /app/node_modules /app/node_modules
COPY --from=prod /app/dist /app/dist

EXPOSE 5173

CMD ["pnpm", "start"]