docker build -t coda19-hub-dashboard:latest .

docker login -u ${USER} -p ${USER}

docker tag coda19-hub-dashboard:latest coda19/coda19-hub-dashboard:latest
docker push coda19/coda19-hub-dashboard:latest

# Only first time and for openshift operator.
oc login -s https://console-pca.svc.valeria.science/ -u ${OPENSHIFT_USER} -p ${OPENSHIFT_PASSWORD}
oc project ul-val-prj-coda19
docker login -u ${OPENSHIFT_USER} -p $(oc whoami -t) docker-registry-default.pca.svc.valeria.science

oc process -f coda19-hub-dashboard.yaml | oc create -f -
