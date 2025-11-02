# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (npm install funciona mesmo sem package-lock.json)
RUN npm install --only=production

# Copy source code
COPY . .

# Build TypeScript (if using TS)
# RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "start"]

