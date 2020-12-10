const express = require('express');
const router = express.Router();
const { _ } = require('underscore');
const { response } = require('../app');
const axios = require('axios').default;

const queries = [
    { 'label': 'Active Connections', 'path': 'sites', 'param': '' },
    { 'label': 'Mean Age', 'path': 'exec', 'param': '?cmd=mean&resourceType=patient&resourceAttribute=age' },
    { 'label': 'Sex frequencies', 'path': 'exec', 'param': '?cmd=freq&resourceType=patient&resourceAttribute=sex' },
    { 'label': 'Suppressed Mean', 'path': 'exec', 'param': '?cmd=mean&resourceType=patient&resourceAttribute=teeth' },
    { 'label': 'Suppressed Freq', 'path': 'exec', 'param': '?cmd=freq&resourceType=patient&resourceAttribute=finger' },
]

router.get('/', async function(req, res) {

  const pathname = decodeURIComponent(req.query.pathname);
  const query = queries.find(q => `${q.path}${q.param}` === pathname);
  const content = query ? (await axios.get(`http://localhost:${process.env.PORT}/${pathname}`)).data : undefined;

  res.render('explorer', { title: 'CODA-19', queries: queries, content: content, active: query })

})

module.exports = router