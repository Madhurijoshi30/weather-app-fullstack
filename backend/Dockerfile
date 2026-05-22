
# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:20-alpine AS base
 
WORKDIR /app
 
# Copy package files first — better layer caching
# If package.json hasn't changed, Docker reuses cached npm install
COPY package*.json ./
 
RUN npm install --production
 
# ── Stage 2: Final lightweight image ─────────────────────────────────────────
FROM node:20-alpine
 
WORKDIR /app
 
# Copy installed modules from base stage
COPY --from=base /app/node_modules ./node_modules
 
# Copy rest of backend source
COPY . .
 
# Render assigns PORT automatically via environment variable
# Your server.js should use: const PORT = process.env.PORT || 5000
EXPOSE 5000
 
CMD ["node", "server.js"]