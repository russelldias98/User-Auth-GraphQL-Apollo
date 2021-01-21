FROM node:12.20.1-alpine3.10
WORKDIR '/app'

COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "start"]
