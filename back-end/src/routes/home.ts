import { Router, Request, Response, Application } from 'express';
import JSON5 from 'json5';
import fs from 'fs';

import { DashPanels } from "../services/DashPanels";

// For Panel 1 through 12, with prefix P.
const validPanelIDRegex = /^p[1-9][012]?$/;
const router = Router();

function getHomeData(app: Application) {
    let homeDataTxt = app.get('home');
    if (homeDataTxt === undefined) {
        homeDataTxt = fs.readFileSync('./mock/home.json5');
        app.set('home', homeDataTxt);
    }

    return JSON5.parse(homeDataTxt);
}

router.get('/', async (req: Request, res: Response) => {
    const homeData = getHomeData(req.app);
    res.json(homeData);
});

router.get('/:panel', async (req: Request, res: Response) => {
    const panelID = req.params['panel'] || '';
    if (!panelID.match(validPanelIDRegex)) {
        res.status(400).send('Invalid Panel ID');
    }

    const proxy = new DashPanels();
    const proxyReq = proxy.getRequest(panelID);

    proxyReq(req)
        .then((data:Response) => res.json(data))
        .catch((err:Error) => {
            return res.status(500).json(err.message);
        });
});

export default router;