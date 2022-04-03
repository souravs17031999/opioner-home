# syntax=docker/dockerfile:1

FROM cypress/included:9.5.3

WORKDIR /apitest

RUN npm install -g wait-on

COPY e2e/ docker-entrypoint.sh /apitest/

ENV CYPRESS_BASE_URL="http://localhost:3000/index.html"

ENTRYPOINT ["sh", "/apitest/docker-entrypoint.sh"]