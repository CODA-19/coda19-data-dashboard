import { Router, Request, Response, Application } from 'express';
import JSON5 from 'json5';
import fs from 'fs';

import {DashPanels} from "../services/DashPanels";
import {Sites} from "../services/Sites";

// For Panel 1 through 12, with prefix P.
const validPanelIDRegex = /^p[1-9][012]?$/;
const router = Router();
const maxJitterMs = 2000;

function getHomeData(app: Application) {
    let homeDataTxt = app.get('home');
    if (homeDataTxt === undefined) {
        homeDataTxt = fs.readFileSync('./mock/home.json5');
        app.set('home', homeDataTxt);
    }

    return JSON5.parse(homeDataTxt);
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function moddedQuery(mode: string, res:Response, content: any) {
    switch (mode) {
        case 'mock': return res.json(content);
        case 'lagmock': return setTimeout(() => res.json(content), getRandomInt(1, maxJitterMs))
    }
}

router.get('/', async (req: Request, res: Response) => {
    const homeData = getHomeData(req.app);
    res.json(homeData);
});

router.get('/t', async (req: Request, res: Response) => {
    const sitesProxy = new Sites(req);
    const dat = await sitesProxy.getCohortSizeOnDate(new Date(2021, 4, 5), ["115"]);
    res.json(dat);
});

router.get('/:panel', async (req: Request, res: Response) => {
    // In the end, the mocked data would really need to be better place than here, most probably
    // dependency injection of the service getting the panel answer. And then just asking the service normally.
    // Both for the demo, I'll keep it like that.
    const homeData = getHomeData(req.app);

    // Get Panel ID
    const panelID = req.params['panel'] || '';
    if (!panelID.match(validPanelIDRegex)) {
        res.status(400).send('Invalid Panel ID');
    }

    // There are 2 modes "mock" and "lagmock" (first returns mocked data, second adds random jitter)
    const mode = req.query.mode;
    if (mode !== undefined) {
        moddedQuery(<string>mode, res, homeData[panelID]);
        return;
    }

    // This is instanced to later inject some dependencies.
    const proxy = new DashPanels(homeData, req.app, req);
    proxy.getPanelViewModel(panelID)
        .then((data:Object) => res.json(data))
        .catch((err:Error) => res.status(500).json(err.message));
});

export default router;