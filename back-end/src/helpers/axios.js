const axios = require('axios');

module.exports = axios.create({
    baseURL: process.env.CODA19_DASHBOARD_BACKEND_HUB_ENDPOINT,
    // If the request takes more than `timeout` ms, it is aborted.
    timeout: 10000,
    // Communication between FE and BE is JSON
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});
