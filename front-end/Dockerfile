FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /usr/src/app
COPY ./ ./

RUN yarn install
RUN yarn build

EXPOSE 8000
CMD [ "http-server", "--port", "8000",  "-S", "-C", "cert.pem", "dist" ]