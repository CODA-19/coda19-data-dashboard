import { Router, Request, Response } from 'express';
import SummaryMeasures from "../../coda19-ts/src/request/SummaryMeasures";
import {getCachedFile} from "../helpers/poly";
import JSON5 from 'json5';
import {Sites} from "../services/Sites";
import SummaryResult from "../model/viewmodel/SummaryResult";

const router = Router();

function queryParamString(req: Request, key: string) : string | undefined {
    // @ts-ignore
    const obj : string | ParsedQs | string[] | ParsedQs[] | undefined = req.query[key];
    return (typeof obj === "string") ? obj: undefined;
}

router.get('/query', async function(req: Request, res: Response) {

    // Get sites to contact, can be missing, if so the hub will decide.
    const sitesTxt = queryParamString(req, "sites");
    const sites = (sitesTxt === undefined) ? sitesTxt : sitesTxt.split(',');

    // Get configuration payload
    const payloadTxt = queryParamString(req, "payload");
    if (payloadTxt === undefined) {
        res.status(400).send("Invalid payload for summary query");
        return;
    }
    const payload = JSON.parse(Buffer.from(payloadTxt, 'base64').toString());

    // Obtain Summarize Results
    console.log('/query', sites, payload);
    const sitesProxy = new Sites(req);
    let data = null;
    try {
        data = await sitesProxy.doSummaryQuery(payload, sites);
        //res.status(200).send(await sitesProxy.doSummaryQuery(payload, sites));
    } catch (err: any) {
        console.error(err.stack);
        res.status(500).send("Unable to run summarize query on hub.");
    }

    // Process results for the client.
    try {
        res.status(200).send(SummaryResult.fromSummary(payload, data));
    } catch (err: any) {
        console.error(err.stack);
        res.status(500).send("Unable to fetch site info from Hub");
    }
})

router.get('/query_task_1', async function(req: Request, res: Response) {
    try {
        res.status(200).send(JSON5.parse(getCachedFile(req.app, './mock/tasks/ret_task_1.json5')));
    } catch (err: any) {
        console.error(err.stack);
        res.status(500).send("Unable to fetch site info from Hub");
    }
})

router.get('/query_task_2', async function(req: Request, res: Response) {
    try {
        res.status(200).send(JSON5.parse(getCachedFile(req.app, './mock/tasks/ret_task_2.json5')));
    } catch (err: any) {
        console.error(err.stack);
        res.status(500).send("Unable to fetch site info from Hub");
    }
})


router.get('/measures', async function(req: Request, res: Response) {
    try {
        res.status(200).send(SummaryMeasures);
    } catch (err: any) {
        console.error(err.stack);
        res.status(500).send("Unable to fetch site info from Hub");
    }
})

export default router;
