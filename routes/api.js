const fs = require('fs')
const R = require('r-script')
const csvParse = require('csv-parse')
const express = require('express')
const { exec } = require("child_process")
const router = express.Router()
const { _ } = require('underscore')
const moment = require('moment')

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

let length_of_stay_data = [
  [[8, 'CHUM']],
  [[12, "MUHC"]],
  [[17,  'MUHQ']],
  [[15, 'JGH']],
  [[13, 'Mean']]
],

  age_data = [
    ['age', 'CHUM', 'MUHC', 'MUHQ', 'JGH'],
    ['0 to 4yrs', 6, 4, 5, 7, ],
    ['5 to 19 yrs', 5, 7, 6, 7],
    ['20 to 49 yrs', 15, 14, 13, 16],
    ['50 to 64 yrs', 26, 28, 25, 23],
    ['65 and up', 34, 29, 31, 36]
  ];
//
// let summaryRaw = {
//   'Number_tested':{
//     type: 'value',
//     data:{
//       'CHUM': 200,
//       'MUHC': 500,
//       'MUHQ': 800,
//       'JQH': 650
//     },
//     range:[105, 1050],
//     mean: 537.5
//   },
//   'Number_positive':{
//     type: 'value',
//     data: {
//       'CHUM': 200,
//       'MUHC': 540,
//       'MUHQ': 790,
//       'JQH': 750
//     },
//     range:[95,950],
//     mean: 510
//   },
//   'Number_admitted':{
//     type: 'value',
//     data:{
//       'CHUM': 29200,
//       'MUHC': 30200,
//       'MUHQ': 28800,
//       'JQH': 33650
//     },
//     range:[10543,40502],
//     mean: 20710
//   },
//   'Median_admission_date':{
//     type: 'time',
//     data:{
//       'CHUM': '2020-08-31',
//       'MUHC': '2020-09-07',
//       'MUHQ': '2020-10-13',
//       'JQH': '2020-09-01'
//     },
//     range:['2020-08-23', '2020-10-29'],
//     mean: '2020-09-15'
//   },
//   'Mean_age':{
//     type: 'value',
//     data:{
//       'CHUM': 49,
//       'MUHC': 53,
//       'MUHQ': 65,
//       'JQH': 55
//     },
//     range: [45, 69],
//     mean: 60
//   },
//   'Length_of_stay':{
//     type: 'value',
//     data:{
//       'CHUM': 9,
//       'MUHC':13,
//       'MUHQ': 24,
//       'JQH': 17
//     },
//     range: [7, 25],
//     mean:13
//   }
// },


//test
router.post('/summary', (req, res, next)=>{

  let request = req.body,
    sites = request.sites;
  fs.readFile('./test/summary.json', 'utf8', (err, jsonString) => {
    let raw = JSON.parse(jsonString);
    if (err) {
      console.log("File read failed:", err)
      return
    }
    let categories = Object.keys(raw),
      types = _.map(raw,(v,k)=>{return raw[k].type}),
      summaryData = _.map(raw, (v,k)=>{
        return _.map(raw[k].data,(va,ke)=>{
          if(sites.indexOf(ke)>-1)
            return [va,ke]
        });
      })

    summaryData = _.map(summaryData,cat=>{return _.filter(cat,e=>{return e!==undefined})})

    let site = _.map(summaryData[0], e=>{return e[1]});

    let ranges = _.map(summaryData, (e,i)=>{
      if(types[i]==='time'){
        return [moment.min(_.map(e,set=>{return moment(set[0])})).add(-3,'days').format('YYYY-MM-DD'), moment.max(_.map(e,set=>{return moment(set[0])})).add(3,'days').format('YYYY-MM-DD')]
      }
      return [_.min(_.map(e,set=>{return set[0]})).toFixed(0), _.max(_.map(e,set=>{return set[0]})).toFixed(0)];
    }),
      means = _.map(ranges, (cat, i)=>{
        if(types[i] === 'time'){
          let diff = moment(cat[0]).diff(moment(cat[1]),'days')
          return moment(cat[1]).add( diff/2, 'days' ).format('YYYY-MM-DD');
        }
        return (parseInt(cat[1])+parseInt(cat[0]))/2
      })


    var response = {
      summary:{
        'categories': categories,
        'data': summaryData,
        'types': types,
        'ranges': ranges,
        'means' : means,
        'sites' : site
      }
    };

    res.json(response);
  })

  // if(request.variables){
  //   if(request.variables.indexOf('length_of_stay') >= 0 ){
  //     response.length_of_stay = length_of_stay_data;
  //   }
  //   if(request.variables.indexOf('age_groups') >= 0 ){
  //     response.age_groups = age_data
  //   }
  // }

})

module.exports = router
