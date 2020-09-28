<template>
  <v-chart :options="option"/>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/scatter';
import "echarts";

// var data = [
//   ['age', 'CHUM', 'MUHC', 'MUHQ', 'JGH'],
//   ['0 to 4yrs', 6, 4, 5, 7, ],
//   ['5 to 19 yrs', 5, 7, 6, 7],
//   ['20 to 49 yrs', 15, 14, 13, 16],
//   ['50 to 64 yrs', 26, 28, 25, 23],
//   ['65 and up', 34, 29, 31, 36]
// ]

export default {
  name: "BarChart",
  components: {
    'v-chart': ECharts
  },
  props:{
    colors:{
      type:Array
    },
    data:{
      type: Array
    }
  },
  computed:{
    option(){
      let numBar = this.data[0].length - 1,
          seriesTypes = Array(numBar).fill({type: 'bar'}) ;
      var option = {
        title:{
          text:this.$t("age_groups"),
          left: 'center',
          bottom: '0'
        },
        tooltip: {},
        toolbox:{
          show:true,
          feature:{
            saveAsImage:{
              show:true,
              title:"Save Image"
            }
          }
        },
        dataset: {
          source: this.data
        },
        color: this.colors,
        xAxis: {type: 'category'},
        yAxis: {},
        series: seriesTypes
      };

      return option;
    }
  }
}
</script>

<style scoped>

</style>
