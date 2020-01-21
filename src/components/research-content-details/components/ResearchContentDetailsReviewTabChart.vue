<template>
  <div class="c-p-5" style="min-height: 500px" v-if="chartsDataList">
    <v-tabs slot="extension" v-model="tab" grow color="primary lighten-5">
      <v-tabs-slider :color="themeSettings['tabs-slider-color']"></v-tabs-slider>
      <v-tab :class="themeSettings['tabs-text-class']" :key="'tab-' + item.discipline.id" v-for="item in chartsDataList" :disabled="false">
          {{ item.discipline.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
        <v-tab-item v-for="(item, i) in chartsDataList" :key="'tab-item-' + item.discipline.id">
          <v-card flat>
              <v-card-text>
                <research-content-details-review-chart
                  v-show="tab === i"
                  :charts-data-item="item"
                ></research-content-details-review-chart>
              </v-card-text>
          </v-card>
        </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
    import _ from 'lodash';
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import Vue from 'vue';
    import * as d3 from "d3";

    export default {
        name: "ResearchContentDetailsReviewTabChart",

        props: {
        },

        data() {
            return {
                tab: null,
                chartsDataList: null
            };
        },

        computed: {
            ...mapGetters({
                contentReviewsList: 'rcd/contentReviewsList',
                disciplinesList: 'rcd/disciplinesList',
                themeSettings: 'layout/themeSettings'
            })
        },

        mounted() {
            this.chartsDataList = _.map(this.disciplinesList, discipline => {
                return {
                    discipline: _.clone(discipline),
                    chartData: _.chain(this.contentReviewsList)
                        .cloneDeep()
                        .filter(review => review.disciplines.find(reviewDiscipline => reviewDiscipline.id === discipline.id))
                        .map(review => {
                            let weightCoef = review.is_positive ? 1 : -1;

                            return {
                                reviewData: {
                                    date: moment(review.created_at).unix(),
                                    y: null,
                                    weight: 0,
                                    review: review
                                },
                                votesData: _(review.votes)
                                    .filter(vote => vote.discipline_id === discipline.id)
                                    .map(vote => {
                                        return {
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

            _.each(this.chartsDataList, (data, disciplineI) => {
                data.lineChartData = _(data.chartData)
                    .map(item => [].concat(item.reviewData, item.votesData))
                    .flatten()
                    .sortBy(['date'])
                    .value();

                _.each(data.lineChartData, timeItem => {
                    // console.log('TIME POINT', timeItem.date);

                    let iterationReviews = _(data.chartData).filter(item => item.reviewData.date <= timeItem.date).map(item => _.clone(item)).value();
                    
                    _.each(iterationReviews, item => {
                        item.votesData = _.filter(item.votesData, voteData => voteData.date <= timeItem.date);
                    });

                    let totalVotesWeight = _.reduce(iterationReviews, (acc, item) => {
                        return acc + _.reduce(item.votesData, (sum, voteData) => sum + voteData.vote.weight, 0);
                    }, 0);

                    let averageExpertise = _.reduce(iterationReviews, (acc, item) => {
                        return acc + item.reviewData.review.expertise_amounts_used.find(expertise => expertise[0] === data.discipline.id)[1];
                    }, 0) / iterationReviews.length;


                    let iterationEci = _.reduce(iterationReviews, (acc, item) => {
                        let mr = item.reviewData.review.is_positive ? 1 : -1;
                        let er = item.reviewData.review.expertise_amounts_used.find(expertise => expertise[0] === data.discipline.id)[1];
                        let vr = _.reduce(item.votesData, (sum, voteData) => sum + voteData.vote.weight, 0);
                        let itemRes = mr * er * (1 * er / (iterationReviews.length * averageExpertise) + 1 * (1 - 1 / iterationReviews.length) * vr / (totalVotesWeight || 1));

                        if (iterationReviews.length === 4) {
                            // debugger;
                        }

                        return acc + itemRes;
                    }, 0);

                    console.log('iterationEci', iterationEci);

                    timeItem.y = Math.round(iterationEci);
                });
            });
        }
    };
</script>

<style lang="less">
    .tabs__items {
        overflow: visible;
    }
</style>
