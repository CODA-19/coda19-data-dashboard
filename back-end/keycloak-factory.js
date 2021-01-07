const Keycloak = require('keycloak-connect');
const session = require('express-session');
const KeycloakConfig = require('./keycloak-config');

let keycloak;

function get(app) {
  if (keycloak) return keycloak;

  var memoryStore = new session.MemoryStore();

  //session
  app.use(session({
    secret: 'thisShouldBeLongAndSecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }));

  keycloak = new Keycloak({ store: memoryStore }, KeycloakConfig);
  return keycloak;
}

module.exports = { get };
