<template>
  <v-chart class="chart" ref="MultiLineChart" :option="option"/>
</template>

<script>
import { dataTool, use } from "echarts/core";
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

export default {
  name: "MultiLineChart",
  components: { VChart },
  props: {
    data: Array,
    dataToPlot: Object
  },
  data(){
      return{
          sites : [],

      }
  },
  methods: {
    onResize() { this.$refs.MultiLineChart.resize(); },
    datasetTransform: function() {
        let filters = [];
        if(this.sites.length == 0){
            this.data.forEach(el => {
                if(!this.sites.includes(el.siteCode)){
                    this.sites.push(el.siteCode);
                } 
            });
        }

        filters.push({
            id: 'dataset_raw',
            source: this.data
        })
        this.sites.forEach(site =>{
            const filter = {
                id: `dataset_for_site_${site}`,
                fromDatasetId: 'dataset_raw',
                transform: [
                    {
                    type: 'filter',
                    config: { dimension: 'siteCode', value: site },
                    },
                    {
                    type: 'sort',
                    config: { dimension: 'currentRound', order: 'asc' }
                    }
                ]
            };
            filters.push(filter)
        })
        return filters;
    },
    datasetSeries: function() {
        let series = [];
        if(this.sites.length == 0){
            this.data.forEach(el => {
                if(!this.sites.includes(el.siteCode)){
                    this.sites.push(el.siteCode);
                } 
            });
        }
        this.sites.forEach(site =>{
            const serie = {
                type: 'line',
                //smooth: true,
                name: site,
                datasetId: `dataset_for_site_${site}`,
                showSymbol: true,
                encode: {
                    x: 'currentRound',
                    y: this.dataToPlot.value,
                    itemName: 'rounds'
                }
            };
            series.push(serie);
        })
        return series;
    },
  },
  mounted() { window.addEventListener("resize", this.onResize); },
  beforeDestroy() { window.removeEventListener('resize', this.onResize); },
  computed:{
    option() {
      return {
        dataset: this.datasetTransform(),
        series: this.datasetSeries(),
        legend: {data:this.sites},
        tooltip: {trigger: 'axis'},
        grid: { bottom: '3%', containLabel: true },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: {
          type: 'category',
          boundaryGap: false,
        },
        yAxis: {
            type: 'value',
        },
      };
    }
  }
}
</script>

<style scoped>
</style>
