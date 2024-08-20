FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . /app
WORKDIR /app

RUN pnpm run build

EXPOSE 5173

CMD ["pnpm", "start"]