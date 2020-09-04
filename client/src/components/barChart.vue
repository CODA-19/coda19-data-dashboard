<template>
  <v-chart :options="option"/>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/scatter';
import "echarts";

var colors = ['lightblue','blue','lightgreen', 'green', 'black'];
var data = [
  ['age', 'CHUM', 'MUHC', 'MUHQ', 'JGH'],
  ['0 to 4yrs', 6, 4, 5, 7, ],
  ['5 to 19 yrs', 5, 7, 6, 7],
  ['20 to 49 yrs', 15, 14, 13, 16],
  ['50 to 64 yrs', 26, 28, 25, 23],
  ['65 and up', 34, 29, 31, 36]
]

export default {
  name: "BarChart",
  components: {
    'v-chart': ECharts
  },
  created(){
    this.prepOption()
  },
  methods:{
    prepOption(){
      this.option = {
        title:{
          text:'Age Groups',
          left: 'center',
          bottom: '0'
        },
        tooltip: {},
        toolbox:{
          show:true,
          feature:{
            restore:{
              show:true,
              title:"Restore"
            },
            saveAsImage:{
              show:true,
              title:"Save Image"
            }
          }
        },
        dataset: {
          source: data
        },
        color: colors,
        xAxis: {type: 'category'},
        yAxis: {},
        series: [
          {type: 'bar'},
          {type: 'bar'},
          {type: 'bar'},
          {type: 'bar'}
        ]
      };
    }
  }
}
</script>

<style scoped>

</style>
