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
        grid:{
          containLabel: true,
          left: 0
        },
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
        var data = [], rangeData = [];
        data[0] = siteData[0][0]
        data[1] = siteData[0][2] === "Mean" ? this.$t('meanTxt') : siteData[0][2];

        rangeData[0] = siteData[0][1]
        rangeData[1] = siteData[0][2] === "Mean" ? this.$t('meanTxt') : siteData[0][1];

        option.series.push({
          name: siteData[0][2] === "Mean" ? this.$t('meanTxt') : siteData[0][2],
          data: [data],
          itemStyle:{color:siteData[0][2]==="Mean"?"black":this.colors[i]},
          type: 'scatter',
          symbolSize: 20
        }),
            rangeData = [
              {
                value:[rangeData[0][0], data[1]],
                symbol: 'line',
                symbolRotate: 90,
                itemStyle: {
                  color: siteData[0][2]==="Mean"?"black":this.colors[i],
                },
                symbolSize: 10,
              },
              {
                value:[rangeData[0][1], data[1]],
                symbol: 'line',
                symbolRotate: 90,
                itemStyle: {
                  color: siteData[0][2]==="Mean"?"black":this.colors[i],
                },
                symbolSize: 10,
              }
            ],
            option.series.push({
              name: siteData[0][2] === "Mean" ? this.$t('meanTxt') : siteData[0][2],
              data: rangeData,
              lineStyle:{color:siteData[0][2]==="Mean"?"black":this.colors[i]},
              type:'line',
              symbolSize: 10
            })

      });
      return option
    }
  }
}
</script>
<style scoped>

</style>
