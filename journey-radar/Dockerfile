FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npx shadcn@latest init -d || true

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]