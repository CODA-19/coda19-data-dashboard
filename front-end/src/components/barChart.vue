<template>
  <v-chart ref="barChart" :options="option"/>
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
    },
    title:{
      type: String
    },
    highlight:{
      type: String
    }
  },
  computed:{
    option(){
      let numBar = this.data[0].length - 1,
          seriesOpt = {
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            label:{
              show: true
            }
           },
          seriesTypes = Array(numBar).fill(
              seriesOpt) ;

      var data = [];
      this.data.forEach((group,i)=>{
        if(i===0)
          return data.push(group);
        var new_group = [];
        new_group[0] = this.$t(group[0]);
        new_group = new_group.concat(group.slice(1));
        data.push(new_group);
      });

      var option = {
        title:{
          text: this.$t(this.title),
          left: 'center',
          bottom: '0'
        },
        tooltip: {},
        toolbox:{
          show:true,
          feature:{
            saveAsImage:{
              show:true,
              title:this.$t("saveImgTxt")
            },
            // magicType:{show: true, type: ['stack']}
          }
        },
        dataset: {
          source: data
        },
        color: this.colors,
        xAxis: {type: 'category'},
        yAxis: {type: 'value',
          axisLine: {
            show: true
          }},
        series: seriesTypes
      };

      return option;
    }
  },
  watch:{
    'highlight':function(newVal, oldVal){
      let sites = this.data[0].slice(1,this.data[0].length);
      let dataIndex = sites.indexOf(newVal),
          oldIndex = sites.indexOf(oldVal);
      console.log(dataIndex+", "+oldIndex)
      const barChart = this.$refs.barChart;
      barChart.dispatchAction({
        type: 'downplay',
        seriesIndex: oldIndex
      })
      barChart.dispatchAction({
        type: 'highlight',
        seriesIndex: dataIndex
      })
    }
  },
}
</script>

<style scoped>

</style>
