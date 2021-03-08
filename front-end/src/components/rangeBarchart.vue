<template>
  <div id="svg"></div>
</template>

<script>
import * as d3 from 'd3'

var categories = ['101','102','103'];

var subCategory = ['male','female'];

var dollars = [
  [50, 70],
  [63, 76],
  [59, 87]
];

var dollarsSub = [
  [[50, 70], [63, 76]],
  [ [59, 87], [53, 72]],
  [ [60, 78], [62, 89]]
];

const margin = {
  left: 30,
  top: 20
}

const size = {
  height: 300,
  width: 500
}

const barWidth = 20;

export default {
  name: "rangeBarchart",
  props:{
    data:{
      type: Array
    },
    categories: {
      type: Array
    },
    colors:{
      type: Array
    }
  },
  mounted(){
    // this.rangeBarchart();
    this.rangeBarchartBreakdown();
  },
  methods:{
    rangeBarchart(){
      let _this = this;

      var canvas = d3.select('#svg')
          .append('svg')
          .attr('width', size.width+2*margin.left)
          .attr('height', size.height+2*margin.top);

      var yscale = d3.scaleLinear()
          .domain([10, 100])
          .range([size.height, 0]);

      var xscale = d3.scaleBand()
          .domain(categories)
          .range([0, size.width])
          .padding(0.2);

      var xAxis = d3.axisBottom(xscale)

      const yAxisGrid = d3.axisLeft(yscale).tickSize(-size.width).tickFormat('').ticks(10);

      var grid = canvas.append('g')
          .attr('class', 'y axis-grid')
          .attr('transform', `translate(${margin.left},${margin.top})`)
          .call(yAxisGrid)
          .selectAll('line')
          .style('stroke','#cccccc')


      var yAxis = d3.axisLeft(yscale).ticks(10)


      var y_xis = canvas.append('g')
          .attr("transform", `translate(${margin.left},${margin.top})`)
          .attr('id', 'yaxis')
          .call(yAxis);

      var x_xis = canvas.append('g')
          .attr("transform", `translate(${margin.left},${size.height+margin.top})`)
          .attr('id', 'xaxis')
          .call(xAxis);

      var bars = canvas.append('g')
          .attr("transform", `translate(${margin.left},${margin.top})`)
          .selectAll('rect')
          .data(dollars)
          .enter();

          bars.append('rect')
          .attr('width', xscale.bandwidth())
          .attr('y', function(d) {
                return yscale(d[1]);
              })
          .attr('x', function(d, i) {
              return xscale(categories[i])
            }
          )
          .style('fill', function(d, i) {
            return _this.colors[i];
          })
          .transition()
          .duration(1000)
          .attr("height", function(d) {
            return  yscale(d[0]) - yscale(d[1]) ;
          })


      //max text
     bars.append('text')
          .text(function(d){
            return d[0]
          })
          .attr('y', function(d) {
              return yscale(d[0]) + 15;
            })
            .attr('x', function(d, i) {
              return xscale(categories[i]) + xscale.bandwidth()/2 ;
            }
          )
          .text(function(d) {
            return d[0];
          })
          .style('font-size', '14px');

      //min text
      bars.append('text')
          .attr('x', function(d,i) {
              return xscale(categories[i]) + xscale.bandwidth()/2;
            })
            .attr('y', function(d) {
              return yscale(d[1]) - 5;
            })
          .text(function(d) {
            return d[1];
          })
          .style('font-size', '14px');
    },

    rangeBarchartBreakdown(){
      let _this = this;

      var canvas = d3.select('#svg')
          .append('svg')
          .attr('width', size.width+2*margin.left)
          .attr('height', size.height+2*margin.top);

      var yscale = d3.scaleLinear()
          .domain([10, 100])
          .range([size.height, 0]);

      var xscale = d3.scaleBand()
          .domain(categories)
          .range([0, size.width])
          .padding(0.2);

      var xSubgroup = d3.scaleBand()
          .domain(subCategory)
          .range([0,xscale.bandwidth()])
          .padding([0.05])

      var xAxis = d3.axisBottom(xscale)

      const yAxisGrid = d3.axisLeft(yscale).tickSize(-size.width).tickFormat('').ticks(10);

      var grid = canvas.append('g')
          .attr('class', 'y axis-grid')
          .attr('transform', `translate(${margin.left},${margin.top})`)
          .call(yAxisGrid)
          .selectAll('line')
          .style('stroke','#cccccc')


      var yAxis = d3.axisLeft(yscale).ticks(10)


      var y_xis = canvas.append('g')
          .attr("transform", `translate(${margin.left},${margin.top})`)
          .attr('id', 'yaxis')
          .call(yAxis);

      var x_xis = canvas.append('g')
          .attr("transform", `translate(${margin.left},${size.height+margin.top})`)
          .attr('id', 'xaxis')
          .call(xAxis);

      var bars = canvas.append('g')
          .attr("transform", `translate(${margin.left},${margin.top})`)
          .selectAll('rect')
          .data(dollarsSub)
          .enter();


       var subBars = bars.append("g")
          .attr("transform", function(d,i) { return "translate(" + xscale(categories[i]) + ",0)"; })
          .selectAll("rect")
          .data(function(d){
            return subCategory.map(function (key,i){
              return  {key:key, value:d[i]}
            })
          })
           .enter();

          subBars.append("rect")
          .attr("x", function(d) { return xSubgroup(d.key); })
          .attr("y", function(d) { return yscale(d.value[1]); })
          .attr("width", xSubgroup.bandwidth())
          .attr("height", function(d) { return yscale(d.value[0]) - yscale(d.value[1]) })
          .attr("fill", function(d,i) {return _this.colors[i]; });


      //max text
      subBars.append('text')
          .attr('y', function(d,i) {
            return yscale(d.value[0]) + 15;
          })
          .attr('x', function(d) {
                return xSubgroup(d.key) + xSubgroup.bandwidth()/2 ;
              }
          )
          .text(function(d,i) {
            return d.value[0];
          })
          .style('font-size', '12px');

      //min text
      subBars.append('text')
          .attr('x', function(d) {
            return xSubgroup(d.key) + xSubgroup.bandwidth()/2;
          })
          .attr('y', function(d) {
            return yscale(d.value[1]) - 5;
          })
          .text(function(d) {
            return d.value[1];
          })
          .style('font-size', '12px');
    }

  }

}
</script>

<style scoped>

</style>
