<template>
  <v-chart class="chart" ref="MultiLineChart" :option="option"/>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {LineChart} from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent
} from "echarts/components";
import VChart from "vue-echarts";
import { zip } from "underscore";

import TooltipLineFormatter from "./TooltipLineFormatter.vue";

use([
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  LineChart
]);

import Vue from "vue";

const hasCI = (dataSeries) => ["ll", "ul"].every(el => Object.keys(dataSeries).includes(el));

export default {
  name: "MultiLineChart",
  components: { VChart },
  props: {
    data: Array,
    dates: Array
  },
  methods: {
    onResize() { this.$refs.MultiLineChart.resize(); },
    getLineStyle(dataSeries) {
      switch (dataSeries.type) {
        case 'normal': return 'solid';
        case 'predic': return 'dashed';
        default: console.error(`unknown data series (${dataSeries.type}) to style`);
      }
    },
    toCIStyle(dataSeries) {
      if (!hasCI(dataSeries))
        return [];

      const name = dataSeries.name;
      return [{
        name: name,
        type: 'line',
        data: dataSeries.ll,
        lineStyle: { opacity: 0 },
        stack: name + 'ci',
        symbol: 'none'
      }, {
        name: name,
        type: 'line',
        data: zip(dataSeries.ll, dataSeries.ul).map(arr => arr[1] - arr[0]),
        lineStyle: { opacity: 0 },
        areaStyle: { color: '#ccc'},
        stack: name + 'ci',
        symbol: 'none'
      }];
    },
    toSeriesStyle(data) {
      return [{
        name: data.name,
        type: 'line',
        lineStyle: { type: this.getLineStyle(data) },
        stack: '',
        smooth: true,
        data: data.est
      }, ...this.toCIStyle(data)];
    },
    getTooltipFormatter() {
      let ComponentClass = Vue.extend(TooltipLineFormatter);
      return (series) => {
        let instance = new ComponentClass({
          propsData: {
            date: series[0].name,
            data: this.data,
            series: series
          }
        });
        instance.$mount();
        return instance.$el;
      };
    }
  },
  mounted() { window.addEventListener("resize", this.onResize); },
  beforeDestroy() { window.removeEventListener('resize', this.onResize); },
  computed:{
    option() {
      return {
        tooltip: {
          trigger: 'axis', formatter: this.getTooltipFormatter(),
        },
        legend: { data: this.data ? this.data.map(el => el.name): [] },
        grid: { bottom: '3%', containLabel: true },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dates ? this.dates.map(dateTime => dateTime.toFormat('LLL dd')) : [] // Luxon Format
        },
        yAxis: {
          type: 'value'
        },
        series: this.data ? this.data.map(this.toSeriesStyle).flat() : []
      };
    }
  }
}
</script>

<style scoped>
</style>
