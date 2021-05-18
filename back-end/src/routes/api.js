const fs = require('fs')
const R = require('r-script')
const csvParse = require('csv-parse')
const express = require('express')
const { exec } = require("child_process")
const router = express.Router()
const { _ } = require('underscore')
const moment = require('moment')

const axios = require('../helpers/axios');
const passAuth = require('../auth/auth');

router.get('/data', (req, res, next) => {
  exec("Rscript ./scripts/meta.R -la", (error, stdout, stderr) => {

    if (error) {
      console.log(`error: ${error.message}`)
      res.status(500)
      return
    }

    csvParse(stdout, { columns: false, trim: true }, function (error, rows) {

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

router.get('/nsummary', async (req, res) => {
  const sites = (req.query.sites || '').split(',');
  const resourceKeys = (req.query.var || '').split(',');
  const resources = resourceKeys.map(key => key.split('|')).map(arr => ({ type: arr[0], attribute: arr[1], datatype: arr[2] }));

  // Base response
  let tmpResponse = {
    "summary": {
      "categories": [],
      "data": [],
      "means": [],
      "ranges": [],
      "sites": sites,
      "types": []
    }
  };

  for (let res of resources) {
    const { type, attribute, datatype } = res;
    const data = await axios.get(`/exec?cmd=mean&resourceType=${type}&resourceAttribute=${attribute}&sites=${req.query.sites}`, passAuth(req)).then(res => res.data);
    const conns = data.connections;

    const cat = `${res.type}|${res.attribute}|${res.datatype}`;
    const dat = conns.map(conn => ([conn.value.mean, conn.uid.toString()]));

    // Weighted mean
    if (res.datatype === "number") {
      const sum = (acc, el) => acc + el;
      let totalN = conns.map(conn => conn.value.n).reduce(sum);
      const mean = conns.map(conn => conn.value.mean * (conn.value.n / totalN)).reduce(sum);

      // Range
      const allMeans = conns.map(conn => conn.value.mean);
      const range = [Math.min(...allMeans), Math.max(...allMeans)];

      tmpResponse.summary.means.push(mean);
      tmpResponse.summary.ranges.push(range);
    }

    // Saving to obj.
    tmpResponse.summary.categories.push(cat);
    tmpResponse.summary.data.push(dat);
    tmpResponse.summary.types.push("value");
  }

  res.json(tmpResponse);
});

router.get('/hospitalSummary', async (req, res) => {

    const { type, attribute, datatype } = res;
    const data = await axios.get(`/hospital`, passAuth(req)).then(res => res.data);

    let tempResponse = {
      covid_cases: [],
      death: [],
      ventilator: [],
      icu: []
    };

  for( const k in tempResponse ){
    tempResponse[k] = [];
    tempResponse[k].push(Object.keys(data[k]));
    tempResponse[k].push(Object.values(data[k]));
  }

  tempResponse['sites'] = data.hospitalsProvidingInfo;
    console.log(tempResponse)

  res.json(tempResponse);
});

router.get('/mockStats', (req,res,next)=>{

  let request = req.query,
    sites = request.sites,
    conts = request.cont,
    discs = request.disc,
  resources = request.resources;

  console.log(`${sites} ${conts} ${discs} ${resources}`);
})

router.post('/testData', (req, res, next) => {

  let request = req.body,
    sites = request.sites;
  fs.readFile('./test/summary.json', 'utf8', (err, jsonString) => {
    let raw = JSON.parse(jsonString);
    if (err) {
      console.log("File read failed:", err)
      return
    }
    let age_group = raw.age_group;
    delete raw.age_group;

    let categories = Object.keys(raw),
      types = _.map(raw, (v, k) => { return raw[k].type }),
      summaryData = _.map(raw, (v, k) => {
        return _.map(raw[k].data, (va, ke) => {
          if (sites.indexOf(ke) > -1)
            return [va, ke]
        });
      })

    summaryData = _.map(summaryData, cat => { return _.filter(cat, e => { return e !== undefined }) })

    let site = _.map(summaryData[0], e => { return e[1] });

    let ranges = _.map(summaryData, (e, i) => {
      if (types[i] === 'time') {
        return [moment.min(_.map(e, set => { return moment(set[0]) })).add(-3, 'days').format('YYYY-MM-DD'), moment.max(_.map(e, set => { return moment(set[0]) })).add(3, 'days').format('YYYY-MM-DD')]
      }
      return [_.min(_.map(e, set => { return set[0] })).toFixed(0), _.max(_.map(e, set => { return set[0] })).toFixed(0)];
    }),
      means = _.map(ranges, (cat, i) => {
        if (types[i] === 'time') {
          let diff = moment(cat[0]).diff(moment(cat[1]), 'days')
          return moment(cat[1]).add(diff / 2, 'days').format('YYYY-MM-DD');
        }
        return (parseInt(cat[1]) + parseInt(cat[0])) / 2
      })

    var response = {
      summary: {
        'categories': categories,
        'data': summaryData,
        'types': types,
        'ranges': ranges,
        'means': means,
        'sites': site
      }
    };

    if (request.variables) {
      if (request.variables.indexOf('length_of_stay') >= 0) {
        let idx = categories.indexOf('length_of_stay');
        let length_of_stay = _.map(summaryData[idx], elm => { return [[elm[0], raw.length_of_stay.range[elm[1]], elm[1]]]; });

        var getValues = function (idx, site) {
          var list = [];
          _.keys(this).forEach(k => {
            if (site.indexOf(k) > -1) {
              list.push(this[k][idx])
            }
          });
          return list;
        }

        var getMinDays = _.bind(getValues, raw.length_of_stay.range, 0, site),
          getMaxDays = _.bind(getValues, raw.length_of_stay.range, 1, site),

          minDays = getMinDays(),
          maxDays = getMaxDays(),
          meanDays = [(_.reduce(minDays, function (memo, num) { return memo + num }, 0) / minDays.length), (_.reduce(maxDays, function (memo, num) { return memo + num }, 0) / maxDays.length)];
        length_of_stay.push([[means[idx], meanDays, "Mean"]]);
        response.length_of_stay = length_of_stay;
      }
      if (request.variables.indexOf('age_groups') >= 0) {
        let header = ['age'].concat(
          _.filter(Object.keys(age_group[Object.keys(age_group)[0]]), site => { return sites.indexOf(site) > -1 })
        ),
          body = _.map(age_group, (v, k) => {
            return _.flatten([k, Object.values(
              _.filter(v, (va, ke) => {
                return sites.indexOf(ke) > -1
              })
            )])
          });

        response.age_groups = [header].concat(body);
      }
    }

    res.json(response);
  })


})

module.exports = router
