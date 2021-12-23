FROM node:10

### This docker file assumes that the npm build has already been run on the local host machine.
### When run with the ./publish.sh script, this docker file has everything to built the image as lightly as possible.

ENV PM2_HOME="/home/node/app/.pm2"

WORKDIR /usr/src/app
COPY ./ ./

# Make build footprint version for easier debugging.
RUN rm ./version.txt
RUN openssl rand -hex 12 > version.txt

# Install local packages for running server.
RUN npm install dotenv
RUN npm install pm2 -g

# Make app run on lower priviledge user for openshift.
RUN chmod -R 775 /usr/src/app/dist
RUN chown -R 1000:root /usr/src/app/dist

USER 1000

EXPOSE 3000
CMD ["pm2-runtime","dist/src/server.js"]