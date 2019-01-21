<template>
    <div>
        <div id="d3-chart" class="pos-relative">
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
        },

        data() {
            return {
                dynamicTooltipContent: ''
            };
        },

        computed: {
            ...mapGetters({
                contentReviewsList: 'rcd/contentReviewsList',
                disciplinesList: 'rcd/disciplinesList'
            })
        },

        mounted() {
            let resList = _.map(this.disciplinesList, discipline => {
                return {
                    discipline: _.clone(discipline),
                    chartData: _.chain(this.contentReviewsList)
                        .cloneDeep()
                        .filter(review => review.disciplines.find(reviewDiscipline => reviewDiscipline.id === discipline.id))
                        .map(review => {
                            return {
                                reviewData: {
                                    type: 'review',
                                    date: moment(review.created_at).unix(),
                                    y: null,
                                    weight: review.weight_per_discipline.find(weight => weight[0] === discipline.id)[1],
                                    review: review
                                },
                                votesData: _(review.votes)
                                    .filter(vote => vote.discipline_id = discipline.id)
                                    .map(vote => {
                                        return {
                                            type: 'vote',
                                            date: moment(vote.voting_time).unix(),
                                            y: null,
                                            vote: vote
                                        };
                                    })
                                    .value()
                            };
                        })
                        .each(item => {
                            item.votesData = _.filter(item.votesData, );
                        })
                        .value()
                }
            });

            console.log(resList);
            // return;

            let res = resList[0];

            let resLine = _(res.chartData)
                .map(item => [].concat(item.reviewData, item.votesData))
                .flatten()
                .sortBy(['date'])
                .value();

            _.each(resLine, timeItem => {
                // console.log('TIME POINT', timeItem.date);

                let iterationReviews = _(res.chartData).filter(item => item.reviewData.date <= timeItem.date).map(item => _.clone(item)).value();
                
                _.each(iterationReviews, item => {
                    item.votesData = _.filter(item.votesData, voteData => voteData.date <= timeItem.date);
                });

                let totalVotesWeight = _.reduce(iterationReviews, (acc, item) => {
                    return acc + _.reduce(item.votesData, (sum, voteData) => sum + voteData.vote.weight, 0);
                }, 0);

                let averageExpertise = _.reduce(iterationReviews, (acc, item) => {
                    return acc + item.reviewData.review.expertise_amounts_used.find(expertise => expertise[0] === res.discipline.id)[1];
                }, 0) / iterationReviews.length;

                // console.log(iterationReviews);

                // console.log(totalVotesWeight);
                // console.log(averageExpertise);

                console.log('PARTS')

                let iterationEci = _.reduce(iterationReviews, (acc, item) => {
                    let mr = item.reviewData.review.is_positive ? 1 : -1;
                    let er = item.reviewData.review.expertise_amounts_used.find(expertise => expertise[0] === res.discipline.id)[1];
                    let vr = _.reduce(item.votesData, (sum, voteData) => sum + voteData.vote.weight, 0);
                    let itemRes = mr * er * (er / averageExpertise + 10 * (1 - 1 / iterationReviews.length) * vr / (totalVotesWeight || 1));

                    // console.log(itemRes);
                    // if (iterationReviews.length === 4) {
                    //     // debugger;
                    // }

                    return acc + itemRes;
                }, 0);

                console.log('iterationEci', iterationEci);

                timeItem.y = Math.round(iterationEci);
            });

            console.log(res);
            console.log(resLine);

            ////////////////////////
            
            let component = this;

            let chartData = res.chartData;
            let lineChartData = resLine;

            let margin = { top: 20, right: 20, bottom: 30, left: 40 },
                width = 850,
                height = 400;

            let minX = d3.min(lineChartData, d => d.date);
            let maxX = d3.max(lineChartData, d => d.date);
            let xScale = d3.scaleLinear()
                .rangeRound([0, width])
                .domain([ minX - 0.02 * (maxX - minX), maxX ]);

            let minReviewWeight = _.minBy(chartData, item => item.reviewData.weight).reviewData.weight;
            let maxReviewWeight = _.maxBy(chartData, item => item.reviewData.weight).reviewData.weight;
            let minLineY = d3.min(lineChartData, d => d.y);
            let maxLineY = d3.max(lineChartData, d => d.y);
            let minY = minReviewWeight > 0 && minLineY > 0 ? 0 : minReviewWeight > minLineY ? minLineY : minReviewWeight;
            let maxY = maxReviewWeight < 0 && maxLineY < 0 ? 0 : maxReviewWeight > maxLineY ? maxReviewWeight : maxLineY;
            let yScale = d3.scaleLinear()
                .rangeRound([height, 0])
                .domain([ minY - 0.02 * (maxY - minY), maxY ]);
            
            let dynamicTooltip = d3.select("#d3-chart").select('.dynamic-tooltip');

            let svg = d3.select("#d3-chart")
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
                    ? `${window.env.DEIP_SERVER_URL}/public/files/avatars/${d.reviewData.review.author.profile.avatar}?width=24&height=24&noCache=true`
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

            // axis-x
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(
                    d3.axisBottom(xScale)
                        .ticks(10, "s")
                        .tickFormat(unix => moment.unix(unix).format('DDD MMM HH:mm'))
                );

            window.d3 = d3;

            // axis-y
            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(yScale));

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
                .attr("r", 3);
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

    .bar { fill: steelblue; }
    // .bar:hover {fill: orange; }
    // .axis--x path { display: none; }
    .line {
        fill: none;
        stroke: royalblue;
        stroke-width: 1;
    }

    .review-dot + .vote-dots {
        display: none;
    }

    .review-dot:hover {
        stroke: orange;
        stroke-width: 2;
    }
    .review-dot:hover + .vote-dots {
        display: inline;

        .vote-dot { fill: orange; }
    }

    .review-dot.highlighted {
        stroke: red;
        stroke-width: 2;
    }
    .review-dot.highlighted + .vote-dots {
        display: inline;
        
        .vote-dot { fill: red; }
    }
</style>
