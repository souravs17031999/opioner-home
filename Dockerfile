# syntax=docker/dockerfile:1

FROM node:17-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production
COPY . .

ENV NODE_ENV="developement"
ENV SERVER_PORT=3000
ENV SECRET_KEY=RANDOMSTRING
ENV DEBUG="*"

ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]