const fs = require('fs')
const R = require('r-script')
const csvParse = require('csv-parse')
const express = require('express')
const { exec } = require("child_process")
const router = express.Router()

router.get('/data', function(req, res, next) {
  
  exec("RScript ./scripts/meta.R -la", (error, stdout, stderr) => {
    
    if (error) {
      console.log(`error: ${error.message}`)
      res.status(500)
      return
    }
    
    csvParse(stdout, {columns: false, trim: true}, function(error, rows) {
      
      if (error) {
        console.log(`error: ${error.message}`)
        res.status(500)
        return
      }
      
      const plotConfig = {
        "effectLabel": "SMD",
        "vBar": 1,
        "nTicks": 6,
        "width": 500
      }
      
      const plotData = [
        {
          "description": "Site",
          "overrideLabel": "SMD (95% CI)"
        }
      ]
      
      for (row of rows.slice(1)) {
        plotData.push({
          "description": row[0],
          "effect": {
            "effect": parseFloat(row[1]), 
            "low": parseFloat(row[2]),
            "high": parseFloat(row[3])
          },
          "markerSize": 0.5
        })
      }
      
      res.json({
        "plotConfig": plotConfig,
        "data": plotData
      })
      
    })
    
  })
  
})

module.exports = router