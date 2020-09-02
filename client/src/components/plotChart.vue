<template>
  <v-chart :options="option"/>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/scatter';
import * as Echarts from "echarts";


var ranges = [[105, 1050],[95,950],[10543,40502],['2020-08-23','2020-10-30'],[45,69],[7,25]];
var categories = ['Number Tested', 'Number Positive', 'Number Admitted', 'Median COVID-19 Admission Date', 'Mean Age', 'Length of Stay'];
var data = [
    [0,200,0],[0,500,1], [0,800,2], [0,650,3],
    [1,200,0],[1,500,1], [1,890,2], [1,450,3],
    [2,11200,0],[2,12300,1], [2,33890,2], [2,25450,3],
    [3,'2020-08-31',0],[3,'2020-10-30',1], [3,'2020-09-28',2], [3,'2020-09-01',3],
    [4,57,0], [4,54,1], [4,65,2],[4,64,3],
    [5,8,0], [5,12,1], [5,17,2],[5,15,3]
];
var colors = ['lightblue','blue','lightgreen', 'green'];
var types = ['value', 'value', 'value', 'time', 'value', 'value'];

export default {
  components: {
    'v-chart': ECharts
  },
  props:{
    option:{
      type: Object
    }
  },
  created(){
    let that = this;
    that.option = {
      tooltip: {
        position: 'top',
        formatter: function (params) {
          return params.value ;
        }
      },
      title: [],
      singleAxis: [],
      name:'Summary',
      nameLocation:'center',
      series: [],
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
        top: (idx + 0.6) * 100 / 7 + '%',
        text: cat,
      });
      that.option.singleAxis.push({
        left: 150,
        type: types[idx],
        axisTick:{
          show: false
        },
        minInterval:ranges[idx][1],
        boundaryGap: true,
        min: ranges[idx][0],
        max: ranges[idx][1],
        top: (idx * 100 / 7 + 5) + '%',
        height: (100 / 7 - 10) + '%',
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
  },
  data () {
    return {options: this.option};
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
