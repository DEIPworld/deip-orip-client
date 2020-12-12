<template>
  <div class="text-body-2">
    <v-btn
      v-if="!(loading || disabled || userHasVoted || isGroupMember || !userHasResearchExpertise)"
      block
      color="primary"
      small
      text
      class="mb-2 text-body-2"
      :loading="loading"
      @click="voteReview()"
    >
      Support Review
    </v-btn>

    <div v-if="isGroupMember">
      Review can be supported only by members of other teams
    </div>

    <div v-else-if="!userHasResearchExpertise">
      Users with expertise in <span>{{
        review.disciplines.map(d => d.name)
          .join(', ')
      }}</span>
      can support this review only
    </div>

    <div v-else-if="!userHasVoted">
      You will get
      <span>approximately 1000 ECI reward in {{
        userRelatedExpertise.map(exp => exp.discipline_name)
          .join(', ')
      }}</span>
      for your contribution to this project
    </div>

    <div v-else-if="userHasVoted">
      Review can be supported once
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();

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
        return this.review.votes.some((vote) => vote.voter === this.$currentUserName);
      },
      userRelatedExpertise() {
        return this.userExperise.filter((exp) => exp.amount > 0 && this.review.disciplines.some((d) => d.id === exp.discipline_id));
      },
      isGroupMember() {
        return this.members.some((item) => item.groupTokens.owner === this.$currentUserName);
      }
    },

    methods: {
      voteReview() {
        const { review } = this;
        this.loading = true;

        // vote for all disciplines for now
        const disciplinesExternalIds = this.userRelatedExpertise
          .map((exp) => exp.discipline_external_id);

        const votesPromises = disciplinesExternalIds
          .map((disciplineExternalId) => researchContentReviewsService.voteForReview(this.$currentUser.privKey, {
            voter: this.$currentUserName,
            reviewExternalId: review.externalId,
            disciplineExternalId,
            weight: '100.00 %',
            extensions: []
          }));

        Promise.all(votesPromises)
          .then(() => {
            this.$notifier.showSuccess('Review supported');
            this.$emit('vote');
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('An error occured, please try again later');
          })
          .finally(() => {
            this.loading = false;
            this.disabled = true;
          });
      }
    }
  };
</script>
