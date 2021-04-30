<template>
  <v-chart class="chart" ref="lineChart" :option="option"/>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

export default {
  name: "lineChart",
  components: { VChart },
  props:{
    title: String,
    data: Array,
    dates: Array,
    categories: Array,
    prediction: String
  },
  created() {
    window.addEventListener("resize", ()=> { this.$refs.lineChart.resize(); } );
  },
  computed:{
    option() {
      let option = {
        title: { text: '' },
        tooltip: { trigger: 'axis' },
        legend: { data: this.categories },
        grid: {
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: { saveAsImage: {} }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dates,
        },
        yAxis: {
          type: 'value'
        }
      };

      let seriesOpt = [];

      if(this.categories) {

        this.categories.forEach((cat,i) => {
          let _this = this,
              data = this.data[i],
              predictData = [];

          if(this.prediction) {

            let predictIdx = this.dates.indexOf(this.prediction),
                data = this.data[i].slice(0,predictIdx),
                rawPrediction = this.data[i].slice(predictIdx - 1);
            const fillArray = new Array(data.length - 1).fill(null);
            predictData = fillArray.concat(rawPrediction);

            option.tooltip = {
              trigger: "axis",
              formatter: (params) => {
                let output = '';

                if(_this.dates.indexOf(params[0].name)>=predictIdx)
                  output += `<b>prediction</b><br>`

                output +=  params[0].name + '<br/>';

                for (i = 0; i < params.length; i++) {

                  if(params[i].value){
                    if(i>0 && params[i].seriesName=== params[i-1].seriesName)
                      continue;

                    output += `<div style='display: flex;flex-direction: column'>`
                    output += `<div style='display:flex;justify-content: space-between'><div>${params[i].marker + params[i].seriesName} </div><div><b>${params[i].value}</b></div>`;
                    output += `</div>`
                  }
                }
                return output
              }
            }
          }

          seriesOpt.push({
            name: cat,
            type: 'line',
            stack: '',
            smooth: true,
            data: data
          });

          if(this.prediction){
            seriesOpt.push(
                {
                  name: cat,
                  type: 'line',
                  lineStyle:{type:'dashed'},
                  stack: '',
                  smooth: true,
                  data: predictData
                })
          }

        });
      }

      option.series = seriesOpt;

      return option;
    }
  }
}
</script>

<style scoped>
</style>
