FROM node:lts-alpine

ARG BUILD_ENV=prod

RUN npm install -g http-server

WORKDIR /usr/src/app
COPY ./ ./
COPY ./${BUILD_ENV}.env ./.env

RUN yarn cache clean
RUN yarn install
RUN yarn build

EXPOSE 8080
CMD [ "http-server", "--port", "8080",  "dist" ]