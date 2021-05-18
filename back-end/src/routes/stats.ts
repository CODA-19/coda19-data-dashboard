import { Router, Request, Response } from 'express';
import SummaryMeasures from "../../coda19-ts/src/request/SummaryMeasures";

const router = Router();

router.get('/measures_v2', async function(req: Request, res: Response) {
    try {
        res.status(200).send(SummaryMeasures);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send("Unable to fetch site info from Hub");
    }
})

router.get('/measures', async function(req: Request, res: Response) {
    const measures = {
        cont: [
            {label_en:'count', label_fr:'décompte', value:'count'},
            {label_en:'mean', label_fr:'moyenne', value:'mean'},
            {label_en:'stdev',label_fr:'stdev', value:'stdev'},
            {label_en:'ci95', label_fr:'ci95', value:'ci95'}
        ],
        disc:[
            {label_en:'age',label_fr:'âge', value: 'age'},
            {label_en:'gender', label_fr:'genre',value: 'gender'}
        ]
    };

    try {
        res.status(200).send(measures);
    } catch (err) {
        console.error(err.stack);
        res.status(500).send("Unable to fetch site info from Hub");
    }
})

export default router;
