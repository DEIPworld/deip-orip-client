<template>
  <div>
    <div class="ma-0">
      <router-link class="a title" 
        :to="{ 
          name: 'ResearchDetails', 
          params: { 
            research_group_permlink: encodeURIComponent(research.group_permlink),
            research_permlink: encodeURIComponent(research.permlink)
          }}">
        {{ research.title }}
      </router-link>
    </div>

    <!-- ### START Research Application Applicants Section ### -->
    <div class="c-mt-4">
      <div class="sidebar-fullwidth"><v-divider></v-divider></div>
      <div class="subheading bold c-mt-4">Applicants</div>

      <div class="legacy-row-nowrap legacy-justify-between align-center c-pt-2 c-pb-2" v-for="(author, index) in membersList" :key="index">
        <div>
          <v-avatar size="40px">
            <img v-if="author.profile" v-bind:src="author.profile.avatar | avatarSrc(80, 80, false)" />
            <v-gravatar v-else :title="author.account.name" :email="author.account.name + '@deip.world'" />
          </v-avatar>
          <router-link class="a c-pl-3" :to="{ name: 'UserDetails', params: { account_name: author.account.name } }">
            {{ author | fullname }}
          </router-link>
        </div>
      </div>
    </div>
    <!-- ### END Research Application Applicants Section ### -->

    <!-- ### START Research Applications Review Section ### -->
    <div class="c-mt-4">
      <div class="sidebar-fullwidth"><v-divider></v-divider></div>
    <!--  <div class="subheading bold c-mt-4">
        Reviews: 
        <span class="green--text text--darken-2">{{positiveReviewsCount}}</span> / 
        <span class="red--text text--darken-2">{{negativeReviewsCount}}</span> 
      </div> -->
      <div class="subheading bold c-mt-4">
        <div class="c-pb-2">{{program.agency_name.toUpperCase()}} Reviews: <span>{{applicationReviewsList.length}}</span></div>
        <div class="grey--text" v-if="thirdpartyApplicationsReviewsList.length">Other Reviews: <span>{{thirdpartyApplicationsReviewsList.length}}</span></div>
      </div>
    <!--  <div class="c-pt-3">
        <div class="caption">
          <v-icon small class="c-pr-2">rate_review</v-icon>
          Reward for review: 
          <span class="bold">{{convertToPercent(research.review_share_in_percent)}}%</span>
        </div>
      </div> -->
      <div v-if="isCreatingReviewAvailable" class="c-mt-4">
        <v-btn @click="goAddReview()" dark round outline color="primary" class="full-width ma-0">
          <v-icon small>add</v-icon>
          <div class="legacy-col-grow add-review-label">
            Add a review
          <!--  <span class="caption grey--text">
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
    import deipRpc from '@deip/deip-oa-rpc-client';

    export default {
        name: "ResearchApplicationDetailsSidebar",
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
            applicationRef: 'rad/applicationRef',
          }),
          isReviewCommitteeMember() {
            return this.program != null 
              ? this.$store.getters['auth/userIsResearchGroupMember'](this.program.review_committee_id) 
              : false
          },
          isCreatingReviewAvailable() {
            const userHasReview = this.applicationReviewsList.some(r => r.author.account.name === this.user.username);
            return this.isReviewCommitteeMember && !userHasReview;
          },
          positiveReviewsCount() {
            return this.allApplicationsReviewsList.filter(r => r.is_positive).length;
          },
          negativeReviewsCount() {
            return this.allApplicationsReviewsList.filter(r => !r.is_positive).length;
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
