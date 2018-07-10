FROM node:10-alpine

WORKDIR /app

ADD package.json package-lock.json /app/

RUN npm ci

ADD build /app/build

ADD db /app/db

CMD [ "npm", "start" ]
