<template>
  <v-chart class='chart' ref="gauge" :option="option"/>
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

export default {
  name: "Gauge",
  components: { VChart},
  props: {
    value: Number
  },
  created() {
    window.addEventListener("resize", ()=>{
      const gauge = this.$refs.gauge;
      if (gauge && gauge.hasOwnProperty('resize'))  gauge.resize();
    });
  },
  computed: {
    option(){
      const option = {
        series: [{
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          splitNumber: 5,
          radius: '80%',
          center:['50%','70%'],
          progress: {
            show: true,
            width: 15
          },
          axisLine: {
            lineStyle: {
              width: 15
            }
          },
          axisTick: {
            show: true,
            distance: 3,
            lineStyle: {
              width: 1,
              color: '#999'
            }
          },
          splitLine: {
            distance: 3,
            length: 10,
            lineStyle: {
              width: 1,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 18,
            color: '#999',
            fontSize: 14
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 18,
            itemStyle: {
              borderWidth: 10
            }
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 30,
            offsetCenter: [0, '-120%'],
            formatter: "{value}%"
          },
          data: [{
            value: this.value
          }]
        }]
      };

      return option;
    }
  }
}
</script>

<style scoped>
.gauge{
  margin: auto;
}
</style>
