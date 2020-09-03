<template>
  <v-chart :options="option"/>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/scatter';
import "echarts";


var ranges = [[105, 1050],[95,950],[10543,40502],['2020-08-23','2020-10-30'],[45,69],[7,25]];
var categories = ['Number Tested', 'Number Positive', 'Number Admitted', 'Median COVID-19\nAdmission Date', 'Mean Age', 'Length of Stay'];
var data = [
    [0,200,0],[0,500,1], [0,800,2], [0,650,3],
    [1,200,0],[1,500,1], [1,890,2], [1,450,3],
    [2,11200,0],[2,12300,1], [2,33890,2], [2,25450,3],
    [3,'2020-08-31',0],[3,'2020-10-30',1], [3,'2020-09-28',2], [3,'2020-09-01',3],
    [4,57,0], [4,54,1], [4,65,2],[4,64,3],
    [5,8,0], [5,12,1], [5,17,2],[5,15,3]
];
var sites = ['CHUM', 'MUHC', 'CHUQ', 'JGH'];
var colors = ['lightblue','blue','lightgreen', 'green'];
var types = ['value', 'value', 'value', 'time', 'value', 'value'];

export default {
  components: {
    'v-chart': ECharts
  },
  created(){
    this.setOptions();
  },
  methods:{
    setOptions(){
      let that = this;
      that.option = {
        tooltip: {
          position: 'top',
          formatter: function (params) {
            return sites[params.value[1]]+': '+params.value[0] ;
          }
        },
        title: [{
          text: 'Summary',
          top: 'top',
          left: 'center'
        }],
        singleAxis: [],
        name:'Summary',
        nameLocation:'center',
        series: [],
        visualMap: {
          type: 'piecewise',
          categories: sites,
          orient: 'horizontal',
          top: 'bottom',
          left: 'center',
          dimension:2,
          inRange: {
            color: colors
          },
          outOfRange: {
            color: '#ddd'
          },
          seriesIndex: [6]
        },
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
      };
      categories.forEach((cat, idx)=>{
        that.option.title.push({
          textBase: 'middle',
          top: (idx*80/6+12)+'%',//(idx + 0.6) * 100 / 6 + '%',
          text: cat,
          left: 150,
          textStyle:{
            fontSize: 14
          },
          textAlign: 'right'
        });
        that.option.singleAxis.push({
          left: 180,
          type: types[idx],
          align: 'left',
          axisTick:{
            show: false
          },
          minInterval:ranges[idx][1],
          boundaryGap: false,
          min: ranges[idx][0],
          max: ranges[idx][1],
          top: (idx*80/6+12)+'%',//(idx * 100 / 6 + 5) + '%',
          height: 20,
          axisLabel: {
            interval: 2
          }
        });
        that.option.series.push({
          singleAxisIndex: idx,
          coordinateSystem: 'singleAxis',
          type: 'scatter',
          data: [],
          symbolSize: 20
        });
      });
      data.forEach((dataItem)=> {
        that.option.series[dataItem[0]].data.push({
          value:[dataItem[1], dataItem[2]],
          itemStyle:{color:colors[dataItem[2]]}
        });
      });
      that.option.legend =  {
       x:'center',
            show: true,
            orient: 'horizontal',
            top:'50%',
            data: data
      }
      console.log(that.option)
    }
  },
  data () {
    return {options: this.option};
  }
}
</script>

<style scoped>

</style>
