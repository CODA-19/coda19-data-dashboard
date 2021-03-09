const express = require('express');
const router = express.Router();
const axios = require('../helpers/axios');
const passAuth = require('../auth/auth');


router.get('/', async function(req, res, next) {
  const sites = await axios.get('/info', passAuth(req)).then(res => res.data);

  res.status(200).send(sites);
})

module.exports = router