FROM node:16

USER node

WORKDIR /home/node

COPY package.json package-lock.json ./

RUN npm run ci && npm run build

CMD ["node", "dist/main.js"]