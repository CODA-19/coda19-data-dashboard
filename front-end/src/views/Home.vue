<template>
  <div class="mainContainer">
    <v-container>
      <div class="row">
        <Legend class="col-12 row" v-bind:colors="colors" :sites="legendSites" :direction="'horizontal'"></Legend>
        <div v-for="set in sets" class="col-lg-6 col-md-12 col-sm-12">
          <BarChart style="height: 30vh" v-bind:colors="colors"  v-bind:data="data[set]" v-bind:title="set" autoresize></BarChart>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import BarChart from "@/components/barChart";
import Const from "@/const";
import Legend from "@/components/legend";

const mockData = [
  ['category','101','102','103','104','105','106', 'total'],
  ['',10, 6, 4, 5, 7, 3,25 ]]

export default {
  name: "Home",
  components: {BarChart, Legend},
  async created() {
    this.data = {
      covid_cases: mockData,
      death:mockData,
      ventilator:mockData,
      icu:mockData
    }
    },
  computed:{
    legendSites(){
      var legendSites = mockData[0].slice(1,mockData[0].length);
      if(legendSites.length<10 && legendSites.length >5){
        while (legendSites.length < 11) {
          legendSites.push('');
        }
      }
      return legendSites;
    },
  },
  data() {
    return {
      sets:['covid_cases','death','ventilator','icu'],
      colors: Const.colors,
      data:[],
      highlight: null
    }}
}
</script>

<style scoped>

</style>
