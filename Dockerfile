# Use official Node.js LTS image
FROM node:20-alpine AS builder

RUN apk add --no-cache bash

# Set working directory inside the container
WORKDIR /app

# Set registry to Yarn
RUN yarn config set registry https://registry.yarnpkg.com

# Copy package.json and package-lock.json
COPY package.json ./
COPY yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy the entire project
COPY . .

# Build the Next.js app
RUN yarn run build

# -------------------------------------------
# Production stage
# -------------------------------------------
FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app ./

# Expose port 3000
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start the Next.js server
CMD ["yarn", "run", "start"]
