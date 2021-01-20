const config = {
    "realm": process.env.CODA19_DASHBOARD_BACKEND_KEYCLOAK_REALM,
    "auth-server-url": process.env.CODA19_DASHBOARD_BACKEND_KEYCLOAK_URL,
    "ssl-required": "external",
    "resource": "coda19-dashboard-backend",
    "credentials": {
        "secret": process.env.CODA19_DASHBOARD_BACKEND_KEYCLOAK_CLIENT_SECRET
    },
    "confidential-port": 0
}

module.exports = config;