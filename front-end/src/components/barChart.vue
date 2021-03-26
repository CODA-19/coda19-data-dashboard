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

      if(!this.data){
        return this.getBaseOptions();
      }

      else
        return this.getOptions();
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
    getBaseOptions(){
       return {
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
    },
    getOptions(){
      const option = this.getBaseOptions();

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

      const seriesOpt = this.getSeriesOptions(),
          legend = this.getLegend(),
          tooltip = this.getTooltip();

      option.series = seriesOpt;
      option.legend = legend;
      if(tooltip)
        option.tooltip = tooltip;


      if(this.title){
        option.title.text = this.$t(this.title);
        option.title.show = true;
      }


      return option;

    },
    getSeriesOptions(){
      var seriesOpt;

      if(this.group){
        seriesOpt = [];
        this.data.forEach((serie,idx)=>{
          seriesOpt.push({
            type: 'bar',
            data:serie,
            name: this.$t(this.group[idx]) ,
            itemStyle: {
              color: () => {
                return this.colors[idx]
              }
            }
          })
        })
      }

      else{
        seriesOpt = [ {
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
        const encodeY = [];
        for (let i = 0; i < 3; i++) {
          encodeY.push(1 + i);
        }

        if(this.group){
          let _this = this;
          seriesOpt = this.data.map(function (data, index) {
            return {
              type: 'bar',
              name:_this.$t(_this.group[index]),
              animation: false,
              itemStyle: {
                opacity: 0.8
              },
              data: data
            };
          })
        }

        seriesOpt.push({
          type: 'custom',
          name: 'margin',
          renderItem: this.renderItem,
          encode: { x: 0, y: encodeY},
          data: this.margin,
          z: 100
        });
      }

      return seriesOpt;
    },
    getLegend(){
      var legend, selectedMode = true;
      if(this.group){
        var group = [];
        for (let i = 0; i <this.group.length; i++) {
	        group[i] = this.$t(this.group[i]);
        }
        if(this.margin)
          selectedMode = false

        legend = {data : group, bottom: 0, selectedMode : selectedMode};
      }

      return legend
    },
    getTooltip(){
      var tooltip;
      if(this.margin){
        tooltip = {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        }

        if(!this.group){
          tooltip.formatter = (params) => {
            var icon =`<span style="background-color:${params[0].color};border: 1px solid ${params[0].color};border-radius:50%;display:inline-block;height:10px;margin-right:5px;margin-top:3px;width:10px;"></span>`,
                category = params[0].name,
                value = `<strong>${params[0].value}</strong>`,
                margin = `${params[1].value[1]}-${params[1].value[2]}`,
                tooltip = `<div style="display: flex;flex-direction: row;min-width:80px"><div style="display:flex;flex-direction:column"><div>${icon}${category}</div> </div><div style="display:flex;flex-direction:column;text-align: right"><div>${value}</div><div>${margin}</div></div>`

            return tooltip;
          }
        }
        else{
          tooltip.formatter = (params) => {
            var tooltip = `<span>${params[0].name}</span>`;
            params.forEach((param,idx)=>{
              if(param.seriesType !== 'custom'){
                var category =  `<div><span style="background-color:${param.color};border: 1px solid ${param.color};border-radius:50%;display:inline-block;height:10px;margin-right:5px;margin-top:3px;width:10px;"></span><span>${param.seriesName}</span></div>`;
                var value = `<div><strong>${param.value}</strong>(${params[params.length - 1].value[idx+1].join('-')})</div>`
                tooltip +=`<div style="display:flex;flex-direction: row;min-width:100px;justify-content: space-between">${category+value}</div>`
              }
            })

            return tooltip;
          }
        }
      }
      return tooltip;
    },
    renderItem(params, api) {
      const xValue = api.value(0),
          halfWidth = 5,
          style = {
            stroke: "#333",
            fill: null,
            lineWidth: 1.5
          };

      if(this.group){

        var currentSeriesIndices = api.currentSeriesIndices();
        var barLayout = api.barLayout({
          barGap: '30%', barCategoryGap: '20%', count: currentSeriesIndices.length - 1
        });

        var points = [];
        for (var i = 0; i < currentSeriesIndices.length; i++) {
          var seriesIndex = currentSeriesIndices[i];
          if (seriesIndex !== params.seriesIndex) {
            var lowpoint = api.coord([xValue, this.margin[params.dataIndex][i+1][0]]);
            var highpoint = api.coord([xValue, this.margin[params.dataIndex][i+1][1]]);
            lowpoint[0] += barLayout[i].offsetCenter;
            highpoint[0] += barLayout[i].offsetCenter;
            points.push({lowPoint: lowpoint, highPoint: highpoint});
          }
        }


        var children = [];

        points.map(point=>{
          children.push({
            type: 'line',
            transition: ['shape'],
            shape: {
              x1: point.lowPoint[0] - halfWidth, y1: point.lowPoint[1],
              x2: point.lowPoint[0] + halfWidth, y2: point.lowPoint[1]
            },
            style: style
          });
          children.push({
            type: 'line',
            transition: ['shape'],
            shape: {
              x1: point.highPoint[0] - halfWidth, y1: point.highPoint[1],
              x2: point.highPoint[0] + halfWidth, y2: point.highPoint[1]
            },
            style: style
          });
          children.push({
            type: 'line',
            transition: ['shape'],
            shape: {
              x1: point.highPoint[0], y1: point.highPoint[1],
              x2: point.lowPoint[0], y2: point.lowPoint[1]
            },
            style: style
          })

        })

        return {
          type: 'group',
          children: children
        };
      }

      const highPoint = api.coord([xValue, api.value(1)]),
          lowPoint = api.coord([xValue, api.value(2)]);

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
