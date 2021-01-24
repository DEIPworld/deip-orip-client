<template>
  <div class="text-body-2">
    <div v-if="isGroupMember">
      {{ $t('reviews.notMembers') }}
    </div>

    <div v-else-if="!userHasResearchExpertise">
      {{
        $hasModule(DEIP_MODULE.APP_ECI)
          ? $t('reviews.canSupport', { disciplines: review.disciplines.map(d => d.name).join(', ') })
          : ''
      }}
    </div>

    <div v-else-if="isAuthor">
      {{ $t('reviews.notSuppOwnRev') }}
    </div>

    <div v-else-if="!userHasVoted">
      {{
        $hasModule(DEIP_MODULE.APP_ECI)
          ? $t('reviews.eciForContribution', { countEci: 1000, disciplines: userRelatedExpertise.map(exp => exp.discipline_name).join(', ') })
          : ''
      }}
    </div>

    <div v-else-if="userHasVoted">
      {{ $t('reviews.once') }}
    </div>
    <v-btn
      v-if="!(loading || disabled || userHasVoted || isGroupMember || !userHasResearchExpertise || isAuthor)"
      block
      color="primary"
      small
      outlined
      class="mt-2 text-body-2"
      :loading="loading"
      @click="voteReview()"
    >
      {{ $t('reviews.suppRev') }}
    </v-btn>
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
        return this.review.votes.some((vote) => vote.voter === this.$currentUser.username);
      },
      userRelatedExpertise() {
        return this.userExperise.filter((exp) => exp.amount > 0 && this.review.disciplines.some((d) => d.id === exp.discipline_id));
      },
      isGroupMember() {
        return this.members.some((item) => item.groupTokens.owner === this.$currentUser.username);
      },
      isAuthor() {
        return this.review.author === this.$currentUser.username;
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
            voter: this.$currentUser.username,
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
