<template>
    <div>
        <div :id="'d3-chart-disc-' + chartsDataItem.discipline.id" class="pos-relative">
            <div class="dynamic-tooltip" style="display: none;">
                <v-card class="c-pv-1 c-ph-2" dark v-html="dynamicTooltipContent"></v-card>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import Vue from 'vue';
    import * as d3 from "d3";

    export default {
        name: "ResearchContentDetailsReviewChart",

        props: {
            chartsDataItem: Object
        },

        data() {
            return {
                dynamicTooltipContent: ''
            };
        },

        computed: {
            ...mapGetters({
            })
        },

        mounted() {
            let component = this;

            let chartData = this.chartsDataItem.chartData;
            let lineChartData = this.chartsDataItem.lineChartData;

            let margin = { top: 20, right: 20, bottom: 30, left: 40 },
                width = 850,
                height = 400;

            let minX = d3.min(lineChartData, d => d.date);
            let maxX = d3.max(lineChartData, d => d.date);
            let xScale = d3.scaleLinear()
                .rangeRound([0, width])
                .domain([ minX - 0.02 * (maxX - minX), maxX ]);

            let minReviewWeight = chartData.length ? _.minBy(chartData, item => item.reviewData.weight).reviewData.weight : 0;
            let maxReviewWeight = chartData.length ? _.maxBy(chartData, item => item.reviewData.weight).reviewData.weight : 0;
            let minLineY = d3.min(lineChartData, d => d.y);
            let maxLineY = d3.max(lineChartData, d => d.y);
            let minY = minReviewWeight > 0 && minLineY > 0 ? 0 : minReviewWeight > minLineY ? minLineY : minReviewWeight;
            let maxY = maxReviewWeight < 0 && maxLineY < 0 ? 0 : maxReviewWeight > maxLineY ? maxReviewWeight : maxLineY;
            let yScale = d3.scaleLinear()
                .rangeRound([height, 0])
                .domain([ minY - 0.02 * (maxY - minY), maxY ]);
            
            let dynamicTooltip = d3.select("#d3-chart-disc-" + this.chartsDataItem.discipline.id).select('.dynamic-tooltip');

            let svg = d3.select("#d3-chart-disc-" + this.chartsDataItem.discipline.id)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            svg.append('defs')
                .selectAll("pattern")
                .data(chartData)
                .enter()
                .append("pattern")
                .attr('id', d => d.reviewData.review.author.account.name)
                // .attr('patternUnits', d => 'userSpaceOnUse')
                .attr('viewBox', d => '0 0 24 24')
                .attr('x', d => '0%')
                .attr('y', d => '0%')
                .attr('width', d => '100%')
                .attr('height', d => '100%')
                .append('image')
                .attr('xlink:href', d => {
                    return d.reviewData.review.author.profile
                    ? `${window.env.DEIP_SERVER_URL}/api/user/avatar/${d.reviewData.review.author.profile.avatar}?width=24&height=24&noCache=true`
                    // : `http://www.gravatar.com/avatar/0c333262d9b65e9e0045e911b4462c6d?s=24&d=retro&r=g`;
                    : 'http://www.gravatar.com/avatar/'
                        + md5((d.reviewData.review.author.account.name + '@deip.world').trim().toLowerCase())
                        + '?s=24&d=retro&r=g';
                })
                .attr('x', d => '0%')
                .attr('y', d => '0%')
                .attr('width', d => '24')
                .attr('height', d => '24');

            let g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

            // axis-x
            g.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(
                    d3.axisBottom(xScale)
                        .ticks(10, "s")
                        .tickFormat("")
                        .tickSize(-height)
                );

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + yScale(0) + ")")
                .call(
                    d3.axisBottom(xScale)
                        .ticks(10, "s")
                        .tickFormat(unix => moment.unix(unix).format('DDD MMM HH:mm'))
                );
                
            // line chart
            let line = d3.line()
                .x((d, i) => xScale(d.date))
                .y(d => yScale(d.y))
                .curve(d3.curveLinear);

            g.append("g")
                .append("path")
                .attr("class", "line")
                .attr("d", line(lineChartData)); // 11. Calls the line generator;

            let bar = g.selectAll("rect")
                .data(chartData)
                .enter()
                .append("g");

            // bar chart
            bar.append("rect")
                .attr("x", d => xScale(d.reviewData.date) - 4)
                .attr("y", d => d.reviewData.weight > 0 ? yScale(d.reviewData.weight) : yScale(0))
                .attr("width", 8)
                .attr("height", d => d.reviewData.weight > 0 ? yScale(0) - yScale(d.reviewData.weight) : yScale(d.reviewData.weight) - yScale(0))
                .attr("class", d => {
                    return "bar";
                });

            //
            // labels on the bar chart
            //
            // bar.append("text")
            //     .attr("dy", "1.3em")
            //     .attr("x", d => xScale(d.date))
            //     .attr("y", d => d.y > 0 ? yScale(d.y) : yScale(d.y) - 20)
            //     .attr("text-anchor", "middle")
            //     .attr("font-family", "sans-serif")
            //     .attr("font-size", "11px")
            //     .attr("fill", "black")
            //     .text(d => d.y);

            // dots            
            bar.append("circle")
                .attr("class", "review-dot")
                .attr("cx", (d, i) => xScale(d.reviewData.date))
                .attr("cy", d => yScale(d.reviewData.y))
                .attr("r", 12)
                .attr("fill", d => `url(#${d.reviewData.review.author.account.name})`)
                .on("mouseover", function(d) {
                    dynamicTooltip.style("display", "block");
                    dynamicTooltip.style("top", `${parseFloat(d3.select(this).attr('cy')) + margin.top}px`);
                    dynamicTooltip.style("left", `${parseFloat(d3.select(this).attr('cx')) + margin.left}px`);

                    let expertiseTags = _.reduce(d.reviewData.review.expertise_amounts_used, (acc, expertiseUsed) => {
                        let disciplineName = _.find(d.reviewData.review.disciplines, { id: expertiseUsed[0] }).name;
                        let tag = `<div class="">${disciplineName} ${expertiseUsed[1]}</div>`;
                        return acc + tag;
                    }, '');

                    component.dynamicTooltipContent = `
                        <div class="caption">
                            <div class="bold">${Vue.filter('fullname')(d.reviewData.review.author)}</div>
                            <div class="bold ${d.reviewData.review.is_positive ? 'green' : 'red'}--text text--lighten-2">
                                ${d.reviewData.review.is_positive ? 'Approve' : 'Reject'}
                            </div>
                            ${expertiseTags}
                            <div class="c-pt-2 bold">ECI ${d.reviewData.y}</div>
                        </div>
                    `;
                })
                .on('mouseleave', function(d) { dynamicTooltip.style("display", "none") })
                .on("click", function(d) {
                    svg.selectAll('.review-dot')
                        .classed('highlighted', false);

                    d3.select(this)
                        .classed('highlighted', true);
                });

            bar.append("g")
                .attr("class", "vote-dots")
                .selectAll("circle")
                .data(d => d.votesData)
                .enter()
                .append("circle")
                .attr("class", "vote-dot")
                .attr("cx", (d, i) => xScale(d.date))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3)
                .on("mouseover", function(d) {
                    dynamicTooltip.style("display", "block");
                    dynamicTooltip.style("top", `${parseFloat(d3.select(this).attr('cy')) + margin.top}px`);
                    dynamicTooltip.style("left", `${parseFloat(d3.select(this).attr('cx')) + margin.left}px`);

                    component.dynamicTooltipContent = `
                        <div class="caption">
                            <div class="bold">${d.vote.voter}</div>
                            <div class="">Weight ${d.vote.weight}</div>
                            <div class="c-pt-2 bold">ECI ${d.y}</div>
                        </div>
                    `;
                })
                .on('mouseleave', function(d) { dynamicTooltip.style("display", "none") });
        }
    };
</script>

<style lang="less">
    .dynamic-tooltip {
        position: absolute;
        transform: translate(-50%, calc(-100% - 20px));
        z-index: 2;
        opacity: 0.9;
    }

    .grid line {
        stroke: lightgrey;
        stroke-opacity: 0.7;
        shape-rendering: crispEdges;
        stroke-dasharray: 4;
    }

    .grid path {
        stroke-width: 0;
    }

    .bar {
        fill: #2962FF;
        opacity: 0.5;
    }
    
    .line {
        fill: none;
        stroke: #2962FF;
        stroke-width: 1;
    }

    .review-dot + .vote-dots {
        display: none;
    }

    .review-dot:hover {
        stroke: #8BC34A;
        stroke-width: 2;
    }
    .review-dot:hover + .vote-dots {
        display: inline;

        .vote-dot { fill: #8BC34A; }
    }

    .review-dot.highlighted {
        stroke: #1B5E20;
        stroke-width: 2;
    }
    .review-dot.highlighted + .vote-dots {
        display: inline;
        
        .vote-dot { fill: #1B5E20; }
    }
</style>
