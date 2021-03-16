const express = require('express');
const router = express.Router();
const SummarizeQuery = require('../model/stats/SummarizeQuery');
const axios = require('../helpers/axios');
const passAuth = require('../auth/auth');

/**
 * Temporary debugging for new communication protocol version.
 *
 * Delete when move to new version is done.
 */
router.get('/', async function(req, res, next) {

    let sq = new SummarizeQuery({
        "selectors": [{ "resource": "Patient", "filters": [], "fields": [{ "path": "gender" }]}],
        "options": { "measures": { "continuous": [], "categorical": ["count","mode"] } }
    });

    let options = passAuth(req);
    options['data'] = sq;

    let df = await axios.get('/stats/summarize?sites=115,112', options).then(res => res.data);
    console.log(df);

    try {
        res.status(200).send(df);
    } catch (err) {
        res.status(500).send("Unable to summarize info from Hub");
    }
})

module.exports = router