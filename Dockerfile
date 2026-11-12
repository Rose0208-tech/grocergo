FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package manifests
COPY package.json ./
COPY backend/package*.json ./backend/
COPY customer-frontend/package*.json ./customer-frontend/

# Install backend dependencies
RUN cd backend && npm install

# Install customer frontend dependencies
RUN cd customer-frontend && npm install

# Copy source code
COPY backend ./backend
COPY customer-frontend ./customer-frontend

# Build frontend & backend
RUN cd customer-frontend && npm run build
RUN cd backend && npm run db:generate && npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package.json ./
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/customer-frontend/dist ./customer-frontend/dist

EXPOSE 5000

CMD ["node", "backend/dist/server.js"]
