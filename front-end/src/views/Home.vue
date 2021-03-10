<template>
  <div class="mainContainer">
     <v-container>
      <div class="row">
        <div class="col-lg-4 col-md-4">
          <HomeTextTile :txTitle="'Patiens'" :txBottom="'Moy'" :data="800000" > </HomeTextTile>
        </div>
        <div class="col-lg-4 col-md-4">
           <HomeTextTile :txTitle="'nouveau cas'" :txBottom="'Moy'" :data="550" > </HomeTextTile>
        </div>
        <div class="col-lg-4 col-md-4">
            <HomeTextTile :txTitle="'décès'" :txBottom="'Moy'" :data="18" > </HomeTextTile>
        </div>
      </div>
      <div class="row">
        <Legend class="col-12 row" v-bind:colors="colors" :sites="category()" :direction="'horizontal'" :highlight.sync="highlight" :labels="siteLabels"></Legend>
        <div v-for="set in sets" class="col-lg-6 col-md-12 col-sm-12">
          <BarChart style="height: 30vh" :colors="colors"  :data="getData(set)" :category="category(set)" :title="set" :highlight="highlight"  :labels="siteLabels" autoresize></BarChart>
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

const mockData = [
  ['category','101','102','103','104','105','106', 'total'],
  ['',10, 6, 4, 5, 7, 3,25 ]]

export default {
  name: "Home",
  components: {BarChart, Legend, HomeTextTile},
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
    let res = await SiteApi.get()
        this.loadConn(res.data.connections);

    this.getSummary();
    },
  data() {
    return {
      sets:['covid_cases','death','ventilator','icu'],
      colors: Const.colors,
      summaries: {},
      legendSites: [],
      siteLabels:{},
      highlight: null
    }}
}
</script>

<style scoped>

</style>
