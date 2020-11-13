<template>
  <div class="hello">
<!--    <h1>{{ title }}</h1>-->
    <p>Welcome to the dashboard.</p>
    <div id="svg"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Forest',
  props: {
    title: String
  },
  mounted() {
    let that = this;
    fetch('http://localhost:3000/api/data',{
    })
        .then(response => response.json())
        .then(data => {console.log(data);that.forestPlot(data.plotConfig, data.data)})
  },
  created() {

  },
  methods:{
    _get_effect(d) {

  if (d.effect.effect !== undefined &&
      d.effect.low !== undefined &&
      d.effect.high !== undefined) {
    return [
      d.effect.low, d.effect.effect, d.effect.high
    ];
  }

  try {
    return [
      d.effect.effect - d.effect.sd,
      d.effect.effect,
      d.effect.effect + d.effect.sd
    ];
  } catch(e) {}

  throw "Invalid effect size reprensentation. Expected either 'effect' and " +
  "'sd' or 'effect', 'low' and 'high'.";

},
    forestPlot(conf, data) {
      let that = this;

      var config = {
        mountNode: conf.mountNode || '#svg',
        width: conf.width || 800,
        margin: conf.margin || { left: 20, top: 20 },
        effectLabel: conf.effectLabel || 'Effect',
        fontSize: conf.fontSize || 12,
        fontFamily: conf.fontFamily || 'Helvetica',
        nTicks: conf.nTicks || 5,
        vBar: (conf.vBar !== undefined) ? conf.vBar: null
      }
      console.log(config)
      var layout = {
        tabWidth: 12,  // In pixels
        tableWidth: 0.2,  // Sometimes it's better to set this at 0.3 and labelWidth at 0.3
        plotWidth: 0.5,
        labelWidth: 0.2,
        rowHeight: 26,
        padding: { left: 5, top: 10 },
        squareFullSize: 24
      }

      config.height = (data.length + 3) * layout.rowHeight

      function translate(x, y) {
        return 'translate(' + x + ', ' + y + ')'
      }

      // Clear previous plot if needed.
      d3.select(config.mountNode).selectAll("*").remove()

      const svg = d3.select(config.mountNode).append('svg')
          .attr('id', 'svg-forestplot')
          .attr('width', config.width)
          .attr('height', config.height)
          .append('g')
          .attr('transform', translate(config.margin.left, config.margin.top))

      /**
       * Create the table.
       **/
      const table = svg.append('g')
          .attr('width', layout.tableWidth * config.width)

      const rows = table.selectAll('.row').data(data).enter()
          .append('g')
          .classed('row', true)
          .attr('transform', function(d, i) {
            return translate(
                0,
                layout.rowHeight * i
            )
          })

      rows
          .append('rect')
          .attr('height', layout.rowHeight)
          .attr('width', config.width)
          .attr('fill', (d, i) => { return (i % 2 === 0)? '#f2f1f1': '#fff' })
          .attr('x', 0)
          .attr('y', 0)

      rows
          .append('text')
          .text(function(d) { return d.description; })
          .style('font-size', config.fontSize)
          .style('font-family', config.fontFamily)
          .attr('dy', (layout.rowHeight - config.fontSize) / 2 + 10)
          .attr('dx', function(d) {
            return (
                layout.padding.left +
                (d.descriptionOffset || 0) * layout.tabWidth
            );
          })

      /**
       * Create the plot.
       **/
      const plot = svg.append('g')
          .attr('width', layout.plotWidth * config.width)
          .attr('transform', translate(layout.tableWidth * config.width, 0))
          .classed('plot', true)

      // Define scale and axis.
      let lowX = Infinity;
      let highX = -Infinity;
      {
        let _, _low, _high;

        for (let e of data) {
          try {
            [_low, _, _high] = that._get_effect(e);
          } catch(e) { continue; }

          if (_low < lowX) lowX = _low;
          if (_high > highX) highX = _high;
        }
      }

      let x = d3.scaleLinear()
          .domain([lowX - Math.abs(0.1 * lowX), highX + Math.abs(0.1 * highX)])
          .range([0, config.width * layout.plotWidth])

      let xAxis = d3.axisBottom(x)
          .ticks(config.nTicks);

      // Add the effect label.
      plot.append('g')
          .attr('transform', function() {
            return translate(0, data.length * layout.rowHeight + 5);
          })
          .call(xAxis)
          .append('g')
          .attr('transform', translate(0, layout.rowHeight + layout.padding.top))
          .append('text')
          .text(config.effectLabel)
          .attr('fill', '#000')
          .attr('text-anchor', 'middle')
          .attr('x', layout.plotWidth * config.width / 2)
          .style('font-weight', 'bold')
          .style('font-size', config.fontSize)

      // Add the effect bars.
      let trees = plot.selectAll('.tree').data(data).enter()
          .append('g')
          .classed('tree', true)
          .attr('transform', function(d, i) {
            if (!d.effect) return;

            return translate(0, i * layout.rowHeight);
          })

      trees.append('line')
          .attr('x1', function(d) {
            try { return x(that._get_effect(d)[0]); } catch(e) { return 0; }
          })
          .attr('x2', function(d) {
            try { return x(that._get_effect(d)[2]); } catch(e) { return 0; }
          })
          .attr('y1', layout.rowHeight / 2)
          .attr('y2', layout.rowHeight / 2)
          .attr('stroke-width', 1)
          .attr('stroke', '#000')

      trees.append('rect')
          .filter(function(d) {
            try {
              that._get_effect(d);
              return true;
            } catch (e) { return false; }
          })
          .datum(function(d) {
            d.r = (d.markerSize || 1) * layout.squareFullSize;
            return d;
          })
          .attr('x', function(d) {
            return x(that._get_effect(d)[1]) - d.r / 2;
          })
          .attr('y', function(d) { return layout.rowHeight / 2 - d.r / 2; })
          .attr('width', function(d) { return d.r; })
          .attr('height', function(d) { return d.r; })

      if (config.vBar !== null) {
        plot.append('line')
            .attr('x1', x(config.vBar))
            .attr('x2', x(config.vBar))
            .attr('y1', 0)
            .attr('y2', data.length * layout.rowHeight)
            .attr('stroke-width', 1)
            .attr('stroke', '#444')
            .attr('stroke-dasharray', '5, 5')
            .classed('vbar', true)
      }

      /**
       * Add the effect labels.
       **/
      const effectLabels = svg.append('g')
          .attr('width', layout.labelWidth * config.width)

      let labels = table.selectAll('.label').data(data).enter()
          .append('g')
          .classed('label', true)
          .attr('transform', function(d, i) {
            return translate(
                (layout.tableWidth + layout.plotWidth) * config.width + 15,
                layout.rowHeight * i
            );
          });

      labels
          .filter(function(d) {
            try {
              // We display label if it is overriden or if all the values are
              // available.
              if (d.overrideLabel) return true;

              that._get_effect(d);
              return true;
            } catch (e) { return false; }
          })
          .append('text')
          .text(function(d) {
            if (d.overrideLabel) return d.overrideLabel

            let [_low, _effect, _high] = that._get_effect(d);
            return (`${_effect.toFixed(2)} ` +
                `(${_low.toFixed(2)}, ${_high.toFixed(2)})`);
          })
          .style('font-size', config.fontSize)
          .style('font-family', config.fontFamily)
          .attr('dy', (layout.rowHeight - config.fontSize) / 2 + 10)
          .attr('dx', layout.padding.left)

    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
