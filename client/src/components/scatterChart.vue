<template>
  <v-chart :options="option"/>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/scatter';
import "echarts";

var data = [
    [[8, 'CHUM', 8]],
    [[12, "MUHC", 12]],
    [[17,  'MUHQ', 17]],
    [[15, 'JGH', 15]],
    [[13, 'Mean', 13]]
];

export default {
  components: {
    'v-chart': ECharts
  },
  props:{
    colors:{
      type: Array
    }
  },
  created(){
    this.setOption()
  },
  methods:{
    setOption(){
      this.option = {
        xAxis: {
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'category',

          inverse: true
        },
        title: {
          text: 'Length of Stay',
          left: 'center',
          bottom: '5'
        },
        tooltip:{
          formatter: function (params) {
           return params.value[1]+': '+params.value[0]
          }
        },
        toolbox:{
          show:true,
          feature:{
            saveAsImage:{
              show:true,
              title:"Save Image"
            }
          }
        },
        series: []
      };

      data.forEach((siteData,i)=>{
        this.option.series.push({
          name: siteData[0][1],
          data: siteData,
          itemStyle:{color:this.colors[i]},
          type: 'scatter',
          symbolSize: 20
        })
      });
    }
  }
}
</script>
<style scoped>

</style>
