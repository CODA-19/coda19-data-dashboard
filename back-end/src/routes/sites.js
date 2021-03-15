const express = require('express');
const router = express.Router();
const Sites = require('../services/Sites');

/**
 * Explores sites availability.
 *
 * Returns available resources and technical information about deployment for each site *currently* connected to the
 * hub. Information provided through this endpoint should be generatable at site startup.
 */
router.get('/', async function(req, res, next) {
  try {
    const sites = await Sites.listConnected(req);
    res.status(200).send(sites);
  } catch (err) {
    res.status(500).send("Unable to fetch site info from Hub");
  }
})

module.exports = router