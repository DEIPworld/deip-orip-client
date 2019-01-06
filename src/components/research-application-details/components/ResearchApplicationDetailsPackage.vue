<template>
  <div>
    <v-layout row wrap>
			<v-flex xs8>
				<div class="title c-pt-10 c-pr-10 c-pl-10">{{application.application_hash}}</div>
			</v-flex>
			<v-flex xs4 v-if="isGrantor && isApplicationPending">
				<div class="right c-pr-10 c-pt-5">
					<v-btn outline color="primary" @click="approveApplication()" :loading="isApproveBtnLoading">Approve</v-btn>
					<v-btn outline color="error" @click="rejectApplication()" :loading="isRejectBtnLoading">Reject</v-btn>
				</div>
			</v-flex>
			<v-flex offset-xs2 v-if="!isApplicationPending">
				<div class="c-pt-10">
					<div class="text-align-center">
						<span class="sm-title green--text text--darken-2" v-if="isApplicationApproved">Approved</span>
						<span class="sm-title red--text text--darken-2" v-if="isApplicationRejected">Rejected</span>
					</div>
				</div>
			</v-flex>
			<v-flex xs12>
				<div class="c-p-10">
					<v-card v-for="form in applicationRef.packageForms" :key="form.hash">
						<v-card-text>
							<a target="_blank" class="a" :href="`${fileStorageBaseUrl}/applications/files/${applicationRef.agency}/${applicationRef.foaId}/${applicationRef.hash}/${form.hash}`">
									{{form.filename}}
							</a>
							<span class="right body-2 grey--text">{{form.hash.slice(0, 8)}}</span>
						</v-card-text>
					</v-card>
				</div>
			</v-flex>
        <v-flex xs10 offset-xs1>
					<!-- START Research Content Reviews section -->
					<div class="c-pt-5 sidebar-fullwidth"><v-divider></v-divider></div>
					<div class="c-pt-5 c-pb-10" v-if="allApplicationsReviewsList.length">
						<div id="appliation-reviews">
							<div class="c-pt-2 title">Reviews: {{ allApplicationsReviewsList.length }}</div>
							<div class="c-pt-6">
								<application-review-list-item v-for="(review, i) in allApplicationsReviewsList" :review="review" :key="'review-' + i"></application-review-list-item>
							</div>
						</div>
					</div>
					<!-- END Research Content Reviews section -->
			</v-flex>
    </v-layout>
  </div>

</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "ResearchApplicationDetailsPackage",
        data() {
          return {
            fileStorageBaseUrl: window.env.DEIP_SERVER_URL,
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
            allApplicationsReviewsList: 'rad/allApplicationsReviewsList',
            applicationRef: 'rad/applicationRef',
          }),
          isApplicationApproved() {
            return this.application && this.application.status === 'application_approved';
          },
          isApplicationRejected() {
            return this.application && this.application.status === 'application_rejected';
          },
          isApplicationPending() {
            return this.application && this.application.status === 'application_pending';
          },
        },
        methods: {
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
          }
        }
    };
</script>

<style lang="less" scoped>

</style>
