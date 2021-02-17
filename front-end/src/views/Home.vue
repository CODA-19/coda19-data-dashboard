<template>
  <div class="mainContainer">
    <v-container>
      <div class="row">
        <div v-for="set in sets" class="col-lg-6 col-md-12 col-sm-12">
          <BarChart style="height: 30vh" v-bind:colors="colors"  v-bind:data="data[set]" autoresize></BarChart>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import BarChart from "@/components/barChart";
import Const from "@/const";

const mockData = [
  ['','102','103','104','105'],
  ['covid_cases', 6, 4, 5, 7 ]]

export default {
  name: "Home",
  components: {BarChart},
  async created() {
    this.data = {
      covid_cases: mockData,
      death:mockData,
      ventilator:mockData,
      icu:mockData
    }
    },
  data() {
    return {
      sets:['covid_cases','death','ventilator','icu'],
      colors: Const.colors,
      data:[]
    }}
}
</script>

<style scoped>

</style>
