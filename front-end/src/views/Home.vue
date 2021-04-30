<template>
  <div class="mainContainer home">
    <v-container>
      <!-- Line 1 (1, 2, 3) -->
      <div class="row">
        <div v-for="(tile,i) in numberTiles" class="col-lg-4 col-md-4">
          <HomeTextTile :txTitle= "$t(titleKeys[i])"
                        :nSites="3"
                        :txBottom="i==='1' ? $t('home_positivity',{positivity: tile.rate}) : $t('home_average',{average: tile.average})  + $t('home_rt',{rate: tile.rt})"
                        :data="tile.total"></HomeTextTile>
        </div>
      </div>

      <!-- Line 2 (4, 5, 6) -->
      <div class="row">
        <div v-for="(line,i) in lines" class="col-lg-4 col-md-6 col-sm-12 cardContainer">
          <div class="title"><span>{{ $t(titleKeys[i]) }}</span></div>
          <v-card>
            <PanelOverlay :dataReady="isReady(line.data)" :dataError="line.dataError" />

            <LineChart style="width: 100%" :categories="line.categories" :dates="line.dates" :data="line.data"
                       :prediction="line.prediction"></LineChart>
          </v-card>
        </div>
      </div>

      <!-- Line 3 (7, 8, 9 -->
      <div class="row">
        <div v-for="(bar,i) in barcharts0" class="col-lg-4 col-md-12 col-sm-12 cardContainer">
          <div class="title" :style="{opacity: getTOpacity(i)}"><span>{{ $t(titleKeys[i]) }}</span></div>
          <v-card>
            <PanelOverlay :dataReady="isReady(bar.data)" :dataError="bar.dataError" />

            <BarChart :style="{width: '100%', opacity: getTOpacity(i)}" :colors="colors" :horizontal="true" :data="bar.data" :category="bar.sites" autoresize></BarChart>
          </v-card>
        </div>
        <div class="col-lg-4 col-md-12 col-sm-12 cardContainer">
          <div class="title" style="opacity: 0.5;"><span>{{ $t("home_total_occupation") }}</span></div>
          <v-card>
            <PanelOverlay :dataReady="isReady(gauge.rate)" :dataError="gauge.dataError" style="opacity: 0.5;"  />

            <Gauge style="width: 100%; opacity: 0.5;" :value="gauge.rate"></Gauge>
          </v-card>
        </div>
      </div>

      <!-- Line 4 (10, 11, 12) -->
      <div class="row">
        <div v-for="(bar,i) in barcharts1" class="col-lg-4 col-md-12 col-sm-12 cardContainer">
          <div class="title" style="opacity: 0.5;"><span>{{ $t(titleKeys[i]) }}</span></div>
          <v-card>
            <PanelOverlay :dataReady="isReady(bar.data)" :dataError="bar.dataError" />

            <BarChart style="width:100%; opacity: 0.5;" :colors="colors" :data="bar.data" :category="bar.sites" :group="bar.group" autoresize></BarChart>
          </v-card>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import {_} from "vue-underscore";
import BarChart from "@/components/barChart";
import HomeTextTile from "@/components/HomeTextTile";
import Const from "@/const";
import Legend from "@/components/legend";
import GeneralApi from "@/api/GeneralApi";
import Gauge from "@/components/Gauge";
import LineChart from "../components/lineChart";
import PanelOverlay from "../components/PanelOverlay";
import { DateTime } from "luxon";

export default {
  name: "Home",
  components: {PanelOverlay, LineChart, BarChart, Legend, Gauge, HomeTextTile},
  methods: {
    getPanelData: function(i, mode) {
      // Moved from await to promise, because await is making all queries sequential.
      GeneralApi.DashData(i, mode)
          .then(res => this.loadData(res.data, i))
          .catch(err => {this.dataError(i); console.error(err.stack)});
    },
    loadData: function(data, i) {
      switch (i) {
        case 1:
          this.numberTiles[i] = {
            rate : data.prevalence,
            total : data.total_count
          };
          break;
        case 2:
        case 3:
          this.numberTiles[i] = {
            average : data.sma_7d,
            rt : data.exp_rate_7d,
            total : data.new_cases
          };
          break;
        case 4:
        case 5:
        case 6:
          this.lines[i] = {
            categories: _.keys(data.sites || data.types),
            data: _.values(data.sites || data.types).map(s => s.est),
            dates: data.dates.map(date => DateTime.fromISO(date).toFormat('LLL dd')), // Assume EST instead of GMT
            prediction: data.start_of_predictions === undefined ? undefined : DateTime.fromISO(data.start_of_predictions).toFormat('LLL dd')
          };
          break;

        case 7:
        case 8:
          this.barcharts0[i] = {
            sites: _.keys(data.sites),
            data: _.values(data.sites),
          };
          break;

        case 9:
          this.gauge = { rate :data.occupancy * 100 };
          break;

        case 10:
        case 11:
        case 12:
          this.barcharts1[i] = {
            sites: _.keys(data.sites),
            data: _.values(data.sites),
            group: data.categories,
          };
          break;
      }
    },
    dataError: function(i){
      switch (i) {
        case 4:
        case 5:
        case 6:
          this.lines[i].dataError = true;
          break;
        case 7:
        case 8:
          this.barcharts0[i].dataError = true;
          break;

        case 9:
          this.gauge.dataError = true;
          break;

        case 10:
        case 11:
        case 12:
          this.barcharts1[i].dataError = true;
          break;
        case 13:
        case 14:
          this.errors[i].dataError = true;
          break;
      }
    },
    isReady: function(data) {
      if(data)
        return true;
      else return false;
    },
    getTOpacity(i) {
      return i === "7" ? 1.0: 0.5;
    }
  },
  created() {
    //const mode = null; // null means direct query to the HUB *real* and if it fails it fails
    const mode = "lagmock"; // lagmock returns mocked data with random lag.
    for (let i = 1; i < 13; i++) {
      this.getPanelData(i, mode);
    }
  },
  data() {
    return {
      numberTiles: {
        1: {rate: NaN, total: NaN},
        2: {total: NaN, average: NaN, rt: NaN},
        3: {total: NaN, average: NaN, rt: NaN}
      },
      lines: {
        4: {},
        5: {},
        6: {}
      },
      barcharts0: {
        7: {},
        8: {}
      },
      gauge: {
        rate:0
      },
      barcharts1: {
        10: {},
        11: {},
        12: {}
      },
      titleKeys: {
        1: "home_new_patient",
        2: "home_new_case",
        3: "home_daily_death",
        4: "home_positive_rate_per_site",
        5: "home_new_case_per_site",
        6: "home_hospitalisation_rate",
        7: "icu",
        8: "hospitalization",
        10: "length_of_stay",
        11: "age",
        12: "h/f"
      },
      colors: Const.colors
    }
  }
}
</script>

<style scoped>

</style>
