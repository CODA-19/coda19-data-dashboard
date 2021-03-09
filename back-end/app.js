// App config from .env
const dotenv = require("dotenv");
dotenv.config();

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const KeycloakFactory = require('./keycloak-factory');

const indexRouter = require('./src/routes/index')
const apiRouter = require('./src/routes/api')
const authRouter = require('./src/routes/auth')
const sitesRouter = require('./src/routes/sites')
const execRouter = require('./src/routes/exec')
const explorerRouter = require('./src/routes/explorer');

const cors = require('cors'); //temp, for local test purpose
const app = express()
app.use(cors({credentials: true}));//temp, for local test purpose
app.disable('view cache')


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const keycloak = KeycloakFactory.get(app);
app.use(keycloak.middleware());

app.use('/', indexRouter)
app.use('/api', keycloak.protect(), apiRouter)
app.use('/auth', keycloak.protect(), authRouter)
app.use('/sites', keycloak.protect(), sitesRouter)
app.use('/exec', keycloak.protect(), execRouter)
app.use('/explorer', keycloak.protect(), explorerRouter)


module.exports = app
