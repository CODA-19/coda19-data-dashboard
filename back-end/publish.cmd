docker build -t coda19-hub-dashboard-back:latest .

docker login -u ${USER} -p ${USER}

docker tag coda19-hub-dashboard-back:latest coda19/coda19-hub-dashboard-back:latest
docker push coda19/coda19-hub-dashboard-back:latest

# Only first time and for openshift operator.
oc login -s https://console-pca.svc.valeria.science/ -u ${OPENSHIFT_USER} -p ${OPENSHIFT_PASSWORD}
oc project ul-val-prj-coda19
docker login -u ${OPENSHIFT_USER} -p $(oc whoami -t) docker-registry-default.pca.svc.valeria.science

oc process -f coda19-dashboard-back.yaml --param-file=openshift-project-params.env | oc create -f -
