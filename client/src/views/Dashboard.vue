<template>
  <div class="mainContainer">
    <v-row id="backBtn">
      <a @click="newSearch"><b-button variant="outline-dark"><b-icon icon="arrow-left-circle" aria-hidden="true"></b-icon>   {{$t('newSearchTxt')}}</b-button></a>
    </v-row>
  <v-container >
    <v-row>
    <div class="col-lg-6 col-md-12 col-sm-12">
      <v-row>
        <h3>{{$t('summaryTxt')}}</h3>
      </v-row>
      <v-row class="chartPanel">
        <plotChart style="height: 40vh" :colors="colors" :sites="sites" :data="summary" :highlight="highlight" autoresize></plotChart>
      </v-row>
      <v-row style="flex-direction: column">
        <h3>{{$t('legendTxt')}}</h3>
        <Legend :colors="legendColors" :sites="legendSites" :highlight.sync="highlight"></Legend>
      </v-row>
      <v-row>

      </v-row>

    </div>

      <div class="col-lg-6 col-md-12 col-sm-12">
        <v-row class="chartPanel">
          <h3>{{$t("keyVariablesTxt")}}</h3>
        </v-row>

      <v-row class="chartPanel">
        <scatterChart style="height: 40vh" v-bind:colors="colors"  v-if="lengthOfStay" v-bind:data="lengthOfStay" autoresize></scatterChart>
      </v-row>
      <v-row class="chartPanel">
        <BarChart style="height: 40vh" v-bind:colors="colors" v-if="ageGroups" v-bind:data="ageGroups" autoresize></BarChart>
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

let colors = [
  '#C25C5C','#EEAA7C','#DCD2A2','#4C625C','#2F2D3D',
  '#409469','#D0E346','#909773', '#840B3B'
];

export default {
  name: "Dashboard",
  components: {PlotChart, ScatterChart, BarChart, Legend},
  props:{
    summary: {
      type: Object
    },
    sites:{
      type: Array
    },
    lengthOfStay:{
      type: Array
    },
    ageGroups:{
      type: Array
    }
  },
  created(){
    this.getLegendColor();
    this.getLegendSites();
  },
  methods:{
    newSearch() {
      bus.$emit('newSearch')
    },
    getLegendColor(){
      this.legendColors = colors.slice(0, this.sites.length);
      this.legendColors.push('black')
    },
    getLegendSites(){
      this.legendSites = this.sites;
      this.legendSites.push('Mean');
    }
  },
  data(){
    return {
      colors: colors,
      legendColors: this.legendColors,
      legendSites: this.legendSites,
      highlight: null
    }
  }
}
</script>

<style scoped>

</style>
