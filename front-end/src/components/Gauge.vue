<template>
  <v-chart class='gauge' ref="gauge" :options="option"/>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/scatter';
import "echarts";

export default {
  name: "Gauge",
  components: {
    'v-chart': ECharts
  },
  props: {

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
            show: true
          },
          detail: {
            valueAnimation: true,
            fontSize: 30,
            offsetCenter: [0, '-120%'],
            formatter: "{value}%"
          },
          data: [{
            value: 70
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
