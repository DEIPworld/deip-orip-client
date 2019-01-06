<template>
  <div>
    <div class="ma-0">
      <router-link class="a sm-title" 
        :to="{ 
          name: 'ResearchDetails', 
          params: { 
            research_group_permlink: encodeURIComponent(research.group_permlink),
            research_permlink: encodeURIComponent(research.permlink)
          }}">
        {{ research.title }}
      </router-link>
    </div>

    <div v-if="isGrantor && isApplicationPending" class="c-mt-4">
      <div class="sidebar-fullwidth"><v-divider></v-divider></div>
      <div class="c-mt-4">
        <v-btn block flat color="primary" @click="approveApplication()" :loading="isApproveBtnLoading">Approve Application</v-btn>
        <v-btn block flat color="error" @click="rejectApplication()" :loading="isRejectBtnLoading">Reject Application</v-btn>
      </div>
    </div>

    <div v-if="!isApplicationPending" class="c-mt-4">
      <div class="sidebar-fullwidth"><v-divider></v-divider></div>
      <div class="text-align-center c-mt-4">
          <span class="sm-title green--text text--darken-2" v-if="isApplicationApproved">Approved</span>
          <span class="sm-title red--text text--darken-2" v-if="isApplicationRejected">Rejected</span>
      </div>
    </div>  

    <!-- ### START Research Application Applicants Section ### -->
    <div class="c-mt-4">
      <div class="sidebar-fullwidth"><v-divider></v-divider></div>
      <div class="subheading bold c-mt-4">Applicants</div>

      <div class="row-nowrap justify-between align-center c-pt-2 c-pb-2" v-for="(author, index) in membersList" :key="index">
        <div>
          <v-avatar size="40px">
            <img v-if="author.profile" v-bind:src="author.profile.avatar | avatarSrc(40, 40, false)" />
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
      <div class="subheading bold c-mt-4">
        Reviews: 
        <span class="green--text text--darken-2">{{positiveReviewsCount}}</span> / 
        <span class="red--text text--darken-2">{{negativeReviewsCount}}</span> 
      </div>
      <div class="c-pt-3">
        <div class="caption">
          <v-icon small class="c-pr-2">rate_review</v-icon>
          Reward for review: 
          <span class="bold">{{convertToPercent(research.review_share_in_percent)}}%</span>
        </div>
      </div>
      <div v-if="isCreatingReviewAvailable" class="c-mt-4">
        <v-btn @click="goAddReview()" dark round outline color="primary" class="full-width ma-0">
          <v-icon small>add</v-icon>
          <div class="col-grow add-review-label">
            Add a review
            <span class="caption grey--text">
                reward {{convertToPercent(research.review_share_in_percent)}}%
            </span>
          </div>
        </v-btn>
      </div>
    </div>
    <!-- ### END Research Applications Review Section ### -->
  </div>

</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "ResearchApplicationDetailsSidebar",
        data() {
          return {
            isApproveBtnLoading: false,
            isRejectBtnLoading: false
          };
        },
        computed: {
          ...mapGetters({
            user: 'auth/user',
            isGrantor: 'auth/isGrantor',
            userExperise: 'auth/userExperise',
            application: 'rad/application',
            research: 'rad/research',
            membersList: 'rad/membersList',
            applicationReviewsList: 'rad/applicationReviewsList',
            applicationRef: 'rad/applicationRef',
          }),
          isResearchGroupMember() {
            return this.research != null 
              ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
              : false
          },
          isApplicationApproved() {
            return this.application && this.application.status === 'application_approved';
          },
          isApplicationRejected() {
            return this.application && this.application.status === 'application_rejected';
          },
          isApplicationPending() {
            return this.application && this.application.status === 'application_pending';
          },
          userHasExpertise() {
            return this.userExperise != null && this.research != null
              ?  this.userExperise.some(exp => this.research.disciplines.some(d => d.id == exp.discipline_id))
              : false
          },
          isCreatingReviewAvailable() {
            const userHasReview = this.applicationReviewsList.some(r => r.author.account.name === this.user.username);
            return !this.isResearchGroupMember && !userHasReview && this.userHasExpertise;
          },
          positiveReviewsCount() {
            return this.applicationReviewsList.filter(r => r.is_positive).length;
          },
          negativeReviewsCount() {
            return this.applicationReviewsList.filter(r => !r.is_positive).length;
          }
        },
        methods: {
          userHasExpertiseInDiscipline(discipline) {
            return this.userExperise != null && this.research != null
              ? this.userExperise.some(exp => exp.discipline_id == discipline.id)
              : false
          },
          approveApplication() {
            this.isApproveBtnLoading = true;
            deipRpc.broadcast.approveGrantApplicationAsync(
              this.user.privKey, 
              this.application.id, 
              this.user.username
            ).then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: "Application has been approved successfully"
              });
              this.$store.dispatch('rad/setApplicationStatus', { status: "application_approved" });
            }).catch(e => {
                this.$store.dispatch('layout/setError', {
                    message: "An error occured while approving application, please try again later"
                });
                console.log(e);
            }).finally(() => {
                this.isApproveBtnLoading = false;
            });
          },
          rejectApplication() {
            this.isRejectBtnLoading = true;
            deipRpc.broadcast.rejectGrantApplicationAsync(
              this.user.privKey, 
              this.application.id, 
              this.user.username
            ).then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: "Application has been rejected successfully"
              });
              this.$store.dispatch('rad/setApplicationStatus', { status: "application_rejected" });
            }).catch(e => {
                this.$store.dispatch('layout/setError', {
                    message: "An error occured while rejecting application, please try again later"
                });
                console.log(e);
            }).finally(() => {
                this.isRejectBtnLoading = false;
            });
          },
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
