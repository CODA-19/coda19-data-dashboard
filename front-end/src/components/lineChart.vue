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

use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

// const data = [
//       [120, 132, 101, 134, 90, 230, 210],
//       [320, 332, 301, 334, 390, 330, 320],
//       [150, 232, 201, 154, 190, 330, 410],
//       [220, 182, 191, 234, 290, 330, 310],
//       [820, 932, 901, 934, 1290, 1330, 1320]
// ],
//     categories = ['101', '102', '103', '104', '105'],
//     dates = ['2021-02-02','2021-02-03', '2021-02-04', '2021-02-05', '2021-02-06', '2021-02-07'];

export default {
  name: "lineChart",
  components: { VChart },
  props:{
    title: String,
    data: Array,
    dates: Array,
    categories: Array
  },
  created() {
    window.addEventListener("resize", ()=>{
      const lineChart = this.$refs.lineChart;
      lineChart.resize();
    });
  },
  computed:{
    option() {
      if(!this.data){
        var option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
          },
          yAxis: {
            type: 'value'
          }
        };
      }
      var option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.categories
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dates
        },
        yAxis: {
          type: 'value'
        }
      };
      let seriesOpt = [];
      this.categories.forEach((cat,i)=>{
        seriesOpt.push({
          name: cat,
          type: 'line',
          stack: '',
          data: this.data[i]
        })
      });
      option.series = seriesOpt;

      return option;
    }
  }
}
</script>

<style scoped>

</style>
