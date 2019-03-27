<template>
  <v-container fluid class="c-p-10">
    <v-layout row wrap>
      <v-flex xs12>
        <div class="display-1 c-pb-10">{{agencyProfile._id.toUpperCase()}} milestone reports</div>

        <div class="row c-pt-8">

          <div class="col-2">
            <span class="caption grey--text c-pl-5">
              RESEARCHER
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-3">
            <span class="caption grey--text">
              RESEARCH
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-2">
            <span class="caption grey--text">
              DATE & TIME (UTC)
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-1">
            <span class="caption grey--text">
              GRANT
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-1">
            <span class="caption grey--text">
              PURPOSE
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-1">
            <span class="caption grey--text">
              AMOUNT
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-2">
            <span class="caption grey--text">
            </span>
          </div>

        </div>
      </v-flex>

      <v-flex xs12>
        <div class="headline c-pb-10 c-pt-10 text-align-center" v-if="!relationsWithReportsByOrganizations.length">
          No active reports found
        </div>
       <!-- <div class="c-pb-5" v-for="(organization, organizationIdx) in withdrawRequestsByOrganizations" :key="'org-' + organizationIdx">
          <div class="sm-title bold c-pt-10 c-pb-5 c-pl-5">{{getOrganizationTitle(organization.orgId)}}</div>
          <v-expansion-panel>
            <v-expansion-panel-content v-for="(request, requestIdx) in organization.withdraws" :key="'funding-' + requestIdx + '-org-' + organizationIdx">
              <div slot="header">
                <div class="row">
                  <div class="col-2">
                    <div class="c-pl-5 c-pt-3 bold deip-blue-color">
                      <router-link class="a subheading" :to="{ name: 'UserDetails', params: { account_name: request.requesterUser.account.name }}">
                          {{request.requesterUser | fullname }}
                      </router-link>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="c-pt-3">
                      <router-link class="a subheading" :to="{
                          name: 'ResearchDetails',
                          params: {
                            research_group_permlink: encodeURIComponent(request.research.group_permlink),
                            research_permlink: encodeURIComponent(request.research.permlink)
                          }
                        }"
                      >{{request.research.title}}
                      </router-link>
                    </div>
                  </div>
                  <div class="col-2 text-align-center">
                    <div class="bold grey--text c-pt-3">{{new Date(`${request.foa.posted_date}Z`).toDateString()}}</div>
                  </div>
                  <div class="col-1">
                    <div class="bold deip-blue-color c-pt-3">
                      <router-link class="a deip-blue-color" 
                        :to="{ name: 'AgencyProgramDetails', 
                                params: {
                                  agency: request.foa.agency_name, 
                                  foa: request.foa.funding_opportunity_number }}">
                        # {{request.foa.funding_opportunity_number }}
                      </router-link>
                    </div>
                  </div>
                  <div class="col-1 c-pt-3">
                    <div>
                      {{request.purpose == 1 ? 'Salary' : request.purpose == 2 ? 'Equipment' : 'Business Travel'}}
                    </div>
                  </div>
                  <div class="col-1 c-pt-3">
                    <div class="bold text-align-center">
                      $ {{fromAssetsToFloat(request.amount)}}
                    </div>
                  </div>
                  <div class="col-2">
                    <v-btn outline color="primary ma-0" @click="approve(request)">Approve</v-btn>
                    <span class="c-pl-2"><v-icon @click="reject(request)">highlight_off</v-icon></span>
                  </div>
                </div>
              </div>
              <v-card style="background-color: #f1f8fe">
                <v-card-text>
                  <div class="row" >
                    <div class="col-2"></div>
                    <div class="col-8">
                      {{request.description}}
                    </div>
                    <div class="col-2"></div>
                  </div>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div> -->

        <div class="c-pb-5" v-for="(organization, organizationIdx) in relationsWithReportsByOrganizations" :key="'rel-org-' + organizationIdx">
          <div class="sm-title bold c-pt-10 c-pb-5 c-pl-5">{{getOrganizationTitle(organization.orgId)}}</div>
          <v-expansion-panel>
            <v-expansion-panel-content v-for="(relation, relationIdx) in organization.relationsWithReports" :key="'report-' + relationIdx + '-org-' + organizationIdx">
              <div slot="header">
                <div class="row">
                  <div class="col-2">
                    <div class="c-pl-5 c-pt-3 bold deip-blue-color">
                      <router-link class="a subheading" :to="{ name: 'UserDetails', params: { account_name: relation.researcherUser.account.name }}">
                          {{relation.researcherUser | fullname }}
                      </router-link>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="c-pt-3">
                      <router-link class="a subheading" :to="{
                          name: 'ResearchDetails',
                          params: {
                            research_group_permlink: encodeURIComponent(relation.research.group_permlink),
                            research_permlink: encodeURIComponent(relation.research.permlink)
                          }
                        }"
                      >{{relation.research.title}}
                      </router-link>
                    </div>
                  </div>
                  <div class="col-2 text-align-center">
                    <div class="bold grey--text c-pt-3">{{new Date(`${relation.report.created_at}Z`).toDateString()}}</div>
                  </div>
                  <div class="col-1">
                    <div class="bold deip-blue-color c-pt-3">
                      <router-link class="a deip-blue-color" 
                        :to="{ name: 'AgencyProgramDetails', 
                                params: {
                                  agency: relation.foa.agency_name, 
                                  foa: relation.foa.funding_opportunity_number }}">
                        # {{relation.foa.funding_opportunity_number }}
                      </router-link>
                    </div>
                  </div>
                  <div class="col-1 c-pt-3">
                  
                    <router-link class="a subheading" :to="{
                          name: 'ResearchDetails',
                          params: {
                            research_group_permlink: encodeURIComponent(relation.research.group_permlink),
                            research_permlink: encodeURIComponent(relation.research.permlink)
                          }
                        }"
                      ><v-chip label color="blue" style="cursor: pointer" small text-color="white">
                      <span class="bold">Milestone report</span>
                    </v-chip>
                    </router-link>
                  </div>
                  <div class="col-1 c-pt-3">
                  </div>
                  <div class="col-2">
                    <v-btn outline color="primary ma-0" @click="approveMilestone(relation.activeMilestone)">
                      Approve
                    </v-btn>
                    <span class="c-pl-2" style="cursor: pointer">
                      <v-icon @click="rejectMilestone(relation.activeMilestone)">highlight_off</v-icon>
                    </span>
                  </div>
                </div>
              </div>
              <v-card style="background-color: #f1f8fe">
                <v-card-text>
                  <div class="row" >
                    <div class="col-2"></div>
                    <div class="col-8 ">
                      <span class="bold c-pr-5">Milestone description:</span>
                      <span>{{relation.activeMilestone.description}}</span>
                    </div>
                    <div class="col-2"></div>
                  </div>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import { getOrganizationTitle } from './../../utils/organizations';

    export default {
        name: "AgencyProgramWithdrawalRequests",
        
        data() {
            return {
            }
        },

        computed: {
          ...mapGetters({
            user: 'auth/user',
            isGrantor: 'auth/isGrantor',
            isOfficer: 'auth/isOfficer',
            isApplicant: 'auth/isApplicant',
            isTreasury: 'auth/isTreasury',
            agencyProfile: 'agencyProgramWithdrawalRequests/agency',
            withdrawRequests: 'agencyProgramWithdrawalRequests/withdrawRequests',
            withdrawRequestsByOrganizations: 'agencyProgramWithdrawalRequests/withdrawRequestsByOrganizations',
            relationsWithReportsByOrganizations: 'agencyProgramWithdrawalRequests/relationsWithReportsByOrganizations'
          }),
        },

        methods: {
          getOrganizationTitle,

          approveMilestone(milestone) {
            deipRpc.broadcast.approveFundingMilestoneAsync(
              this.user.privKey,
              milestone.id,
              this.user.username
            ).then(() => {
              return this.$store.dispatch('agencyProgramWithdrawalRequests/loadAgencyProgramWithdrawalRequestsPage', { agency: this.agencyProfile._id});
            })
            .then(() => {
                this.$store.dispatch('layout/setSuccess', {
                message: "Milestone has been approved successfully!"
              });
            })
            .catch((err) => {
              console.log(err);
              this.$store.dispatch('layout/setError', {
                message: "An error occurred while sending a request, please try again later."
              });
            })
          },

          rejectMilestone(milestone) {
           deipRpc.broadcast.rejectFundingMilestoneAsync(
              this.user.privKey,
              milestone.id,
              this.user.username
            ).then(() => {
              return this.$store.dispatch('agencyProgramWithdrawalRequests/loadAgencyProgramWithdrawalRequestsPage', { agency: this.agencyProfile._id});
            })
            .then(() => {
                this.$store.dispatch('layout/setSuccess', {
                message: "Milestone has been rejected successfully!"
              });
            })
            .catch((err) => {
              console.log(err);
              this.$store.dispatch('layout/setError', {
                message: "An error occurred while sending a request, please try again later."
              });
            })
          },

          approve(request) {
            // deipRpc.broadcast.approveFundingWithdrawalRequestAsync(
            //   this.user.privKey,
            //   request.id,
            //   this.user.username
            // ).then(() => {
            //   this.$store.dispatch('layout/setSuccess', {
            //     message: "Funding withdraw request has been approved successfully!"
            //   });
            //   this.$store.dispatch('agencyProgramWithdrawalRequests/loadAgencyProgramWithdrawalRequestsPage', { agency: this.agencyProfile._id});
            // }, (err) => {
            //   console.log(err);
            //   this.$store.dispatch('layout/setError', {
            //     message: "An error occurred while sending Application, please try again later"
            //   });
            // });
          },

          reject(request) {
            // return;
            // deipRpc.broadcast.rejectFundingWithdrawalRequestAsync(
            //   this.user.privKey,
            //   request.id,
            //   this.user.username
            // ).then(() => {
            //   this.$store.dispatch('layout/setSuccess', {
            //     message: "Funding withdraw request has been rejected successfully!"
            //   });
            //   this.$store.dispatch('agencyProgramWithdrawalRequests/loadAgencyProgramWithdrawalRequestsPage', { agency: this.agencyProfile._id});
            // }, (err) => {
            //   console.log(err);
            //   this.$store.dispatch('layout/setError', {
            //     message: "An error occurred while sending Application, please try again later"
            //   });
            // });
          }
        },

        mounted() {},
        created() {},
    }
</script>

<style lang="less" scoped>


</style>
