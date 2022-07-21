# coda19-data-dashboard-backend
The backend portion of the dashboard

# Deployment in production
 - cd ./back-end
 - docker login -u ${USER} -p ${USER}
 - ./publish.sh
 - Ask a VALERIA team member to update the image in openshift.

# Security analysis
 ## Trivy (Most severe)
docker run --rm -v C:\dev\trivy:/root/.cache/ -v //var/run/docker.sock:/var/run/docker.sock  aquasec/trivy image coda19-hub-dashboard-back:latest --security-checks vuln > report.txt

## npm
npm audit