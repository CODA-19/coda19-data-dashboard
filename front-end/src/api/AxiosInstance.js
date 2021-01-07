import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.VUE_APP_CODA19_DASHBARD_BACKEND_URL,
    timeout: 9000,
});

export default instance;