# dashboard client

# Deployment in production

- cd ./front-end
- docker login -u ${USER} -p ${USER}
- ./publish.sh
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
