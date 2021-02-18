<template>
  <div class="mainContainer">
<!--    <v-row id="backBtn">-->
<!--      <a @click="newSearch"><b-button variant="outline-dark"><b-icon icon="arrow-left-circle" aria-hidden="true"></b-icon>   {{$t('newSearchTxt')}}</b-button></a>-->
<!--    </v-row>-->
  <v-container >
    <v-row>
    <div class="col-lg-6 col-md-12 col-sm-12">
      <v-row>
        <h3>{{$t('summaryTxt')}}</h3>
      </v-row>
      <v-row class="chartPanel">
        <plotChart style="height: 40vh" :colors="colors" :sites="sites" :data="summary" :highlight="highlight" autoresize></plotChart>
      </v-row>
    </div>
      <div class="col-lg-6 col-md-12 col-sm-12">
        <v-row style="flex-direction: column">
          <h3>{{$t('legendTxt')}}</h3>
          <Legend :colors="legendColors" :sites="legendSites" :highlight.sync="highlight"></Legend>
        </v-row>
      </div>
    </v-row>
    <v-row>
      <div class="col-lg-12 col-md-12 col-sm-12" v-if="lengthOfStay || ageGroups">
        <v-row class="chartPanel">
          <h3>{{$t("keyVariablesTxt")}}</h3>
        </v-row>
      </div>

      <v-row>
        <div class="col-lg-6 col-md-12 col-sm-12 chartPanel" v-if="lengthOfStay" >
        <scatterChart style="height: 40vh" v-bind:colors="colors"  v-bind:data="lengthOfStay" autoresize></scatterChart>
      </div>
        <div class="col-lg-6 col-md-12 col-sm-12 chartPanel" v-if="ageGroups">
        <BarChart style="height: 40vh" v-bind:colors="colors"  v-bind:data="ageGroups" v-bind:title="'age_groups'" autoresize></BarChart>
        </div>
      </v-row>


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
import Const from "@/const";

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
  computed:{
    legendSites(){
      var legendSites = this.sites;
      legendSites.push('Mean');
      return legendSites;
    },
    legendColors(){
      var legendColors = Const.colors.slice(0, this.sites.length-1);
      legendColors.push('black');
      return legendColors;
    }
  },
  methods:{
    newSearch() {
      bus.$emit('newSearch')
    }
  },
  data(){
    return {
      colors: Const.colors,
      highlight: null
    }
  }
}
</script>

<style scoped>

</style>
