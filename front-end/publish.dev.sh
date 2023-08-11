
docker build \
    --build-arg BUILD_ENV=dev \
    -t coda19-hub-dashboard:dev .

docker tag coda19-hub-dashboard:dev coda19/coda19-hub-dashboard:dev
docker push coda19/coda19-hub-dashboard:dev
echo "Finished running script sleeping 30s"
sleep 30