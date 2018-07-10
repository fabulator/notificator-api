FROM node:10-alpine

WORKDIR /app

ADD package.json package-lock.json rollup.config.js /app/

RUN npm ci

ADD src /app/src

ADD db /app/db

RUN npm run build

CMD [ "npm", "start" ]
