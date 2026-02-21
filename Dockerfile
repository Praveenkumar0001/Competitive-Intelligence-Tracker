# Install dependencies only when needed
FROM node:20-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm install --ignore-scripts

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set dummy DATABASE_URL for build (actual URL set at runtime)
ENV DATABASE_URL="file:./dev.db"

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma

# Create directories for database and public assets
RUN mkdir -p /app/prisma /app/public && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
