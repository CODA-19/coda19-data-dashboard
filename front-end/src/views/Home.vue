<template>
  <div class="mainContainer home">
    <v-container>
      <div class="row">
        <div class="col-lg-4 col-md-4">
          <HomeTextTile :txTitle="$t('home_new_patient')" :txBottom="$t('home_positivity',{positivity: tiles.patientGroup.rate})" :data="tiles.patientGroup.total" > </HomeTextTile>
        </div>
        <div class="col-lg-4 col-md-4">
           <HomeTextTile :txTitle="$t('home_new_case')" :txBottom="$t('home_average',{average: tiles.dailyCase.average})  +  $t('home_rt',{rate: tiles.dailyCase.rt})" :data="tiles.dailyCase.total" > </HomeTextTile>
        </div>
        <div class="col-lg-4 col-md-4">
            <HomeTextTile :txTitle="$t('home_daily_death')" :txBottom="$t('home_average',{average: tiles.dailyDeath.average})  + $t('home_rt',{rate: tiles.dailyDeath.rt})" :data="tiles.dailyDeath.total" > </HomeTextTile>
        </div>
      </div>

      <div class="row">
        <div v-for="chart in lineCharts" class="col-lg-4 col-md-6 col-sm-12 cardContainer">
          <div class="title"><span>{{$t(chart.titleKey)}}</span></div>
        <v-card>
          <LineChart style="width: 100%"></LineChart>
        </v-card>
        </div>
      </div>

      <div class="row">
        <div v-for="set in sets2" class="col-lg-4 col-md-12 col-sm-12 cardContainer">
          <div class="title"><span>{{$t(set)}}</span></div>
          <v-card>
            <BarChart style="width:100%" :colors="colors" :horizontal="true" :data="getData(set)" :category="category(set)" :highlight="highlight"  :labels="siteLabels" autoresize></BarChart>
          </v-card>
        </div>
        <div  class="col-lg-4 col-md-12 col-sm-12 cardContainer">
          <div class="title"><span>{{$t("home_total_occupation")}}</span></div>
          <v-card>
          <Gauge style="width: 100%" :value="totalOccupation"></Gauge>
          </v-card>
        </div>
      </div>

      <div class="row">
<!--        <Legend class="col-12 row" v-bind:colors="colors" :sites="category()" :direction="'horizontal'" :highlight.sync="highlight" :labels="siteLabels"></Legend>-->
        <div v-for="set in sets1" class="col-lg-4 col-md-12 col-sm-12 cardContainer">
          <div class="title"><span>{{$t(set)}}</span></div>
          <v-card>
          <BarChart style="width:100%" :colors="colors"  :data="getData(set)" :category="category(set)" :highlight="highlight"  :labels="siteLabels" autoresize></BarChart>
          </v-card>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import BarChart from "@/components/barChart";
import HomeTextTile from "@/components/HomeTextTile";
import Const from "@/const";
import Legend from "@/components/legend";
import GeneralApi from "@/api/GeneralApi";
import SiteApi from '@/api/SiteApi';
import Gauge from "@/components/Gauge";
import LineChart from "../components/lineChart";

const mockData = [
  ['category','101','102','103','104','105','106', 'total'],
  ['',10, 6, 4, 5, 7, 3,25 ]]

export default {
  name: "Home",
  components: {LineChart, BarChart, Legend, Gauge, HomeTextTile},
  methods:{
    getSummary: async function(){
      let res = await GeneralApi.summary();
      this.loadData(res.data);
    },
    loadConn: function(connections) {
      // Loading active connections
      let sites = {
        total:{
          en: 'total',
          fr: 'tous'
        }
      };
      connections.forEach(connect=>{
        sites[connect.uid] = connect.names;
      })

      this.siteLabels =  sites;
    },
    loadData: function(data) {
      this.summaries = {
        covid_cases: data.covid_cases,
        death:data.death,
        ventilator:data.ventilator,
        icu:data.icu
      };
      this.legendSites = data.sites;
    },
    getData: function(set) {
      return this.summaries[set] ? this.summaries[set][1] : [];
    },
    category: function(set){
      const key = set ? set : Object.keys(this.summaries)[0];
      return this.summaries[key] ? this.summaries[key][0] : [];
    }
  },
  async created() {
    let res = await SiteApi.get();
    this.loadConn(res.data.connections);

    this.getSummary();
    },
  data() {
    return {
      sets1:['covid_cases','death','ventilator'],
      sets2:['death','icu'],
      lineCharts: [{titleKey: "home_positive_rate_per_site" },{titleKey: "home_new_case_per_site"},{titleKey: "home_hospitalisation_rate"}],
      colors: Const.colors,
      summaries: {},
      legendSites: [],
      siteLabels:{},
      highlight: null,
      tiles:{patientGroup:{rate: 12.5,total:422000}, dailyCase:{total:145,average:135,rt:0.84} ,dailyDeath:{total:11,average:12,rt:0.4}},
      totalOccupation: 60
    }}
}
</script>

<style scoped>

</style>
