// App config from .env
import * as dotenv from "dotenv";
dotenv.config();

import express from 'express';

import KeycloakFactory from './auth/keycloak-factory';

import CorsMiddleware from './middleware/CorsMiddleware';
import indexRouter from './routes/index';
import apiRouter from './routes/api';
import sitesRouter from './routes/sites';
import homeRouter from './routes/home';
import statsRouter from './routes/stats';
import learningRouter from './routes/learning';
import bodyParser from "body-parser";
import version from "./utils/version";

const app = express();
app.use(bodyParser.json())
CorsMiddleware.register(app);

// start the server
const port = process.env.PORT || 3000;
app.set('port', port);
const server = app.listen(app.get('port'), () => {
    console.log(`⚡️[coda19-dashboard-backend]: Server is running at http://localhost:${port}`);
    console.log(`⚡️[coda19-dashboard-backend]: Running ${version.getBuildVersion()} version of build`);
});

const keycloak = KeycloakFactory.get(app);
app.use(keycloak.middleware());

// connect routes to app.
app.use('/', indexRouter) // Check for server availability
app.use('/sites', keycloak.protect(), sitesRouter) // Sites availability
app.use('/home', keycloak.protect(), homeRouter) // Homepage Viewmodel Data
app.use('/api', keycloak.protect(), apiRouter)
app.use('/stats', keycloak.protect(), statsRouter)
app.use('/learning', keycloak.protect(), learningRouter)
