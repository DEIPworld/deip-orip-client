<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Share reward with reviewers
      </div>
      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="research-reward-max-width mx-auto">
          <div>
            How much reward would you like to share with reviewers?
            The bigger the percent is, the better chance of getting reviews and increasing research popularity you have.
            You can choose between 0-50%
          </div>
          <v-text-field
            v-model="reviewShare"
            suffix="%"
            mask="##"
            hide-details
            @keyup="setReviewShare"
          />

          <div v-if="reviewShare" class="pt-8 caption grey--text">
            {{ reviewShare }}% of potential research reward will be shared between all
            the reviewers according to their Review Index
          </div>
        </div>
      </div>
    </div>

    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>Back
        </v-btn>
        <v-btn
          color="primary"
          :disabled="nextDisabled"
          :loading="isLoading"
          @click.native="finish()"
        >
          {{ !isCentralizedGroup ? 'Create Proposal' : 'Create Project' }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'CreateResearchShare',

    props: {
      research: { type: Object, required: true },
      isLoading: { type: Boolean, required: true }
    },

    data() {
      return {
        reviewShare: this.research.review_share_in_percent // default
      };
    },

    computed: {
      ...mapGetters({
        userPersonalGroup: 'auth/userPersonalGroup'
      }),
      nextDisabled() {
        return (
          !this.research.review_share_in_percent
          || !(
            this.research.review_share_in_percent >= 0
            && this.research.review_share_in_percent <= 50
          )
          || this.isLoading
        );
      },
      isCentralizedGroup() {
        return this.research.group.is_centralized || this.research.group.is_personal;
      }
    },

    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },
      setReviewShare() {
        this.$emit('setReviewShare', this.reviewShare);
      },
      finish() {
        this.$emit('finish');
      }
    }
  };
</script>

<style lang="less" scoped>
.research-reward-max-width {
  max-width: 510px;
}
</style>
