FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE_URL
RUN test -n "$NEXT_PUBLIC_API_BASE_URL" || (echo "NEXT_PUBLIC_API_BASE_URL build argument is required" >&2; exit 1)
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN node -e "const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL); const blocked = ['api', 'web', 'db', 'host.docker.internal']; if (!['http:', 'https:'].includes(url.protocol) || blocked.includes(url.hostname)) { console.error('NEXT_PUBLIC_API_BASE_URL must be an HTTP(S) browser-visible URL, not a Docker-only hostname'); process.exit(1); }"
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace @davas/shared
RUN npm run build --workspace @davas/web
RUN npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["npm", "--workspace", "@davas/web", "start"]
