// App config from .env
const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const logger = require('morgan');

const KeycloakFactory = require('./src/auth/keycloak-factory');

const indexRouter = require('./src/routes/index');
const apiRouter = require('./src/routes/api');
const sitesRouter = require('./src/routes/sites');
const homeRouter = require('./src/routes/home');
const debugRouter = require('./src/routes/debug');

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const keycloak = KeycloakFactory.get(app);
app.use(keycloak.middleware());

app.use('/', indexRouter) // Check for server availability
app.use('/sites', keycloak.protect(), sitesRouter) // Sites availability
app.use('/home', keycloak.protect(), homeRouter) // Homepage Viewmodel Data
app.use('/api', keycloak.protect(), apiRouter)
app.use('/debug', keycloak.protect(), debugRouter)

module.exports = app
