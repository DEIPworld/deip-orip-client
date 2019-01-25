<template>
    <div>
        <div id="d3-top-funding-opps" class="pos-relative">
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import * as d3 from "d3";

    export default {
        name: "TopFundingOpportunitiesChart",

        props: {
        },

        data() { 
            return {}
        },

        mounted() {
            var dataset = _.orderBy([
                ['#PAR-19-136', 1902],
                ['#PAR-19-232', 3341],
                ['#PAR-19-321', 1935],
                ['#PAR-19-137', 3008],
                ['#PAR-19-138', 1743],
                ['#PAR-19-139', 1271],
                ['#PAR-19-150', 626],
                ['#PAR-19-152', 1064],
                ['#PAR-19-196', 1443],
                ['#PAR-19-188', 630],
                ['#PAR-19-120', 2556],
                ['#PAR-19-191', 880],
                ['#PAR-19-111', 589],
                ['#PAR-19-113', 1497]
            ], [item => item[1]], ['desc']);

            var margin = {top: 20, right: 20, bottom: 80, left: 40},
                width = 850,
                height = 400;

            var xScale = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1)
                .domain(dataset.map(function(d) {
                    return d[0];
                }));

            var yScale = d3.scaleLinear()
                .rangeRound([height, 0])
                .domain([0, d3.max(dataset, (function (d) {
                    return d[1];
                }))]);

            var svg = d3.select("#d3-top-funding-opps").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // axis-x
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));

            // axis-y
            g.append("g")
                .attr("class", "grid")
                .call(d3.axisLeft(yScale)
                    .tickSize(-width)
                    .tickFormat("")
                );

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(yScale));

            var bar = g.selectAll("rect")
                .data(dataset)
                .enter().append("g");

            // bar chart
            bar.append("rect")
                .attr("x", function(d) { return xScale(d[0]); })
                .attr("y", function(d) { return yScale(d[1]); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return height - yScale(d[1]); })
                .attr("class", function(d) {
                    return 'bar';
                });

            // labels on the bar chart
            bar.append("text")
                .attr("dy", "1.3em")
                .attr("x", function(d) { return xScale(d[0]) + xScale.bandwidth() / 2; })
                .attr("y", function(d) { return yScale(d[1]); })
                .attr("text-anchor", "middle")
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "black")
                .text(function(d) {
                    return d[1];
                });
        }
    };
</script>


<style lang="less">
    .bar {
        fill: #2962FF;
        opacity: 0.5;
    }

    .grid line {
        stroke: lightgrey;
        shape-rendering: crispEdges;
    }

    .grid path {
        stroke-width: 0;
    }

    .axis.axis--x text {
        transform: translate(-20px, 25px) rotate(-45deg);
        // color: #2962FF;
    }
</style>
