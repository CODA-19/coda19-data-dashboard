
docker build \
    --build-arg BUILD_ENV=prod \
    --build-arg PERSONAL_ACCESS_TOKEN=$1 \
    -t coda19-hub-dashboard:latest .

docker tag coda19-hub-dashboard:latest coda19/coda19-hub-dashboard:latest
docker push coda19/coda19-hub-dashboard:latest
echo "Finished running script sleeping 30s"
sleep 30