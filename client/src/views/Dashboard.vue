<template>
  <v-container class="mainContainer">
    <div class="row">
      <div class="col-lg-6 col-md-12 col-sm-12">
        <plotChart style="width: 100%"></plotChart>
      </div>

      <div class="col-lg-6 col-md-12 col-sm-12">
        <scatterChart style="width: 100%"></scatterChart>
      </div>

      <div class="col-lg-6 col-md-12 col-sm-12">

      </div>

      <div class="col-lg-6 col-md-12 col-sm-12">
        <BarChart style="width: 100%"></BarChart>
      </div>

    </div>

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
