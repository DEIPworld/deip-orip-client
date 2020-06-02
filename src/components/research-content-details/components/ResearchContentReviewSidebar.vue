<template>
  <div>
    <div class="pb-2">
      <router-link
        class="a title"
        :to="{
          name: 'ResearchContentDetails',
          params: {
            research_group_permlink: encodeURIComponent(research.research_group.permlink),
            research_permlink: encodeURIComponent(research.permlink),
            content_permlink: encodeURIComponent(content.permlink)
          }
        }"
      >
        {{ content.title }}
      </router-link>
    </div>

    <div class="pb-2">
      <review-assessment v-model="review.scores" :research-content-type="content.content_type" />
    </div>

    <div v-if="review.author.account.name !== user.username">
      <div>
        <v-btn
          block
          color="primary"
          :loading="isReviewVoting"
          :disabled="isReviewVoting || userHasVoted || votingDisabled || isGroupMember || !userHasExpertise"
          @click="voteReview()"
        >
          Support Review
        </v-btn>
      </div>
      <div v-if="isGroupMember" class="pt-2">
        <div class="body-2">
          Review can be supported only by members of other groups
        </div>
      </div>
      <div v-else-if="!userHasExpertise">
        Users with expertise in <span class="body-2">{{ review.disciplines.map(d => d.name).join(", ") }}</span>
        can support this review only
      </div>
      <div v-else-if="!userHasVoted" class="pt-2">
        <div>You will get <span class="body-2">approximately 1000 ECI reward in {{ userRelatedExpertise.map(exp => exp.discipline_name).join(", ") }}</span> for your contribution to this project</div>
      </div>
      <div v-else-if="userHasVoted" class="pt-2">
        <div class="body-2">
          Review can be supported once
        </div>
      </div>
    </div>

    <div v-if="reviewSupporters.length">
      <div class="subtitle-1 bold py-6">
        Supporters: {{ reviewSupporters.length }}
      </div>
      <div
        v-for="(vote, i) in reviewSupporters"
        :key="`curator-${i}`"
        class="display-flex"
        :class="{ 'pb-1': i == 0, 'py-1': i != 0 }"
      >
        <div>
          <platform-avatar
            :user="vote.voterProfile"
            :size="40"
            link-to-profile
            link-to-profile-class="pl-2"
          />
        </div>
      </div>
    </div>

    <div class="pt-2 display-flex justify-space-between">
      <div class="half-bold align-self-center">
        Date Added:
      </div>
      <div class="py-2">
        <v-icon color="grey" small>
          event
        </v-icon>
        <span>{{ moment(review.created_at).format("D MMM YYYY") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import * as disciplineTreeService from '../../common/disciplines/DisciplineTreeService';

  export default {
    name: 'ResearchContentReviewSidebar',
    data() {
      return {
        isReviewVoting: false,
        votingDisabled: false
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise',
        research: 'rcd/research',
        group: 'rcd/group',
        content: 'rcd/content',
        contentReviewsList: 'rcd/contentReviewsList',
        groupMembers: 'rcd/membersList'
      }),
      review() {
        const review = this.contentReviewsList.find((r) => r.id == this.$route.params.review_id);
        return {
          ...review,
          scores: review.scores.reduce((acc, score) => {
            acc[score[0]] = score[1];
            return acc;
          }, {})
        };
      },
      userHasExpertise() {
        return this.userExperise.some((exp) => this.review.disciplines.some((d) => d.id == exp.discipline_id));
      },
      userHasVoted() {
        return this.review.votes.some((vote) => vote.voter === this.user.username);
      },
      userRelatedExpertise() {
        return this.userExperise.filter((exp) => this.review.disciplines.some((d) => d.id == exp.discipline_id));
      },
      isGroupMember() {
        return !!this.groupMembers.find((item) => item.rgt.owner === this.user.username);
      },
      reviewSupporters() {
        return this.review.votes.reduce((arr, vote) => (arr.some(({ voter }) => voter === vote.voter) ? arr : [...arr, vote]), []);
      }
    },
    created() {
    },

    methods: {
      voteReview() {
        const self = this;
        const { review } = this;
        this.isReviewVoting = true;
        // vote for all disciplines for now
        // todo: add a control to select specific discipline
        const disciplinesIds = this.userExperise
          .map((exp) => exp.discipline_id)
          .filter((id) => review.disciplines.find((d) => d.id === id));

        // I have no idea why, but "deipRpc.broadcast.voteForReviewAsync" doesn't work here,
        // the promise just never gets resolved or rejected although operation is sent and applied in the blockchain.
        // Possibly there is a bug in 'deipRpc', needs to be reviewed later.
        deipRpc.api.getDynamicGlobalProperties((err, result) => {
          if (!err) {
            const BlockNum = (result.last_irreversible_block_num - 1) & 0xFFFF;
            deipRpc.api.getBlockHeader(result.last_irreversible_block_num, (e, res) => {
              const BlockPrefix = new Buffer(res.previous, 'hex').readUInt32LE(4);
              const now = new Date().getTime() + 3e6;
              const expire = new Date(now).toISOString().split('.')[0];

              const operations = disciplinesIds.map((disciplinesId) => ['vote_for_review', {
                voter: self.user.username,
                review_id: review.id,
                discipline_id: disciplinesId,
                weight: self.DEIP_100_PERCENT
              }]);
              const unsignedTX = {
                expiration: expire,
                extensions: [],
                operations,
                ref_block_num: BlockNum,
                ref_block_prefix: BlockPrefix
              };

              try {
                const signedTX = deipRpc.auth.signTransaction(unsignedTX, {
                  owner: self.user.privKey
                });

                deipRpc.api.broadcastTransactionSynchronous(signedTX, (err, result) => {
                  self.isReviewVoting = false;
                  if (err) {
                    this.$notifier.showError();
                    console.log(err);
                  } else {
                    self.votingDisabled = true;
                    self.$store.dispatch('rcd/loadContentReviews', { researchContentId: self.content.id });
                    this.$notifier.showSuccess('You\'ve voted for review successfully!');
                  }
                });
              } catch (err) {
                this.$notifier.showError();
                console.log(err);
              }
            });
          }
        });
      }
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
