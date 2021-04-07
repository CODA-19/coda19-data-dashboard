<template>
  <div class="mainContainer home">
    <v-container>
      <div class="row">
        <div class="col-lg-4 col-md-4">
          <HomeTextTile :txTitle="$t('home_new_patient')"
                        :txBottom="$t('home_positivity',{positivity: tiles.patientGroup.rate})"
                        :data="tiles.patientGroup.total"></HomeTextTile>
        </div>
        <div class="col-lg-4 col-md-4">
          <HomeTextTile :txTitle="$t('home_new_case')"
                        :txBottom="$t('home_average',{average: tiles.dailyCase.average})  +  $t('home_rt',{rate: tiles.dailyCase.rt})"
                        :data="tiles.dailyCase.total"></HomeTextTile>
        </div>
        <div class="col-lg-4 col-md-4">
          <HomeTextTile :txTitle="$t('home_daily_death')"
                        :txBottom="$t('home_average',{average: tiles.dailyDeath.average})  + $t('home_rt',{rate: tiles.dailyDeath.rt})"
                        :data="tiles.dailyDeath.total"></HomeTextTile>
        </div>
      </div>

      <div class="row">
        <div v-for="(line,i) in lines" class="col-lg-4 col-md-6 col-sm-12 cardContainer">
          <div class="title"><span>{{ $t(titleKeys[i]) }}</span></div>
          <v-card>
            <LineChart style="width: 100%" :categories="line.categories" :dates="line.dates" :data="line.data"
                       :prediction="line.prediction"></LineChart>
          </v-card>
        </div>
      </div>


      <div class="row">
        <div v-for="(bar,i) in barcharts0" class="col-lg-4 col-md-12 col-sm-12 cardContainer">
          <div class="title"><span>{{ $t(titleKeys[i]) }}</span></div>
          <v-card>
            <BarChart style="width:100%" :colors="colors" :horizontal="true" :data="bar.data" :category="bar.sites"
                      :labels="siteLabels" autoresize></BarChart>
          </v-card>
        </div>
        <div class="col-lg-4 col-md-12 col-sm-12 cardContainer">
          <div class="title"><span>{{ $t("home_total_occupation") }}</span></div>
          <v-card>
            <Gauge style="width: 100%" :value="totalOccupation"></Gauge>
          </v-card>
        </div>
      </div>

      <div class="row">

        <div v-for="(bar,i) in barcharts1" class="col-lg-4 col-md-12 col-sm-12 cardContainer">
          <div class="title"><span>{{ $t(titleKeys[i]) }}</span></div>
          <v-card>
            <BarChart style="width:100%" :colors="colors" :data="bar.data" :category="bar.sites" :group="bar.group"
                      :labels="siteLabels" autoresize></BarChart>
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

export default {
  name: "Home",
  components: {LineChart, BarChart, Legend, Gauge, HomeTextTile},
  methods: {
    getPanelData: async function (i) {
      // Moved from await to promise, because await is making all queries sequential.
      GeneralApi.DashData(i, "lagmock")
          .then(res => this.loadData(res.data, i))
          .catch(err => console.error(err.stack));

      GeneralApi.panel(1, "lagmock")
          .then(res => this.loadP1(res.data))
          .catch(err => console.error(err.stack));

      GeneralApi.panel(2, "lagmock")
          .then(res => this.loadP2(res.data))
          .catch(err => console.error(err.stack));

      GeneralApi.panel(3, "lagmock")
          .then(res => this.loadP3(res.data))
          .catch(err => console.error(err.stack));
    },
    loadP1: function (data) {
      this.tiles.patientGroup.rate = data.prevalence;
      this.tiles.patientGroup.total = data.total_count;
    },
    loadP2: function (data) {
      this.tiles.dailyCase.average = data.sma_7d;
      this.tiles.dailyCase.rt = data.exp_rate_7d;
      this.tiles.dailyCase.total = data.new_cases;
      // {"date":"2021-03-15","new_cases":669,"sma_7d":943,"exp_rate_7d":0.92}
    },
    loadP3: function (data) {
      this.tiles.dailyDeath.average = data.sma_7d;
      this.tiles.dailyDeath.rt = data.exp_rate_7d;
      this.tiles.dailyDeath.total = data.new_cases;
      // {"date":"2021-03-15","new_cases":7,"sma_7d":11,"exp_rate_7d":0.86
    },
    loadData: function (data, i) {
      switch (i) {
        case 4:
        case 5:
        case 6:
          this.lines[i] = {
            categories: _.keys(data.sites || data.types),
            data: _.values(data.sites || data.types).map(s => s.est),
            dates: data.dates,
            prediction: data.start_of_predictions
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
          this.totalOccupation = data.occupancy * 100;
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
  },
  async created() {
    for (let i = 1; i < 13; i++) {
      this.getPanelData(i);
    }
  },
  data() {
    return {
      text: {
        1: {},
        2: {},
        3: {}
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
      barcharts1: {
        10: {},
        11: {},
        12: {}
      },
      titleKeys: {
        4: "home_positive_rate_per_site",
        5: "home_new_case_per_site",
        6: "home_hospitalisation_rate",
        7: "icu",
        8: "hospitalization",
        10: "length_of_stay",
        11: "age",
        12: "h/f"
      },
      colors: Const.colors,
      //tiles:{patientGroup:{rate: 12.5,total:422000}, dailyCase:{total:145,average:135,rt:0.84} ,dailyDeath:{total:11,average:12,rt:0.4}},
      tiles: {
        patientGroup: {rate: NaN, total: NaN},
        dailyCase: {total: NaN, average: NaN, rt: NaN},
        dailyDeath: {total: NaN, average: NaN, rt: NaN}
      },
      totalOccupation: 0,
      siteLabels: {},
    }
  }
}
</script>

<style scoped>

</style>
