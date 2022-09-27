import {Request, Response, Router} from 'express';
import JSON5 from 'json5';
import {DashPanels} from "../services/DashPanels";
import {getCachedFile} from "../helpers/poly";
import {isValidDate, isValidPanelId} from "../helpers/validators";

const router = Router();

// Mock home data folder.
const mockHomeDataPath = './mock/home.json5';
const defaultDate = new Date().toISOString().split('T')[0];

router.get('/', async (req: Request, res: Response) => {
    // Returns mocked data for the whole home dashboard.
    res.json(JSON5.parse(getCachedFile(req.app, mockHomeDataPath)));
});

// Main entrypoint for all home dashboard panels.
router.get('/:panel', async (req: Request, res: Response) => {
    // Get panel ID
    const panelID = req.params['panel'] || '';
    if (!isValidPanelId(panelID)) {
        res.status(400).send(`Invalid Panel ID: ${panelID}`);
        return;
    }

    // Get date until
    const untilDate = getSingleQueryParam(req, 'until') || defaultDate;
    if (!isValidDate(untilDate)) {
        res.status(400).send(`Invalid date format ${untilDate}`);
        return;
    }

    // NOTE(malavv): Prob. also want the site configuration to be passed in.
    const allSites = ["112", "115"];

    // This is instanced to later inject some dependencies.
    // NOTE(malavv): the date replace is because UTC encoded dates are being converted in the tunnel, stick to local one.
    const proxy = new DashPanels(mockHomeDataPath, req.app, req, new Date(untilDate.replace(/-/g, "/")), allSites);
    proxy.getPanelViewModel(panelID)
        .then((data: Object) => res.json(data))
        .catch((err: Error) => res.status(500).json(err.message));
});


function getSingleQueryParam(req: Request, key: string) : string | undefined {
    // @ts-ignore
    let data = req.query[key];
    if (data === undefined)
        return undefined;
    if (typeof data === "string")
        return data;
    if (Array.isArray(data) && data.length >= 0)
        return <string>data[0];
    return undefined;
}

export default router;