FROM node:10-stretch

WORKDIR /app

COPY ./package.json ./

RUN npm i

COPY ./bin ./bin
COPY ./config.js ./
COPY ./app.js ./
COPY ./routes ./routes
COPY ./src ./src

ENV DEBUG first-node-app:*
CMD ["node", "./bin/www"]