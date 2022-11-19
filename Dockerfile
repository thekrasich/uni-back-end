FROM node:19

COPY package*.json ./

RUN npm ci

COPY src src

CMD ["npm", "start"]

