<template>
  <div class="mainContainer">
    <v-row id="backBtn">
      <a @click="newSearch"><b-button variant="outline-dark"><b-icon icon="arrow-left-circle" aria-hidden="true"></b-icon>   New Search</b-button></a>
    </v-row>
  <v-container >
    <v-row>
    <div class="col-lg-6 col-md-12 col-sm-12">
      <v-row>
        <h3>Summary</h3>
      </v-row>
      <v-row class="chartPanel">
        <plotChart style="height: 40vh" :colors="colors" :sites="sites" :data="summary" ></plotChart>
      </v-row>
      <v-row style="flex-direction: column">
        <h3>Legend</h3>
        <Legend :colors="colors" :sites="sites"></Legend>
      </v-row>
      <v-row>

      </v-row>

    </div>

      <div class="col-lg-6 col-md-12 col-sm-12">
        <v-row class="chartPanel">
          <h3>Key Variables</h3>
        </v-row>

      <v-row class="chartPanel">
        <scatterChart style="height: 40vh" v-bind:colors="colors"  v-if="lengthOfStay" v-bind:data="lengthOfStay"></scatterChart>
      </v-row>
      <v-row class="chartPanel">
        <BarChart style="height: 40vh" v-bind:colors="colors" v-if="ageGroups" v-bind:data="ageGroups"></BarChart>
      </v-row>

    </div>
    </v-row>

  </v-container>
  </div>

</template>

<script>
import PlotChart from "@/components/plotChart";
import ScatterChart from "@/components/scatterChart";
import BarChart from "@/components/barChart";
import Legend from "@/components/legend";
import { bus } from "@/main";

export default {
  name: "Dashboard",
  components: {PlotChart, ScatterChart, BarChart, Legend},
  props:{
    summary: {
      type: Object
    },
    lengthOfStay:{
      type: Array
    },
    ageGroups:{
      type: Array
    }
  },
  methods:{
    newSearch() {
      bus.$emit('newSearch')
    }
  },
  data(){
    return {
      colors:['lightblue','blue','lightgreen', 'green', 'black'],
      sites: ['CHUM', 'MUHC', 'MUHQ', 'JGH', 'Mean']
    }
  }
}
</script>

<style scoped>

</style>
