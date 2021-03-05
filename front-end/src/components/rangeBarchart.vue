<template>
  <div id="svg"></div>
</template>

<script>
import * as d3 from 'd3'

var categories = ['','101','102','103'];

var dollars = [
  [65, 78],
  [63, 76],
  [59, 87]
];

var colors = ['#0000b4', '#0082ca', '#0094ff', '#0d4bcf', '#0066AE', '#074285', '#00187B', '#285964', '#405F83', '#416545', '#4D7069', '#6E9985', '#7EBC89', '#0283AF', '#79BCBF', '#99C19E'];

var grid = d3.range(25).map(function(i) {
  return {
    'x1': 0,
    'y1': 0,
    'x2': 0,
    'y2': 480
  };
});

export default {
  name: "rangeBarchart",
  prop:{
    data:{
      type: Array
    },
    categories: {
      type: Array
    },
    color:{
      type: Array
    }
  },
  mounted(){
    this.rangeBarchart()
  },
  methods:{
    rangeBarchart(){
      var grid = d3.range(25).map(function(i) {
        return {
          'x1': 0,
          'y1': 0,
          'x2': 0,
          'y2': 480
        };
      });


      var yscale = d3.scaleLinear()
          .domain([10, 250])
          .range([480, 0]);

      var xscale = d3.scaleLinear()
          .domain([0, categories.length])
          .range([0, 722]);

      var colorScale = d3.scaleLinear()
          .domain([0, categories.length])
          .range(colors);

      var canvas = d3.select('#svg')
          .append('svg')
          .attr('width', 900)
          .attr('height', 550);

      var grids = canvas.append('g')
          .attr('id', 'grid')
          .attr('transform', 'translate(150,10)')
          .selectAll('line')
          .data(grid)
          .enter()
          .append('line')
          .attr('x1', function(d, i) {
              return i * 30;
            })
          .attr(
            'y1', function(d) {
              return d.y1;
            })
          .attr(
            'x2', function(d, i) {
              return i * 30;
            })
          .attr(
            'y2', function(d) {
              return d.y2;
            })
          .style('stroke', '#adadad')
          .style('stroke-width', '1px');

      var xAxis = d3.axisBottom(xscale)
          .tickSize(2)
          .tickFormat(function(d, i) {
            return categories[i];
          })
          .tickValues(d3.range(17));

      var yAxis = d3.axisLeft(yscale)


      var y_xis = canvas.append('g')
          .attr("transform", "translate(150,0)")
          .attr('id', 'yaxis')
          .call(yAxis);

      var x_xis = canvas.append('g')
          .attr("transform", "translate(150,480)")
          .attr('id', 'xaxis')
          .call(xAxis);

      var chart = canvas.append('g')
          .attr("transform", "translate(150,0)")
          .attr('id', 'bars')
          .selectAll('rect')
          .data(dollars)
          .enter()
          .append('rect')
          .attr('width', 19)
          .attr('y', function(d) {
                return yscale(d[0]);
              })
          .attr('x', function(d, i) {
              return xscale(i) + 722/4 - 19/2;
            }
          )
          .style('fill', function(d, i) {
            return colorScale(i);
          })
          .attr('height', function(d) {
            return  yscale(d[0]);
          });


      var transit = d3.select("svg").selectAll("rect")
          .data(dollars)
          .transition()
          .duration(1000)
          .attr("height", function(d) {
            return  yscale(d[0]) - yscale(d[1]) ;
          });
      //setting the text to the bars
      var transitext = d3.select('#bars')
          .selectAll('text')
          .data(dollars)
          .enter();
      //start text
      transitext.append('text')
          .attr({
            'y': function(d) {
              return yscale(d[0]) - 30;
            },
            'x': function(d, i) {
              return xscale(i) + 35;
            }
          })
          .text(function(d) {
            return d[0] + "$";
          }).style({
        'fill': 'black',
        'font-size': '14px'
      });
      //end text
      transitext.append('text')
          .attr({
            'x': function(d) {
              return xscale(d[1]) + 10;
            },
            'y': function(d, i) {
              return yscale(i) + 35;
            }
          })
          .text(function(d) {
            return d[1] + "$";
          }).style({
        'fill': 'black',
        'font-size': '14px'
      });
    }
  }

}
</script>

<style scoped>

</style>
