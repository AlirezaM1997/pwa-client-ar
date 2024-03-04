FROM node:lts-alpine3.18 AS base
ARG NODE_ENV="production"
ARG NEXT_PUBLIC_PUBLISH_DOMAIN
ARG IMAGE_URLS

ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_PUBLISH_DOMAIN=$NEXT_PUBLIC_PUBLISH_DOMAIN
ENV IMAGE_URLS=$IMAGE_URLS

FROM base AS deps
WORKDIR /app

COPY package*.json  ./

RUN npm i --legacy-peer-deps

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

COPY .env .env

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
