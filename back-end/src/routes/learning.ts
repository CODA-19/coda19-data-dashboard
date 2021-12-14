import { Router, Request, Response } from 'express';
import { Sites } from "../services/Sites";

const router = Router();

function queryParamString(req: Request, key: string) : string | undefined {
    // @ts-ignore
    const obj : string | ParsedQs | string[] | ParsedQs[] | undefined = req.query[key];
    return (typeof obj === "string") ? obj: undefined;
}

router.post('/prepare', async function(req: Request, res: Response){
    const sitesTxt = queryParamString(req, "sites");
    const sites = (sitesTxt === undefined) ? sitesTxt : sitesTxt.split(',');

    const body = req.body
    const sitesProxy = new Sites(req);
    let data = null;
    try {
        data = await sitesProxy.prepare(body, sites);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send("Unable to run prepare query on hub.");
    }
    res.status(200).send(data);
})

router.post('/train', async function(req: Request, res: Response){
    const sitesTxt = queryParamString(req, "sites");
    const sites = (sitesTxt === undefined) ? sitesTxt : sitesTxt.split(',');

    const body = req.body
    const sitesProxy = new Sites(req);
    let data = null;
    try {
        data = await sitesProxy.train(body, sites);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send("Unable to run train query on hub.");
    }
    res.status(200).send(data);
})

router.post('/progress', async function(req: Request, res: Response){
    const sitesTxt = queryParamString(req, "sites");
    const sites = (sitesTxt === undefined) ? sitesTxt : sitesTxt.split(',');

    const body = req.body
    const sitesProxy = new Sites(req);
    let data = null;
    try {
        data = await sitesProxy.progress(body, sites);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send("Unable to run progress query on hub.");
    }
    res.status(200).send(data);
})

router.post('/evaluate', async function(req: Request, res: Response){
    const sitesTxt = queryParamString(req, "sites");
    const sites = (sitesTxt === undefined) ? sitesTxt : sitesTxt.split(',');

    const body = req.body
    const sitesProxy = new Sites(req);
    let data = null;
    try {
        data = await sitesProxy.evaluate(body, sites);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send("Unable to run evaluate query on hub.");
    }
    res.status(200).send(data);
})

export default router;