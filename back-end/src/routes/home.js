const fs = require('fs');
const JSON5 = require('json5');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {



    // Since this is runtime, it's on the root.
    let raw = fs.readFileSync('./mock/home.json5');
    let student = JSON5.parse(raw);
    res.json(student);
});

module.exports = router
