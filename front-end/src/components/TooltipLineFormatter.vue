<template>
  <div>
    <span>{{ date }}</span> <br>
    <div style="display: flex; flex-direction: column;">
      <div v-for="s in activeSeries" :key="s.name" style="display: flex; flex-direction: row;">
        <div v-html="getLineMarker(s.name)"></div>
        <div style="flex: 1;">
          {{s.name}}
          <sup v-if="s.predicted">pred</sup>
        </div>
        <div style="padding-left: 10px;">
          {{s.value}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "TooltipLineFormatter",
  props: {
    date: String,
    data: Array,
    series: Array
  },
  methods: {
    /** Gets the legend line marker for the category with this name */
    getLineMarker(name) { return this.series.filter(s => s.seriesName === name)[0].marker; },
    /**
     * Tries to guess if a data point comes from a prediction.
     *
     * @param ptIdx Index of the date in the tooltip
     * @param pt Point being considered (with name, and value)
     */
    isPrediction(ptIdx, pt) {
      const [name] = pt;
      const ss = this.data.filter(d => d.name === name);
      if (ss.length === 1 /* Simple line */ || ss.length === 3 /* with CI */)
        return false;
      // Confirms by checking the data series with data at that index is marked as a prediction.
      return ss.filter(s => s.est[ptIdx])[0].type === "predic";
    }
  },
  computed: {
    activeSeries() {
      let map = new Map();
      for (let s of this.series)
        map.set(s.seriesName, Math.max(s.value || -1, map.get(s.seriesName) || -1));

      return Array.from(map.entries())
          .map(e => ({
            name: e[0],
            value: e[1],
            predicted: this.isPrediction(this.series[0].dataIndex, e)}));
    }
  }
}
</script>

<style scoped>
</style>
