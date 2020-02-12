<template>
<div>
  <div class="pb-2">
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
  
  <div class="pb-2">
    <review-assessment v-model="reviewRatings" :researchContentType="content.content_type"></review-assessment>
  </div>

  <div v-if="review.author.account.name !== user.username && userHasExpertise">
    <div>
      <v-btn block color="primary"
        :loading="isReviewVoting" 
        :disabled="isReviewVoting || userHasVoted || votingDisabled"
        @click="voteReview()">
        Support Review
      </v-btn>
    </div>

    <div class="pt-2" v-if="!userHasVoted">
      <div>You will get <span class="body-2">approximately 1000 ECI reward in {{userRelatedExpertise.map(exp => exp.discipline_name).join(", ")}}</span> for your contribution to this project</div>
    </div>
  </div>

  <div v-if="review.votes.length">
    <div class="subheading bold py-4">Supporters: {{review.votes.length}}</div>
    <v-layout row v-for="(vote, i) in review.votes" :key="`curator-${i}`" :class="{ 'pb-1': i == 0, 'py-1': i != 0 }">
      <div>
        <platform-avatar 
          :user="vote.voterProfile"
          :size="40"
          link-to-profile
          link-to-profile-class="pl-2"
        ></platform-avatar>
      </div>
    </v-layout>
  </div>

  <div class="pt-2">
    <v-layout row justify-space-between align-baseline>
      <div class="half-bold align-self-center">Date Added:</div>
      <div class="py-2">
        <v-icon color="grey" small>event</v-icon>
        <span>{{moment(review.created_at).format("D MMM YYYY")}}</span>
      </div>
    </v-layout>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import deipRpc from '@deip/deip-oa-rpc-client';
import * as disciplineTreeService from '../../common/disciplines/DisciplineTreeService'; 

export default {
  name: "ResearchContentReviewSidebar",
  data() {
    return {
      isReviewVoting: false,
      votingDisabled: false,
      reviewRatings: {}
    };
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      userExperise: 'auth/userExperise',
      research: 'rcd/research',
      content: 'rcd/content',
      contentReviewsList: 'rcd/contentReviewsList',
    }),
    review() {
      return this.contentReviewsList.find(r => r.id == this.$route.params.review_id)
    },
    userHasExpertise() {
      return this.userExperise.some(exp => this.research.disciplines.some(d => d.id == exp.discipline_id))
    },
    userHasVoted() {
      return this.review.votes.some(vote => vote.voter === this.user.username);
    },
    userRelatedExpertise() {
      return this.userExperise.filter(exp => this.research.disciplines.some(d => d.id == exp.discipline_id))
    }
  },
  
  methods: {
      voteReview() {
        const self = this;
        const review = this.review;
        this.isReviewVoting = true;
        // vote for all disciplines for now
        // todo: add a control to select specific discipline
        const disciplinesIds = this.userExperise
            .map(exp => exp.discipline_id)
            .filter(id => review.disciplines.find(d => d.id === id));
    
          // I have no idea why, but "deipRpc.broadcast.voteForReviewAsync" doesn't work here, 
          // the promise just never gets resolved or rejected although operation is sent and applied in the blockchain.
          // Possibly there is a bug in 'deipRpc', needs to be reviewed later.
        deipRpc.api.getDynamicGlobalProperties(function(err, result) {
          if (!err) {
            const BlockNum = (result.last_irreversible_block_num - 1) & 0xFFFF;
            deipRpc.api.getBlockHeader(result.last_irreversible_block_num, function(e, res) {
              const BlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
              const now = new Date().getTime() + 3e6;
              const expire = new Date(now).toISOString().split('.')[0];
      
              const operations = disciplinesIds.map(disciplinesId => {
                return ["vote_for_review", {
                  voter: self.user.username,
                  review_id: review.id,
                  discipline_id: disciplinesId,
                  weight: self.DEIP_100_PERCENT
                }]
              });
              const unsignedTX = {
                'expiration': expire,
                'extensions': [],
                'operations': operations,
                'ref_block_num': BlockNum,
                'ref_block_prefix': BlockPrefix
              }

              try {
                const signedTX = deipRpc.auth.signTransaction(unsignedTX, {
                  "owner":  self.user.privKey
                })

                deipRpc.api.broadcastTransactionSynchronous(signedTX, function(err, result) {
                  self.isReviewVoting = false;
                  if (err) {
                    self.$store.dispatch('layout/setError', { message: "An error occurred while voting for review, please try again later"});
                    console.log(err);
                  } else {
                    self.votingDisabled = true;
                    self.$store.dispatch('rcd/loadContentReviews', { researchContentId: self.content.id });
                    self.$store.dispatch('layout/setSuccess', { message: "You've voted for review successfully!"});
                  }
                });
              } catch (err) {
                self.$store.dispatch('layout/setError', { message: "An error occurred while voting for review, please try again later"});
                console.log(err);
              }
            });
          }
        });
      }
  },
  created() {
    this.reviewRatings = this.$options.filters.reviewRatings(this.review.content);
  }
};
</script>

<style lang="less" scoped>
    .eci-item {
        border: 1px solid #e4e4e4;
        border-radius: 3px;
    }
    .eci-label {
       color: #818181;
    }
</style>
