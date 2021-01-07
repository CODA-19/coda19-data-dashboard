const express = require('express');
const router = express.Router();
const axiosInstance = require('../api/axios-instance');

router.get('/', async function(req, res, next) {
  // SiteInfo from all connected sites
  const sites = await axiosInstance.get('/info', {headers: req.headers}).then(res => res.data);

  res.status(200).send(sites);
})

module.exports = router