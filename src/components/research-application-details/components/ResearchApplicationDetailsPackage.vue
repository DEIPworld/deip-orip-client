<template>
  <div>
    <v-layout row wrap>
			<v-flex xs8>
				<div class="title c-pb-10">{{application.title}}</div>
			</v-flex>
			<v-flex xs4 v-if="isGrantor && isApplicationPending">
				<div class="right">
					<v-btn outline color="primary" @click="approveApplication()" :loading="isApproveBtnLoading">Approve</v-btn>
					<v-btn outline color="error" @click="rejectApplication()" :loading="isRejectBtnLoading">Reject</v-btn>
				</div>
			</v-flex>
			<v-flex offset-xs2 v-if="!isApplicationPending">
				<div>
					<div class="right">
						<span class="sm-title green--text text--darken-2" v-if="isApplicationApproved">Approved</span>
						<span class="sm-title red--text text--darken-2" v-if="isApplicationRejected">Rejected</span>
					</div>
				</div>
			</v-flex>
			<v-flex xs8>
				<div class="left">
					<router-link class="subheading deip-blue-color"  style="text-decoration: none"
							:to="{ name: 'AgencyProgramDetails', 
									params: { 
										agency: program.agency_name, 
										foa: program.funding_opportunity_number }}">
							{{ program.funding_opportunity_number + ' ' + program.funding_opportunity_title }}
					</router-link>
				</div>
			</v-flex>
			<v-flex xs4>
				<div class="subheading c-pb-5 right">Total amount: $ {{fromAssetsToFloat(application.total_amount)}}</div>
			</v-flex>
			<v-flex xs12>
				<div>
					<div class="subheading c-pt-5 c-pb-5">Application: <span class="caption grey--text">({{application.letterHash}})</span></div>
					<v-card>
						<v-card-text>
							<a target="_blank" class="a" :href="`${fileStorageBaseUrl}/applications/files/${applicationRef.agency}/${applicationRef.foaId}/${applicationRef.hash}/${applicationContent.hash}`">
									{{applicationContent.filename}}
							</a>
							<span class="right body-2 grey--text">{{applicationContent.hash.slice(0, 8)}}</span>
						</v-card-text>
					</v-card>
				</div>
			</v-flex>
			<v-flex xs12>
				<div>
					<div class="subheading c-pt-5 c-pb-5">Package: <span class="caption grey--text">({{application.packageHash}})</span></div>
					<v-card v-for="form in formsContent" :key="form.hash">
						<v-card-text>
							<a target="_blank" class="a" :href="`${fileStorageBaseUrl}/applications/files/${applicationRef.agency}/${applicationRef.foaId}/${applicationRef.hash}/${form.hash}`">
									{{form.filename}}
							</a>
							<span class="right body-2 grey--text">{{form.hash.slice(0, 8)}}</span>
						</v-card-text>
					</v-card>
				</div>
			</v-flex>
        <v-flex xs12>
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
    import applicationsHttp from './../../../services/http/application';

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
						program: 'rad/program',
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
					applicationContent() {
						return this.applicationRef.packageForms.find(f => f.hash == this.application.letterHash);
					},
					formsContent() {
						return this.applicationRef.packageForms.filter(f => f.hash != this.application.letterHash);
					}
        },
        methods: {

          approveApplication() {
            this.isApproveBtnLoading = true;
            deipRpc.broadcast.approveGrantApplicationAsync(
              this.user.privKey, 
              this.application.id, 
              this.user.username
            )
						.then(() => {
							debugger;
							return applicationsHttp.updateApplicationRef(
								this.program.agency_name, 
								this.application.grant_id, 
								this.application.application_hash.split(':')[1],
								'approved')
            })
						.then(() => {
							this.$store.dispatch('layout/setSuccess', {
                message: "Application has been approved successfully"
              });
              this.$store.dispatch('rad/setApplicationStatus', { status: "application_approved" });
						})
						.catch(e => {
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
            )
						.then(() => {
							return applicationsHttp.updateApplicationRef(
								this.program.agency_name, 
								this.application.grant_id,
								this.application.application_hash.split(':')[1],
								'rejected'
							)
            })
						.then(() => {
              this.$store.dispatch('layout/setSuccess', {
                message: "Application has been rejected successfully"
              });
              this.$store.dispatch('rad/setApplicationStatus', { status: "application_rejected" });
            })
						.catch(e => {
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
