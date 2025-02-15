
FROM node:20-alpine AS builder

WORKDIR /app
    
# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
    
# Copy the entire project
COPY . .
    
# Build Next.js app
RUN yarn build
    


# ---- Production Runner ----
FROM node:20-alpine AS runner
    
WORKDIR /app
    
# Copy only necessary files from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist  ./dist
COPY --from=builder /app/public ./public
    
# Expose the Next.js port
EXPOSE 3000
    
# Start the application
CMD ["yarn", "start"]