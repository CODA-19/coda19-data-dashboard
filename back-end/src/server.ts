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

const app = express();
CorsMiddleware.register(app);

// start the server
app.listen(process.env.PORT || '3000', () => console.log('app started'));

const keycloak = KeycloakFactory.get(app);
app.use(keycloak.middleware());

// connect routes to app.
app.use('/', indexRouter) // Check for server availability
app.use('/sites', keycloak.protect(), sitesRouter) // Sites availability
app.use('/home', keycloak.protect(), homeRouter) // Homepage Viewmodel Data
app.use('/api', keycloak.protect(), apiRouter)
