# ---------- Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

RUN npm install

# Copy remaining source
COPY . .

# ---------- Production Stage ----------
FROM node:18-alpine

WORKDIR /app

# Copy node_modules and built source from builder
COPY --from=builder /app /app

EXPOSE 3000

CMD ["npm","run","server"]

