<template>
  <v-chart :options="option"/>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/scatter';
import "echarts";

// var data = [
//     [[8, 'CHUM']],
//     [[12, "MUHC"]],
//     [[17,  'MUHQ']],
//     [[15, 'JGH']],
//     [[13, 'Mean']]
// ];
let that = this;
export default {
  components: {
    'v-chart': ECharts
  },
  props:{
    colors:{
      type: Array
    },
    data:{
      type: Array
    }
  },
  computed:{
    option(){
      var option = {
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
          text: this.$t('length_of_stay'),
          left: 'center',
          bottom: '5'
        },
        tooltip:{
          formatter: (params) => {
            var site = params.value[1] === "Mean" ? this.$t('meanTxt') : params.value[1];
            return site+': '+params.value[0]
          }
        },
        toolbox:{
          show:true,
          feature:{
            saveAsImage:{
              show:true,
              title:this.$t("saveImgTxt")
            }
          }
        },
        series: []
      };
      this.data.forEach((siteData,i)=>{
        var data = [];
        data[0] = siteData[0][0]
        data[1] = siteData[0][1] === "Mean" ? this.$t('meanTxt') : siteData[0][1];

        option.series.push({
          name: siteData[0][1] === "Mean" ? this.$t('meanTxt') : siteData[0][1],
          data: [data],
          itemStyle:{color:siteData[0][1]==="Mean"?"black":this.colors[i]},
          type: 'scatter',
          symbolSize: 20
        })
      });

      return option
    }
  }
}
</script>
<style scoped>

</style>
