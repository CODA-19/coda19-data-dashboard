const Keycloak = require('keycloak-connect');
const session = require('express-session');
const KeycloakConfig = require('./keycloak-config');

let keycloak;

function get(app) {
  if (keycloak) return keycloak;

  let memoryStore = new session.MemoryStore();

  const sessionSecret = process.env.CODA19_DASHBOARD_BACKEND_KEYCLOAK_SESSION_MEMORY_SECRET
    ? process.env.CODA19_DASHBOARD_BACKEND_KEYCLOAK_SESSION_MEMORY_SECRET
    : '';

  //session
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }));

  keycloak = new Keycloak({ store: memoryStore }, KeycloakConfig);
  return keycloak;
}

module.exports = { get };
