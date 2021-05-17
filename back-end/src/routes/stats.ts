import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Explores sites availability.
 *
 * Returns available resources and technical information about deployment for each site *currently* connected to the
 * hub. Information provided through this endpoint should be generatable at site startup.
 */
router.get('/measures', async function(req: Request, res: Response) {

    const measures = {
        cont: [
            {label_en:'count', label_fr:'décompte', value:'count'},
            {label_en:'mean', label_fr:'moyenne', value:'mean'},
            {label_en:'stdev',label_fr:'stdev', value:'stdev'},
            {label_en:'ci95', label_fr:'ci95', value:'ci95'}
        ],
        disc:[
            {label_en:'age',label_fr:'age', value: 'age'},
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
