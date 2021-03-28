import { Application } from 'express';
import cors from 'cors';

function register(app: Application) {
    const allowedOrigins: Array<string> = [
        'http://localhost:3000',
        'https://localhost:3000',
        'http://localhost:8080',
        'https://localhost:8080',
        'http://localhost:8000',
        'https://localhost:8000',
        'https://127.0.0.1:8000',
        'https://coda-dashboard-purple-ul-val-prj-coda19.pca.svc.valeria.science',
        'https://dashboard-poc.hub.coda19.com',
        'https://dashboard.hub.coda19.com',
        'https://dashboard-backend.hub.coda19.com'];

    const corsOptions = {
        origin: allowedOrigins,
        credentials: true
    }

    app.use(cors(corsOptions));
}

export default {
    register
};