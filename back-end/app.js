// App config from .env
const dotenv = require("dotenv");
dotenv.config();

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const KeycloakFactory = require('./keycloak-factory');

const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const authRouter = require('./routes/auth')
const sitesRouter = require('./routes/sites')
const execRouter = require('./routes/exec')
const explorerRouter = require('./routes/explorer');

const cors = require('cors'); //temp, for local test purpose
const app = express()
app.use(cors());//temp, for local test purpose
app.disable('view cache')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
