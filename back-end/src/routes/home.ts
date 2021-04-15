import { Router, Request, Response } from 'express';
import JSON5 from 'json5';

import {DashPanels} from "../services/DashPanels";
import {getRandomInt, getCachedFile} from "../helpers/poly";

// For Panel 1 through 12, with prefix P.
const validPanelIDRegex = /^p[1-9][012]?$/;
const router = Router();
const maxJitterMs = 2000;
const mockHomeDataPath = './mock/home.json5';

router.get('/', async (req: Request, res: Response) => {
    // Returns mocked data for the whole home dashboard.
    res.json(JSON5.parse(getCachedFile(req.app, mockHomeDataPath)));
});

router.get('/:panel', async (req: Request, res: Response) => {
    // In the end, the mocked data would really need to be better place than here, most probably
    // dependency injection of the service getting the panel answer. And then just asking the service normally.
    // Both for the demo, I'll keep it like that.
    const homeData = JSON5.parse(getCachedFile(req.app, mockHomeDataPath));

    // Get Panel ID
    const panelID = req.params['panel'] || '';
    if (!panelID.match(validPanelIDRegex)) {
        res.status(400).send('Invalid Panel ID');
    }

    // There are 2 modes "mock" and "lagmock" (first returns mocked data, second adds random jitter)
    const mode = req.query.mode;
    if (mode !== undefined) {
        moddedQuery(<ModQueryType>mode, res, homeData[panelID]);
        return;
    }

    // FIXME(malavv): Should come from the client's request.
    const fromThisDate = new Date("2021/04/09");
    // NOTE(malavv): Prob. also want the site configuration to be passed in.
    const allSites = ["110", "114", "115"];

    // This is instanced to later inject some dependencies.
    const proxy = new DashPanels(homeData, req.app, req, fromThisDate, allSites);
    proxy.getPanelViewModel(panelID)
        .then((data:Object) => res.json(data))
        .catch((err:Error) => res.status(500).json(err.message));
});

type ModQueryType = "mock" | "lagmock";

function moddedQuery(mode: ModQueryType, res:Response, content: any) {
    switch (mode) {
        case 'mock': return res.json(content);
        case 'lagmock': return setTimeout(() => res.json(content), getRandomInt(1, maxJitterMs))
        default:
            console.error("Incorrect modded query type", mode);
    }
}

export default router;