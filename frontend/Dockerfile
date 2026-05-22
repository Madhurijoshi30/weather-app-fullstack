# ── Stage 1: Build React + Vite app ──────────────────────────────────────────
FROM node:20-alpine AS builder
 
WORKDIR /app
 
COPY package*.json ./
RUN npm install
 
COPY . .
 
# Pass your Render backend URL as a build arg
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
 
# Vite builds into /app/dist
RUN npm run build
 
# ── Stage 2: Serve with Nginx ─────────────────────────────────────────────────
FROM nginx:alpine
 
# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*
 
# Copy built React app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
 
# Custom nginx config — fixes React Router 404 on refresh
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]