rm -r -f ./dist
npm ci
npm run build
docker build -t coda19-hub-dashboard-back:dev .

docker tag coda19-hub-dashboard-back:dev coda19/coda19-hub-dashboard-back:dev
docker push coda19/coda19-hub-dashboard-back:dev
echo "Finished running script sleeping 30s"
sleep 30