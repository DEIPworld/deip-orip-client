<template>
    <div>
        <div class="c-mb-8" v-if="research">
            <router-link class="a title" 
                :to="{
                    name: 'ResearchContentDetails',
                    params: {
                        research_group_permlink: encodeURIComponent(research.group_permlink),
                        research_permlink: encodeURIComponent(research.permlink),
                        content_permlink: encodeURIComponent(content.permlink)
                    }
                }"
            >{{ content.title }}</router-link>
        </div>

        <div class="legacy-row legacy-justify-center mb-4">
            <div>
                <span class="c-pr-2">
                    <v-btn class="ma-0" 
                        :dark="isPositive === true" 
                        :color="isPositive === true ? 'green darken-2' : undefined" 
                        small depressed
                        @click="isPositive = true"
                    >Approve</v-btn>
                </span>
                <span>
                    <v-btn class="ma-0" 
                        :dark="isPositive === false" 
                        :color="isPositive === false ? 'red darken-2' : undefined" 
                        small depressed
                        @click="isPositive = false"
                    >Reject</v-btn>
                </span>
            </div>
        </div>
        
        <v-layout row justify-space-between align-center class="my-2 py-2">
          Novelty:&nbsp;<squared-rating v-model="novelty" />
        </v-layout>
        <v-layout row justify-space-between align-center class="my-2 py-2">
          Technical Quality:&nbsp;<squared-rating v-model="technicalQuality" />
        </v-layout>
        <v-layout row justify-space-between align-center class="my-2 py-2">
          Methodology:&nbsp;<squared-rating v-model="methodology" />
        </v-layout>

        <div class="legacy-row legacy-justify-center c-mt-10 c-mb-10">
            <div>
                <v-btn color="primary" class="width-9"
                        @click="publishReview()"
                        :disabled="isReviewPublishingDisabled"
                        :loading="isLoading"
                >Publish</v-btn>
            </div>
        </div>

        <div class="c-mt-5">
            <v-card class="c-p-8">
                <div class="bold subheading c-pb-2">Related Expertise Tokens:</div>
                <div class="c-pt-4" v-for="(exp, index) in relatedExpertise" :key="index">
                    <span>{{exp.discipline_name}}</span>
                    <span class="right half-bold">{{exp.amount}}</span>
                </div>
            </v-card>
            <div class="orange--text c-pt-4 text-align-center">
                <v-icon color="orange">warning</v-icon>
                100% of your Expertise Tokens will be locked for 24 hours after you will have published the review
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';
import deipRpc from '@deip/deip-oa-rpc-client';
import { makeReview } from './../../../services/ReviewsService'
import { bus } from './../../../main';

export default {
    name: "ResearchContentAddReviewSidebar",
    data() {
      return {
        isPositive: true,
        isLoading: false,

        novelty: 0,
        technicalQuality: 0,
        methodology: 0,
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise',
        content: 'rcd/content',
        research: 'rcd/research'
      }),
      relatedExpertise() {
        return this.userExperise.filter(exp => this.research.disciplines.find(d => d.id == exp.discipline_id));
      },
      isReviewPublishingDisabled() {
        return !this.novelty || !this.technicalQuality || !this.methodology;
      }
    },

    methods: {
      publishReview() {
        bus.$emit('reviewEditor:exportHtml', (html) => {
          this.isLoading = true;
          const reviewData = JSON.stringify({
            html,
            ratings: {
              novelty: this.novelty,
              technicalQuality: this.technicalQuality,
              methodology: this.methodology,
            }
          });

          makeReview(this.content.id, this.isPositive, reviewData)
            .then((data) => {
              this.$store.dispatch('layout/setSuccess', {
                message: "Your review has been published successfully !"
              });
              this.$router.push({ 
                name: 'ResearchContentDetails',
                params:  {
                    research_group_permlink: encodeURIComponent(this.research.group_permlink), 
                    research_permlink: encodeURIComponent(this.research.permlink),
                    content_permlink: encodeURIComponent(this.content.permlink)
                },
                hash: "#reviews"
              });
          })
          .catch((err) => {
            console.log(err);
            this.$store.dispatch('layout/setError', {
              message: "An error occurred while adding review, please try again later"
            });
          })
          .finally(() => {
            this.isLoading = false
          });
        });
      }
    }
};
</script>

<style lang="less" scoped>
</style>
