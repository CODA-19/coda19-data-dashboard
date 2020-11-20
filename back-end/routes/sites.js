const express = require('express');
const router = express.Router()
const { _ } = require('underscore')
const { response } = require('../app')
const axios = require('axios').default

router.get('/', async function(req, res, next) {

  // SiteInfo from all connected sites
  const sites = await axios.get(`${process.env.HUB_ENDPOINT}/info`).then(res => res.data);

  res.status(200).send(sites);
})

module.exports = router