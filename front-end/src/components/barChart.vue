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
    colors: Array,
    data: Array,
    category: Array,
    title: String,
    highlight: String,
    labels: Object,
    group: Array,
    horizontal: Boolean
  },
  computed:{
    option(){
      var option = {
        title:{
          show:false,
          text: '',
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
        color: this.colors,
        grid: {
          containLabel: true,
          left:10,
          bottom:20
        },
        xAxis: {type: 'category'},
        yAxis: {type: 'value',
          axisLine: {
            show: true
          }}
      };

      if(!this.data){
        return option;
      }


      var categories = this.category.map(cat=>{
        return this.labels[cat]?this.labels[cat][this.$i18n.locale] : cat
      })
      if(this.horizontal){
        option.yAxis=[{
          type:'category',
          data:categories,
          inverse: true
        }];

        option.xAxis= {type: 'value'}
      }
      else{
        option.xAxis=[{
          type:'category',
          data:categories
        }];

      }


      const seriesOpt = []
      if(this.group){
        this.data.forEach((serie,idx)=>{
          seriesOpt.push({
            type: 'bar',
            data:serie,
            name:this.group[idx],
            itemStyle: {
              color: () => {
                return this.colors[idx]
              }
            }
          })
        })
        option.series = seriesOpt;
        option.legend = {data : this.group, bottom: 10};
      }

      else{
        option.series = [{
          type: 'bar',
          // emphasis: {
          //   focus: 'self'
          // },
          label:{
            show: true,
            color: '#fff'
          },
          data:this.data,
          itemStyle: {
            color: (param) => {
              return this.colors[param.dataIndex]
            }
          }
        }];
      }

      if(this.title){
        option.title.text = this.$t(this.title);
        option.title.show = true;
      }


      return option;
    }
  },
  watch:{
    'highlight':function(newVal, oldVal){
      let sites = this.category;
      let dataIndex = sites.indexOf(newVal),
          oldIndex = sites.indexOf(oldVal);

      const barChart = this.$refs.barChart;
      barChart.dispatchAction({
        type: 'downplay',
        dataIndex: oldIndex
      })
      barChart.dispatchAction({
        type: 'highlight',
        dataIndex: dataIndex
      })
    }
  },
}
</script>

<style scoped>

</style>
