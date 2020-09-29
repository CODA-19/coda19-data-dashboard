<template>
  <v-chart ref="plotChart" :options="option"/>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/scatter';
import "echarts";

export default {
  components: {
    'v-chart': ECharts
  },
  watch:{
  'highlight':function(newVal, oldVal){
    let dataIndex = this.sites.indexOf(newVal),
        oldIndex = this.sites.indexOf(oldVal);
    const plotChart = this.$refs.plotChart;
    plotChart.dispatchAction({
      type: 'downplay',
      seriesIndex: [0,1,2,3,4,5],
      oldIndex
    })
    plotChart.dispatchAction({
      type: 'highlight',
      seriesIndex: [0,1,2,3,4,5],
      dataIndex
    })
  }
  },
  computed:{
    option(){
      let that = this,
          data = this.data;
      var option = {
        tooltip: {
          position: 'top',
          formatter: (params) => {
            if(params.value.length === 1)
              return this.$t('meanTxt')+': '+params.value[0] ;
            else return params.value[1]+': '+params.value[0]
          }
        },
        title: [{
          text: 'Summary',
          top: 'top',
          left: 'center',
          show: false
        }],
        legend:{},
        singleAxis: [],
        name:'Summary',
        nameLocation:'center',
        series: [],
        toolbox:{
          show:true,
          feature:{
            saveAsImage:{
              show:true,
              title:this.$t("saveImgTxt")
            }
          }
        },
      };
      data.categories.forEach((cat, idx)=>{
        option.title.push({
          textBase: 'middle',
          top: (idx*80/6+12)+'%',//(idx + 0.6) * 100 / 6 + '%',
          text: this.$t(cat),
          left: 130,
          textStyle:{
            fontSize: 14
          },
          textAlign: 'right'
        });
        option.singleAxis.push({
          left: 150,
          type: data.types[idx],
          align: 'left',
          axisTick:{
            show: false
          },
          minInterval:data.ranges[idx][1],
          boundaryGap: false,
          min: data.ranges[idx][0],
          max: data.ranges[idx][1],
          top: (idx*80/6+12)+'%',//(idx * 100 / 6 + 5) + '%',
          height: 20,
          axisLabel: {
            interval: 2
          }
        });
        option.series.push({
          singleAxisIndex: idx,
          coordinateSystem: 'singleAxis',
          type: 'scatter',
          data: [],
          symbolSize: 20,
          opacity: 50
        });
      });
      data.data.forEach((dataItems, i)=> {
        dataItems.forEach((dataItem, j)=>{
          option.series[i].data.push({
            name: that.sites[i],
            value:[dataItem[0], dataItem[1]],
            itemStyle:{color:that.colors[j]}
          });
        })
      });
      data.means.forEach((cat, i)=>{
        option.series[i].data.push({
          name: 'Mean',
          value:[cat],
          itemStyle:{
            color: 'black',
            opacity: 100
          },
          symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAeHaAAHh2gFb9nS3AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAAxQTFRF////AwEEAwEEAwEE0UKdTQAAAAN0Uk5TAIiY9/jN6wAAASRJREFUeNrtzjERADAIBLDf8O+wTloBbD2OKVGQ5Evd5mSTgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAXOABprmsLPmK90AAAAAASUVORK5CYII="

        })
      })

      return option;
    }
  },
  props:{
    colors:{
      type:Array
    },
    sites:{
      type: Array
    },
    data:{
      type: Object
    },
    highlight:{
      type: String
    }
  }
}
</script>

<style scoped>

</style>
