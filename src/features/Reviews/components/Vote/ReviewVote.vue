<template>
  <div class="text-body-2">
    <div v-if="isGroupMember">
      {{ $t('reviews.notMembers') }}
    </div>

    <div v-else-if="!userHasProjectExpertise">
      {{
        $hasModule(DEIP_MODULE.APP_ECI)
          ? $t('reviews.canSupport', { domains: review.domains.map(d => d.name).join(', ') })
          : ''
      }}
    </div>

    <div v-else-if="isAuthor">
      {{ $t('reviews.notSuppOwnRev') }}
    </div>

    <div v-else-if="!userHasVoted">
      {{
        $hasModule(DEIP_MODULE.APP_ECI)
          ? $t('reviews.eciForContribution', { domains: userRelatedExpertise.map(exp => exp.domainName).join(', ') })
          : ''
      }}
    </div>

    <div v-else-if="userHasVoted">
      {{ $t('reviews.once') }}
    </div>
    <v-btn
      v-if="!(loading || disabled || userHasVoted || isGroupMember || !userHasProjectExpertise || isAuthor)"
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
  import { ReviewService } from '@deip/review-service';

  const reviewService = ReviewService.getInstance();

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

      userHasProjectExpertise() {
        return this.userExperise.some((exp) => exp.amount > 0 && this.review.domains.some((d) => d === exp.domainId));
      },
      userHasVoted() {
        return this.review.votes.some((vote) => vote.upvoter === this.$currentUser.username);
      },
      userRelatedExpertise() {
        return this.userExperise.filter((exp) => exp.amount > 0 && this.review.domains.some((d) => d === exp.domainId));
      },
      isGroupMember() {
        return this.members.some((user) => user.account.name === this.$currentUser.username);
      },
      isAuthor() {
        return this.review.author === this.$currentUser.username;
      }
    },

    methods: {
      voteReview() {
        const { review } = this;
        this.loading = true;

        // vote for all domains for now
        const domainsIds = this.userRelatedExpertise
          .map((exp) => exp.domainId);

        const votesPromises = domainsIds
          .map((domainId) => reviewService.upvoteReview({
            initiator: {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
            },
            reviewId: review.id,
            domainId,
            weight: '100.00 %'
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
