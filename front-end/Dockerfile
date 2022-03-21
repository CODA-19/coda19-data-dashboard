FROM node:14-alpine3.13

RUN apk update \
    && apk add openssl

ARG BUILD_ENV=prod
ARG PERSONAL_ACCESS_TOKEN

RUN npm install -g http-server

WORKDIR /usr/src/app
COPY ./ ./
COPY ./${BUILD_ENV}.env ./.env

# Make build footprint version for easier debugging.
RUN rm ./version.txt
RUN openssl rand -hex 12 > version.txt

RUN yarn cache clean
RUN yarn install
RUN rm -f .npmrc
RUN yarn build

EXPOSE 8080
CMD [ "http-server", "--port", "8080",  "dist" ]