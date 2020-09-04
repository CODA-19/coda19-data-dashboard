<template>
  <v-container class="mainContainer">
    <v-row>
    <div class="col-lg-6 col-md-12 col-sm-12">
      <v-row>
        <h3>Summary</h3>
      </v-row>
      <v-row class="chartPanel">
        <plotChart style="height: 40vh"></plotChart>
      </v-row>
      <v-row>
        <h3>Legend</h3>
      </v-row>
      <v-row>

      </v-row>

    </div>

      <div class="col-lg-6 col-md-12 col-sm-12">
        <v-row class="chartPanel">
          <h3>Key Variables</h3>
        </v-row>

      <v-row class="chartPanel">
        <scatterChart style="height: 40vh"></scatterChart>
      </v-row>
      <v-row class="chartPanel">
        <BarChart style="height: 40vh"></BarChart>
      </v-row>

    </div>
    </v-row>

  </v-container>

</template>

<script>
import PlotChart from "@/components/plotChart";
import ScatterChart from "@/components/scatterChart";
import BarChart from "@/components/barChart";

export default {
  name: "Dashboard",
  components: {PlotChart, ScatterChart, BarChart}
}
</script>

<style scoped>

</style>
