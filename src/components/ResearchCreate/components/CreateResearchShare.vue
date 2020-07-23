<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">
      <div class="text-h5 text-center mb-3">
        Share reward with reviewers
      </div>
      <div>
        <div>
          How much reward would you like to share with reviewers?
          The bigger the percent is, the better chance of getting reviews and increasing research popularity you have.
          You can choose between 0-50%
        </div>
        <v-text-field
          v-model="reviewShare"
          suffix="%"
          outlined dense
          mask="##"
          hide-details
          @keyup="setReviewShare"
        />

        <div v-if="reviewShare" class="pt-8 caption grey--text">
          {{ reviewShare }}% of potential research reward will be shared between all
          the reviewers according to their Review Index
        </div>
      </div>

      <div class="text-center py-4">
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
    </v-col>
  </v-row>
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
