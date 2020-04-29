<template>
  <div class="review-content-container">
    <div class="legacy-row-nowrap c-pb-4">
      <div class="text-align-center">
        <platform-avatar
          :user="review.author"
          :size="120"
        />
      </div>

      <div class="legacy-column c-ml-10">
        <div class="c-pt-4">
          <router-link class="a title" :to="{ name: 'UserDetails', params: { account_name: review.author.account.name }}">
            {{ review.author | fullname }}
          </router-link>
        </div>

        <div v-if="review.author.profile" class="c-pt-2 c-pb-1">
          <span class="caption bold">{{ review.author | employmentOrEducation }}</span>
        </div>

        <div v-if="hasLocation" class="c-pb-1">
          <v-icon small>
            location_on
          </v-icon><span class="caption"> {{ review.author | userLocation }}</span>
        </div>
      </div>
    </div>


    <div class="c-pt-5 c-pb-4 reviewed-content-container">
      <div>
        <span>
          <span v-if="review.is_positive" class="green--text text--darken-2">Approved</span>
          <span v-if="!review.is_positive" class="red--text text--darken-2">Rejected</span>
          review for
        </span>
      </div>

      <div class="c-pt-2 c-pb-2">
        <router-link
          class="a title"
          :to="{
            name: 'ResearchApplicationDetails',
            params: {
              research_group_permlink: encodeURIComponent(research.group_permlink),
              research_permlink: encodeURIComponent(research.permlink),
              application_id: application.id
            }
          }"
        >
          {{ application.title || application.letterHash.slice(0, 8) }}
        </router-link>
      </div>
    </div>

    <div v-html="review.content" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';

  export default {
    name: 'ResearchApplicationReviewBody',

    data() {
      return {
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise',
        application: 'rad/application',
        research: 'rad/research',
        applicationReviewsList: 'rad/applicationReviewsList'
      }),
      review() {
        return this.applicationReviewsList.find((r) => r.id == this.$route.params.review_id);
      },

      hasLocation() {
        return this.review && this.review.author.profile
          && this.review.author.profile.location
          && (this.review.author.profile.location.country || this.review.author.profile.location.city);
      }

    },

    mounted() {

    },

    methods: {

    }
  };
</script>

<style lang="less">

    .review-content-container {
        margin-left: 5%;
        margin-right: 5%;
    }

    .review-content-container h1, h2, h3 {
        margin-top: 1%;
        margin-bottom: 1%;
    }

    .review-content-container h4, h5, h6 {
        margin-top: 1%;
        margin-bottom: 1%;
    }

    .review-content-container p, img {
        margin-top: 1%;
        margin-bottom: 1%;
    }

    .reviewed-content-container {
        border-top: 1px solid #e4e4e4;
        border-bottom: 1px solid #e4e4e4;
    }

</style>
