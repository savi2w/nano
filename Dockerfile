FROM node:12.20.0-alpine3.12
LABEL maintainer="Weslen Guerreiro <savi2w@icloud.com>"

RUN npm install -g npm@next-7

WORKDIR /nano

ADD package.json .
ADD package-lock.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE ${APP_PORT}
CMD ["npm", "run", "start"]
