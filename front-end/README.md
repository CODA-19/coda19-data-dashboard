# dashboard client

# Deployment in production

- cd ./front-end
- docker login -u ${USER} -p ${USER}
- ./publish.sh ${PERSONAL_ACCESS_TOKEN}
- Ask a VALERIA team member to update the image in openshift.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

Launch on `https://localhost:8000` by default.

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# Security analysis
## Trivy (Most severe)
docker run --rm -v C:\dev\trivy:/root/.cache/ -v //var/run/docker.sock:/var/run/docker.sock  aquasec/trivy image coda19-hub-dashboard:latest --security-checks vuln > report.txt

## npm
npm audit