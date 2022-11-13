# syntax=docker/dockerfile:1

FROM node:17-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production
COPY . .

ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]