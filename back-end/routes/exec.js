const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { _ } = require('underscore');
const { response } = require('../app');
const axios = require('axios').default;

// Schema for base request
const schema = Joi.object({
    cmd: Joi.string().required(),
    resourceType: Joi.string().required(),
    resourceAttribute: Joi.string().required()
});

router.get('/', async function(req, res, next) {

  const { error, value } = schema.validate(req.query);
  if (error) {
    res.status(400).send(`Invalid execution parameters, ${error.message}`);
    return;
  }

  const query = { 
    command: value.cmd, 
    resType: value.resourceType.toLowerCase(), 
    resAttribute: value.resourceAttribute.toLowerCase() 
  };

  const exec = await axios.get(`${process.env.HUB_ENDPOINT}/exec?cmd=${query.command}&resourceType=${query.resType}&resourceAttribute=${query.resAttribute}`).then(res => res.data);
  
  res.status(200).send(exec);
})

module.exports = router