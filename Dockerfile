FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile && pnpm build

EXPOSE 5173

CMD ["pnpm", "start"]