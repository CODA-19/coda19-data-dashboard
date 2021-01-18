const express = require('express');
const router = express.Router();
const axiosInstance = require('../api/axios-instance');
const getCredentialsHeader = require('../api/credentials-helper');

router.get('/', async function(req, res, next) {
  const sites = await axiosInstance.get('/info', getCredentialsHeader(req)).then(res => res.data);

  res.status(200).send(sites);
})

module.exports = router