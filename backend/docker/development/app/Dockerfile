FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN set -ex \
    && apk add --update --no-cache bash curl \
    && npm install -g nodemon \
    && npm install --no-optional \
    && npm cache clean --force \
    && rm -rf /var/cache/apk/*

COPY . .

ENV PATH=/usr/src/app/node_modules/.bin:$PATH

RUN npx prisma generate

EXPOSE 8000

CMD ["npm", "run", "dev"]