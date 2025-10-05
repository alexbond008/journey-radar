FROM node:20-alpine

WORKDIR /app

# Install dependencies needed for some npm packages
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the development port
EXPOSE 3000

# Start the development server with host flag for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]