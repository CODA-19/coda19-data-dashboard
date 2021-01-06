import Keycloak  from 'keycloak-js';
import keycloakConfig from './keycloakConfig';
 
 
// Setup Keycloak client as needed
// Pass initialization options as required
const keycloak = Keycloak(keycloakConfig);
 
// Call init passing a custom adapter
export default keycloak;