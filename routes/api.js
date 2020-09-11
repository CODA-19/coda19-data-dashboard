const fs = require('fs')
const R = require('r-script')
const csvParse = require('csv-parse')
const express = require('express')
const { exec } = require("child_process")
const router = express.Router()
const { _ } = require('underscore')

router.get('/data', function(req, res, next) {

exec("Rscript ./scripts/meta.R -la", (error, stdout, stderr) => {
    
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

let summaryRaw = {
  'Number_tested':{
    type: 'value',
    data:{
      'CHUM': 200,
      'MUHC': 500,
      'MUHQ': 800,
      'JQH': 650
    },
    range:[105, 1050],
    mean: 537.5
  },
  'Number_positive':{
    type: 'value',
    data: {
      'CHUM': 200,
      'MUHC': 540,
      'MUHQ': 790,
      'JQH': 750
    },
    range:[95,950],
    mean: 510
  },
  'Number_admitted':{
    type: 'value',
    data:{
      'CHUM': 29200,
      'MUHC': 30200,
      'MUHQ': 28800,
      'JQH': 33650
    },
    range:[10543,40502],
    mean: 20710
  },
  'Median_admission_date':{
    type: 'time',
    data:{
      'CHUM': '2020-08-31',
      'MUHC': '2020-09-07',
      'MUHQ': '2020-10-13',
      'JQH': '2020-09-01'
    },
    range:['2020-08-23', '2020-10-29'],
    mean: '2020-09-15'
  },
  'Mean_age':{
    type: 'value',
    data:{
      'CHUM': 49,
      'MUHC': 53,
      'MUHQ': 65,
      'JQH': 55
    },
    range: [45, 69],
    mean: 60
  },
  'Length_of_stay':{
    type: 'value',
    data:{
      'CHUM': 9,
      'MUHC':13,
      'MUHQ': 24,
      'JQH': 17
    },
    range: [7, 25],
    mean:13
  }
},
    categories = Object.keys(summaryRaw),
    types = _.map(summaryRaw,(v,k)=>{return summaryRaw[k].type}),
    ranges = _.map(summaryRaw,(v,k)=>{return summaryRaw[k].range}),
    means = _.map(summaryRaw,(v,k)=>{return summaryRaw[k].mean}),
   summaryData = _.map(summaryRaw, (v,k)=>{
    return _.map(summaryRaw[k].data,(va,ke)=>{
      return [va,ke]
    });
  })

//test
router.post('/summary', (req, res, next)=>{
  res.json({
    'categories': categories,
    'data': summaryData,
    'types': types,
    'ranges': ranges,
    'means' : means
  })
})

module.exports = router
