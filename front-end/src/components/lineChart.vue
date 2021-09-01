<template>
  <v-chart class="chart" ref="lineChart" :option="option"/>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { uniq, contains } from "underscore";

use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

// Creates two null padded arrays, with data changing from one to the other at specified index. (-1 means never)
function splitSeries(dat, splitIdx) {
  const n = dat.length;
  let rhs = Array(n).fill(null);

  if (splitIdx === -1)
    return [dat];

  let lhs = Array(n).fill(null);
  for (let i = 0; i < n; i++) { // Instead of slice, this is a copy
    if (i < splitIdx) lhs[i] = dat[i];
    if (i === (splitIdx - 1)) rhs[i] = dat[i]; // Item switching is in both series.
    if (i >= splitIdx) rhs[i] = dat[i];
  }

  return [lhs, rhs];
}
const formatSeries = (series) => `
        <div style="display: flex; flex-direction: row;">
                <div>${series.marker}</div>
                <div style="flex: 1;">${series.seriesName}</div>
                <div style="padding-left: 10px;"><b>${series.value}</b></div>
        </div>`;
const isSeriesPresent = (series) => series.value !== undefined;
const tooltipFormatter = (datesOfPred) => (series) =>
    `${series[0].name} ${contains(datesOfPred, series[0].name)? '<i>prediction</i>' : ''} <br>
              <div style="display: flex; flex-direction: column;">
                  ${uniq(series.filter(isSeriesPresent).map(formatSeries)).join('')}
              </div>`;

export default {
  name: "lineChart",
  components: { VChart },
  props:{
    title: String,
    data: Array,
    dates: Array,
    categories: Array,
    prediction: String
  },
  created() {
    window.addEventListener("resize", ()=> {
      const chart = this.$refs.lineChart.resize();
      if (chart && chart.hasOwnProperty('resize'))  chart.resize();
    } );
  },
  computed:{
    option() {
      let option = {
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        legend: { data: this.categories },
        grid: {
          bottom: '3%',
          containLabel: true
        },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dates,
        },
        yAxis: { type: 'value' },
        series: []
      };

      if (this.categories === undefined) // When data not loaded/available
        return option;

      const startOfPredIdx = this.dates.indexOf(this.prediction);
      const datesOfPred = startOfPredIdx === -1 ? [] : this.dates.slice(startOfPredIdx);

      option.tooltip = {
        trigger: "axis",
        formatter: tooltipFormatter(datesOfPred)
      }

      option.series = this.categories.map((cat, i) =>
          splitSeries(this.data[i], startOfPredIdx).map((data, isPrediction) =>
              ({name: cat, type: 'line', lineStyle: { type: isPrediction ? 'dashed' : 'solid' }, stack: '', smooth: true, data: data}))).flat();

      return option;
    }
  }
}
</script>

<style scoped>
</style>
