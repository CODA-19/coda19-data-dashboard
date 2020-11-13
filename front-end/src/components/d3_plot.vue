<template>
<div id="svg">

</div>

</template>

<script>
import * as d3 from 'd3'
import $ from "jquery"

export default {
  name: "d3_plot",
  mounted(){
    this.d3plot();
  },
  methods:{
    d3plot(){
      let that = this;

      var config = {
        mountNode: '#svg',
        width:  600,
        height: 300,
        margin: { left: 20, bottom: 40 },
        effectLabel:  'Effect',
        fontSize:  16,
        fontFamily:  'Helvetica'
      }

      var layout = {
        tabWidth: 12,  // In pixels
        tableWidth: 0.2,  // Sometimes it's better to set this at 0.3 and labelWidth at 0.3
        plotWidth: 0.5,
        labelWidth: 0.2,
        rowHeight: 24,
        padding: { left: 5, top: 10 },
        squareFullSize: 24,
        margin:{bottom: 15}
      }

      // Clear previous plot if needed.
      d3.select(config.mountNode).selectAll("*").remove()

      function translate(x, y) {
        return 'translate(' + x + ', ' + y + ')'
      }

      const svg = d3.select(config.mountNode).append('svg')
          .attr('id', 'svg-plot')
          .attr('width', config.width)
          .attr('height', config.height)
          .append('g')
          .attr('transform', translate(config.margin.left, config.margin.top))

      const table = svg.append('g')
          .attr('width', layout.tableWidth * config.width)

      const rows = table.selectAll('.row').data(that.data.data).enter()
          .append('g')
          .classed('row', true)
          .attr('transform', function(d, i) {
            return translate(
                0,
                layout.rowHeight * i + layout.margin.bottom * (i+1)
            )
          })

      rows
          .append('text')
          .text(function(d,i) {  return that.$t(that.data.categories[i]); })
          .style('font-size', config.fontSize)
          .style('font-family', config.fontFamily)
          .attr('dy', (layout.rowHeight - config.fontSize) / 2 + 10)
          .attr('x', 0)
          .attr('y', 0)
          .call(that.wrap, 150)

      const rects = rows.append('g').attr('transform', function(d, i) {
        return translate(
            150,
            0
        );});

      rects
          .append('rect')
          .attr('height', layout.rowHeight)
          .attr('width', config.width - 150)
          .attr('fill', '#f2f1f1')
          .attr('x', 0)
          .attr('y', 0);


      rects.selectAll('g')
          .data(function(d,i){return d.map(d=>d.concat(i))}).enter()
          .append('circle')
          .attr("transform", (d) => "translate(" + that.getScale(d[2],d[0]) + " -12)")
          .attr('cx', layout.rowHeight)
          .attr('cy', layout.rowHeight)
          .attr('r', layout.rowHeight/2)
          .attr('fill', (d,i) => {return that.colors[i]})
          .attr('style', "fill-opacity: 0.7; stroke:#525252; stroke-opacity: 0.7;")
          .on('mouseover', function(){  d3.select(this).attr('style', "fill-opacity: 1;")})
          .on('mouseout', function(){  d3.select(this).attr('style', "fill-opacity: 0.7;")})
          .append("svg:title")
          .text(function(d) { return d[1]+": "+d[0]; });


    },
    wrap(text, width) {
      text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 16,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy );
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy ).text(word);
      }
    }
  });
},
    getScale(i,value){
      if(this.data.types[i]!=="time"){
        var scale = d3.scaleLinear()
            .domain(this.data.ranges[i].map(b=>{return parseFloat(b)}))
            .range([0, 400]);
        return scale(parseFloat(value))
      }
      else{
        var scale = d3.scaleTime()
            .domain(
                d3.extent(this.data.ranges[i], function(d) {
                  return new Date(d);
        }))
            .range([0, 400]);
        return scale(new Date(value))
      }

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
