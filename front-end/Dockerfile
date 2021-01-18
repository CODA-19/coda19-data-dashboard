FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /usr/src/app
COPY ./ ./

RUN yarn cache clean
RUN yarn install
RUN yarn build

EXPOSE 8080
CMD [ "http-server", "--port", "8080",  "dist" ]