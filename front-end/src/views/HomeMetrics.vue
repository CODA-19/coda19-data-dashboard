<template>
  <v-container class="mainContainer">
    <v-row>
      <v-col cols="4">
        <h1>/home Metrics</h1>
      </v-col>
      <v-col cols="2">
        <v-btn @click="makeRequest()">Launch</v-btn>
      </v-col>
      <v-col cols="4">Total Time : {{ totalTimeInMs }} ms</v-col>
    </v-row>
    <ul id="measured-queries">
      <TestQuery v-for="query in panelQueries" :key="query.id" :query="query" :launch="launch" v-on:queryComplete="onQueryCompleted"></TestQuery>
    </ul>
  </v-container>
</template>

<script>

import TestQuery from "../components/TestQuery";

export default {
  name: "HomeMetrics",
  components: {TestQuery},
  data() {
    return {
      launch: false,
      totalTime: NaN,
      panelQueries: [
        { id: 1, name: 'Panel 1', endpoint: '/home/p1' },
        { id: 2, name: 'Panel 2', endpoint: '/home/p2' },
        { id: 3, name: 'Panel 3', endpoint: '/home/p3' },
        { id: 4, name: 'Panel 4', endpoint: '/home/p4' },
        { id: 5, name: 'Panel 5', endpoint: '/home/p5' },
        { id: 6, name: 'Panel 6', endpoint: '/home/p6' },
        { id: 7, name: 'Panel 7', endpoint: '/home/p7' },
        { id: 8, name: 'Panel 8', endpoint: '/home/p8' },
        { id: 9, name: 'Panel 9', endpoint: '/home/p9' },
        { id: 10, name: 'Panel 10', endpoint: '/home/p10' },
        { id: 11, name: 'Panel 11', endpoint: '/home/p11' },
        { id: 12, name: 'Panel 12', endpoint: '/home/p12' }
      ]
    };
  },
  methods: {
    makeRequest() {
      this.launch = true;
    },
    onQueryCompleted(timeMs) {
      if (Number.isNaN(this.totalTime))
        this.totalTime = 0;
      this.totalTime += timeMs;
      console.log('logging query completed.');
    }
  },
  computed: {
    totalTimeInMs() {
      return Number.isNaN(this.totalTime) ? "N/A" : this.totalTime.toFixed(0);
    }
  }
}


</script>
