<template>
  <v-container class="mainContainer">
    <plot-chart></plot-chart>
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
