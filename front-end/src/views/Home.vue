<template>
  <div class="mainContainer">
    <v-container>
      <div class="row">
        <Legend class="col-12 row" v-bind:colors="colors" :sites="legendSites" :direction="'horizontal'" :highlight.sync="highlight"></Legend>
        <div v-for="set in sets" class="col-lg-6 col-md-12 col-sm-12">
          <BarChart v-if="summaries[set]" style="height: 30vh" v-bind:colors="colors"  v-bind:data="summaries[set]" v-bind:title="set" :highlight="highlight" autoresize></BarChart>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import BarChart from "@/components/barChart";
import Const from "@/const";
import Legend from "@/components/legend";
import GeneralApi from "@/api/GeneralApi";

const mockData = [
  ['category','101','102','103','104','105','106', 'total'],
  ['',10, 6, 4, 5, 7, 3,25 ]]

export default {
  name: "Home",
  components: {BarChart, Legend},
  methods:{
    getSummary: async function() {
      await GeneralApi.summary()
          .then(res => res.data)
          .then(data => {
            this.summaries = {
              covid_cases: data.covid_cases,
              death:data.death,
              ventilator:data.ventilator,
              icu:data.icu
            };
            this.legendSites = data.sites

      });
    }

  },
  async created() {
    await this.getSummary()
    },
  data() {
    return {
      sets:['covid_cases','death','ventilator','icu'],
      colors: Const.colors,
      summaries: {},
      highlight: null
    }}
}
</script>

<style scoped>

</style>
