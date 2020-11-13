const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
  res.render('forest', { title: 'CODA-19' })
})

module.exports = router