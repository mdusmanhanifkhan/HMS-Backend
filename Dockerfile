# ---------- Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

RUN npm install

# Copy remaining source
COPY . .

# Copy .env so Prisma can generate client with DATABASE_URL
COPY .env .env

# Generate Prisma client during build
RUN npx prisma generate

# ---------- Production Stage ----------
FROM node:18-alpine

WORKDIR /app

# Copy node_modules and built source from builder
COPY --from=builder /app /app

# Also copy .env to production stage
COPY .env .env

EXPOSE 3000

CMD ["npm","run","server"]
