const axios = require('axios');

const instance = axios.create({
    baseURL: process.env.CODA19_DASHBOARD_BACKEND_HUB_ENDPOINT,
    timeout: 5000,
});

module.exports = instance;