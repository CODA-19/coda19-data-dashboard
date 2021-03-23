<template>
  <v-chart class="chart" ref="barChart" :option="option"/>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

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
  props:{
    colors: Array,
    data: Array,
    category: Array,
    title: String,
    highlight: String,
    labels: Object,
    group: Array,
    horizontal: Boolean,
    margin: Array
  },
  components:{
    'v-chart': VChart
  },
  created() {
    window.addEventListener("resize", ()=>{
      const barChart = this.$refs.barChart;
      barChart.resize();
    });
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
        option.legend = {data : this.group, bottom: 0};
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

      if(this.margin){
        option.tooltip = {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            var icon =`<span style="background-color:${params[0].color};border: 1px solid ${params[0].color};border-radius:50%;display:inline-block;height:10px;margin-right:5px;margin-top:3px;width:10px;"></span>`,
                category = params[0].name,
                value = `<strong>${params[0].value}</strong>`,
                margin = `${params[1].value[1]}-${params[1].value[2]}`,
                tooltip = `<div style="display: flex;flex-direction: row;min-width:80px"><div style="display:flex;flex-direction:column"><div>${icon}${category}</div> </div><div style="display:flex;flex-direction:column;text-align: right"><div>${value}</div><div>${margin}</div></div>`

            return tooltip;
          }
        };

        option.series.push({
          type: 'custom',
          name: 'margin',
          renderItem: this.renderItem,
          encode: {
            x: 0,
            y: [1, 2]
          },
          data: this.margin,
          z: 100
        })
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
  methods:{
    renderItem(params, api) {
      const xValue = api.value(0),
          highPoint = api.coord([xValue, api.value(1)]),
          lowPoint = api.coord([xValue, api.value(2)]),
          halfWidth = api.size([1, 0])[0] * 0.1,
          style = {
            stroke: "#333",
            fill: null,
            lineWidth: 1.5
          };

      return {
        type: 'group',
        children: [{
          type: 'line',
          transition: ['shape'],
          shape: {
            x1: highPoint[0] - halfWidth, y1: highPoint[1],
            x2: highPoint[0] + halfWidth, y2: highPoint[1]
          },
          style: style
        }, {
          type: 'line',
          transition: ['shape'],
          shape: {
            x1: highPoint[0], y1: highPoint[1],
            x2: lowPoint[0], y2: lowPoint[1]
          },
          style: style
        }, {
          type: 'line',
          transition: ['shape'],
          shape: {
            x1: lowPoint[0] - halfWidth, y1: lowPoint[1],
            x2: lowPoint[0] + halfWidth, y2: lowPoint[1]
          },
          style: style
        }]
      };
}
  }
}
</script>

<style scoped>

</style>
