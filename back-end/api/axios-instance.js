const axios = require('axios');

const instance = axios.create({
    baseURL: process.env.HUB_ENDPOINT,
    timeout: 5000,
});

module.exports = instance;