<template>
  <div>
    <div class="ma-0">
      <router-link
        class="a title"
        :to="{
          name: 'ResearchDetails',
          params: {
            research_group_permlink: encodeURIComponent(research.research_group.permlink),
            research_permlink: encodeURIComponent(research.permlink)
          }}"
      >
        {{ research.title }}
      </router-link>
    </div>

    <!-- ### START Research Application Applicants Section ### -->
    <div class="c-mt-4">
      <div class="sidebar-fullwidth">
        <v-divider />
      </div>
      <div class="text-subtitle-1 bold c-mt-4">
        Applicants
      </div>

      <div v-for="(author, index) in membersList" :key="index" class="legacy-row-nowrap legacy-justify-between align-center c-pt-2 c-pb-2">
        <div>
          <platform-avatar
            :user="author"
            :size="40"
            link-to-profile
            link-to-profile-class="px-1"
          />
        </div>
      </div>
    </div>
    <!-- ### END Research Application Applicants Section ### -->

    <!-- ### START Research Applications Review Section ### -->
    <div class="c-mt-4">
      <div class="sidebar-fullwidth">
        <v-divider />
      </div>
      <!--  <div class="text-subtitle-1 bold c-mt-4">
        Reviews:
        <span class="green--text text--darken-2">{{positiveReviewsCount}}</span> /
        <span class="red--text text--darken-2">{{negativeReviewsCount}}</span>
      </div> -->
      <div class="text-subtitle-1 bold c-mt-4">
        <div class="c-pb-2">
          {{ program.agency_name.toUpperCase() }} Reviews: <span>{{ applicationReviewsList.length }}</span>
        </div>
        <div v-if="thirdpartyApplicationsReviewsList.length" class="grey--text">
          Other Reviews: <span>{{ thirdpartyApplicationsReviewsList.length }}</span>
        </div>
      </div>
      <div v-if="isCreatingReviewAvailable" class="c-mt-4">
        <v-btn
          dark
          outlined
          color="primary"
          class="full-width ma-0"
          @click="goAddReview()"
        >
          <v-icon small>
            add
          </v-icon>
          <div class="legacy-col-grow add-review-label">
            Add a review
          <!--  <span class="text-caption grey--text">
                reward {{convertToPercent(research.review_share_in_percent)}}%
            </span> -->
          </div>
        </v-btn>
      </div>
    </div>
    <!-- ### END Research Applications Review Section ### -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';

  export default {
    name: 'ResearchApplicationDetailsSidebar',
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
        program: 'rad/program',
        membersList: 'rad/membersList',
        allApplicationsReviewsList: 'rad/allApplicationsReviewsList',
        applicationReviewsList: 'rad/applicationReviewsList',
        thirdpartyApplicationsReviewsList: 'rad/thirdpartyApplicationsReviewsList',
        applicationRef: 'rad/applicationRef'
      }),
      isReviewCommitteeMember() {
        return this.program != null
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.program.review_committee_id)
          : false;
      },
      isCreatingReviewAvailable() {
        const userHasReview = this.applicationReviewsList.some((r) => r.author.account.name === this.user.username);
        return this.isReviewCommitteeMember && !userHasReview;
      },
      positiveReviewsCount() {
        return this.allApplicationsReviewsList.filter((r) => r.is_positive).length;
      },
      negativeReviewsCount() {
        return this.allApplicationsReviewsList.filter((r) => !r.is_positive).length;
      }
    },
    methods: {
      goAddReview() {
        this.$router.push({ name: 'ResearchApplicationAddReview', params: this.$route.params });
      }
    }
  };
</script>

<style lang="less" scoped>
  .add-review-label {
      text-transform: none;
  }
</style>
