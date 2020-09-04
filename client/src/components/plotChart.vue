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
var means = [537.5, 510, 20710, '2020-09-15', 60, 13];

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
            if(params.value.length === 1)
              return 'Mean: '+params.value[0] ;
            else return sites[params.value[1]]+': '+params.value[0]
          }
        },
        title: [{
          text: 'Summary',
          top: 'top',
          left: 'center'
        }],
        legend:{},
        singleAxis: [],
        name:'Summary',
        nameLocation:'center',
        series: [],
        // visualMap: {
        //   type: 'piecewise',
        //   categories: sites,
        //   orient: 'horizontal',
        //   top: 'bottom',
        //   left: 'center',
        //   inRange: {
        //     color: colors
        //   },
        //   outOfRange: {
        //     color: '#ddd'
        //   },
        //   seriesIndex: [6]
        // },
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
      data.forEach((dataItem, i)=> {
        that.option.series[dataItem[0]].data.push({
          name: sites[i],
          value:[dataItem[1], dataItem[2]],
          itemStyle:{color:colors[dataItem[2]]}
        });
      });
      means.forEach((cat, i)=>{
        that.option.series[i].data.push({
          name: 'Mean',
          value:[cat],
          itemStyle:{
            color: 'black',
            opacity: 100
          },
          symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAeHaAAHh2gFb9nS3AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAAxQTFRF////AwEEAwEEAwEE0UKdTQAAAAN0Uk5TAIiY9/jN6wAAASRJREFUeNrtzjERADAIBLDf8O+wTloBbD2OKVGQ5Evd5mSTgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAXOABprmsLPmK90AAAAAASUVORK5CYII="

        })
      })
    }
  },
  data () {
    return {options: this.option};
  }
}
</script>

<style scoped>

</style>
