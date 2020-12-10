FROM node:10

WORKDIR /usr/src/app
COPY ./ ./

RUN yarn install
RUN yarn global add pm2

EXPOSE 3000
CMD ["pm2-runtime", "./bin/www"]
