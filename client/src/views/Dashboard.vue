<template>
  <v-container class="mainContainer">
    <v-row>
      <plot-chart style="height: 400px"></plot-chart>
    </v-row>

  </v-container>

</template>

<script>
import PlotChart from "@/components/plotChart";

export default {
  name: "Dashboard",
  components: {PlotChart}
}
</script>

<style scoped>

</style>
