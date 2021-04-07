FROM node:10

ENV PM2_HOME="/home/node/app/.pm2"

COPY ./ /home/node/app
WORKDIR /home/node/app

RUN npm install pm2 -g
RUN npm install
RUN npm run build

RUN chmod -R 775 /home/node/app
RUN chown -R 1000:root /home/node/app

USER 1000

EXPOSE 3000
CMD ["pm2-runtime","dist/src/server.js"]