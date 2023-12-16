# Install dependencies only when needed
FROM node:lts-alpine AS deps

WORKDIR /opt/srg-app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
# This is where because may be the case that you would try
# to build the app based on some `X_TAG` in my case (Git commit hash)
# but the code hasn't changed.
FROM node:lts-alpine AS builder

ENV NODE_ENV=production
WORKDIR /opt/srg-app
COPY . .
COPY --from=deps /opt/srg-app/node_modules ./node_modules
RUN ls -ltr
RUN npm run build

# Production image, copy all the files and run next
FROM node:lts-alpine AS runner

ARG X_TAG
WORKDIR /opt/srg-app
ENV NODE_ENV=production
COPY --from=builder /opt/srg-app/next.config.js ./
COPY --from=builder /opt/srg-app/public ./public
COPY --from=builder /opt/srg-app/build ./build
COPY --from=builder /opt/srg-app/package*.json ./
COPY --from=builder /opt/srg-app/node_modules ./node_modules


EXPOSE 8000
ENV PORT 8000
CMD ["npm", "start"]