import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.VUE_APP_CODA19_DASHBOARD_BACKEND_URL,
    timeout: 15000,
});

export default instance;