# =====================
# 1️⃣ Build stage
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# 🔑 宣告 build-time 變數
ARG NEXT_PUBLIC_SERVER_HOST
ARG NEXT_PUBLIC_TWITCH_CLIENT_ID
ARG NEXT_PUBLIC_ENV

ENV NEXT_PUBLIC_SERVER_HOST=$NEXT_PUBLIC_SERVER_HOST
ENV NEXT_PUBLIC_TWITCH_CLIENT_ID=$NEXT_PUBLIC_TWITCH_CLIENT_ID
ENV NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# =====================
# 2️⃣ Runtime stage
# =====================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]