<template>
  <div>
    <div>
      <v-btn
        block
        color="primary"
        :loading="isReviewVoting"
        :disabled="loading || disabled || userHasVoted || isGroupMember || !userHasResearchExpertise"
        @click="voteReview()"
      >
        Support Review
      </v-btn>
    </div>
    <div v-if="isGroupMember" class="pt-2">
      <div class="text-body-2">
        Review can be supported only by members of other groups
      </div>
    </div>
    <div v-else-if="!userHasResearchExpertise">
      Users with expertise in <span class="text-body-2">{{
        review.disciplines.map(d => d.name)
          .join(', ')
      }}</span>
      can support this review only
    </div>
    <div v-else-if="!userHasVoted" class="pt-2">
      <div>
        You will get
        <span class="text-body-2">approximately 1000 ECI reward in {{
          userRelatedExpertise.map(exp => exp.discipline_name)
            .join(', ')
        }}</span>
        for your contribution to this project
      </div>
    </div>
    <div v-else-if="userHasVoted" class="pt-2">
      <div class="text-body-2">
        Review can be supported once
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'ReviewVote',

    props: {
      review: {
        type: Object,
        default: () => ({})
      },
      members: {
        type: Array,
        default: () => ([])
      }
    },

    data() {
      return {
        loading: false,
        disabled: false
      };
    },

    computed: {
      ...mapGetters({
        userExperise: 'auth/userExperise'
      }),

      userHasResearchExpertise() {
        return this.userExperise.some((exp) => exp.amount > 0 && this.review.disciplines.some((d) => d.id === exp.discipline_id));
      },
      userHasVoted() {
        return this.review.votes.some((vote) => vote.voter === this.user.username);
      },
      userRelatedExpertise() {
        return this.userExperise.filter((exp) => exp.amount > 0 && this.review.disciplines.some((d) => d.id === exp.discipline_id));
      },
      isGroupMember() {
        return this.members.some((item) => item.rgt.owner === this.user.username);
      },
      reviewSupporters() {
        return this.review.votes.reduce((arr, vote) => (arr.some(({ voter }) => voter === vote.voter) ? arr : [...arr, vote]), []);
      }
    }
  };
</script>
