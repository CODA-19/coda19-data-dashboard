rm -r -f ./dist
npm ci
npm run build
docker build -t coda19-hub-dashboard-back:latest .

docker tag coda19-hub-dashboard-back:latest coda19/coda19-hub-dashboard-back:latest
docker push coda19/coda19-hub-dashboard-back:latest
echo "Finished running script sleeping 30s"
sleep 30