const express = require('express')
const router = express.Router()
const { _ } = require('underscore')
const { response } = require('../app')
const axios = require('axios').default

router.get('/', function(req, res, next) {

  axios.get('http://localhost:8080/info')
    .then(response => {
        const hubInfo = response.data;
        res.render('sites', { title: 'CODA-19', sites: hubInfo.connections, hub_version: hubInfo.api_version })
    })
    .catch(function (error) {
        console.log(error.toJSON());
    });
    
})

module.exports = router