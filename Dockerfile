FROM node:8.12-alpine

WORKDIR /app

RUN npm i

CMD node bin/www