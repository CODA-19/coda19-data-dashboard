
docker build \
    --build-arg BUILD_ENV=prod \
    -t coda19-hub-dashboard:latest .

docker tag coda19-hub-dashboard:latest coda19/coda19-hub-dashboard:latest
docker push coda19/coda19-hub-dashboard:latest
echo "Finished running script sleeping 30s"
sleep 30