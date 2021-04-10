import { Router, Request, Response } from 'express';
import { Sites } from "../services/Sites";

const router = Router();

/**
 * Explores sites availability.
 *
 * Returns available resources and technical information about deployment for each site *currently* connected to the
 * hub. Information provided through this endpoint should be generatable at site startup.
 */
router.get('/', async function(req: Request, res: Response) {
  const sitesProxy = new Sites(req);

  try {
    res.status(200).send(await sitesProxy.listConnected());
  } catch (err) {
    console.error(err.stack);
    res.status(500).send("Unable to fetch site info from Hub");
  }
})

export default router;
