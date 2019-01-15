<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
     <v-flex xs12>
        <v-card>
          <v-card-text class="px-0 pa-0">
            <v-breadcrumbs divider="/">
                <v-breadcrumbs-item v-for="item in breadcrumbs"
                        :key="item.text" 
                        :disabled="item.disabled" 
                        :to="item.to">
                    {{ item.text }}
                </v-breadcrumbs-item>
            </v-breadcrumbs>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs9>
        <v-divider></v-divider>
        <v-card class="c-pl-5 c-pr-5 c-pb-10">
          <v-layout row wrap>
            <v-flex xs12>
              <div class="display-1 c-pb-10 c-pt-10">{{program.funding_opportunity_title}}</div>
              <v-divider></v-divider>
            </v-flex>
            
            <v-flex xs12>
              <div class="row c-pt-10">
                <span class="col-grow body-1">Agency Name</span>
                <span class="col-grow body-2">{{agencyProfile.name}}</span>

                <span class="col-grow body-1">Estimated total program funding:</span>
                <span class="col-grow body-2">$ {{fromAssetsToFloat(program.amount)}}</span>
              </div>
              <div class="row c-pt-5">
                <span class="col-grow body-1">Opportunity Number:</span>
                <span class="col-grow body-2">{{program.funding_opportunity_number}}</span>

                <span class="col-grow body-1">Expected number of awards:</span>
                <span class="col-grow body-2">{{program.expected_number_of_awards}}</span>
              </div>
              <div class="row c-pt-5">
                <span class="col-grow body-1">Area:</span>
                <span class="col-grow body-2">{{program.area.title}}</span>

                <span class="col-grow body-1">Award ceiling:</span>
                <span class="col-grow body-2">$ {{fromAssetsToFloat(program.award_ceiling)}}</span>
              </div> 
              <div class="row c-pt-5">
                <span class="col-grow body-1">Open date:</span>
                <span class="col-grow body-2">{{new Date(`${program.posted_date}Z`).toDateString()}}</span>

                <span class="col-grow body-1">Award floor:</span>
                <span class="col-grow body-2">$ {{fromAssetsToFloat(program.award_floor)}}</span>
              </div>
              <div class="row c-pt-5 c-pb-10">
                <span class="col-grow body-1">Close date:</span>
                <span class="col-grow body-2">{{new Date(`${program.close_date}Z`).toDateString()}}</span>

                <span class="col-grow body-1" v-if="isGrantor || isOfficer">Number of applications:</span>
                <span class="col-grow body-2" v-if="isGrantor || isOfficer">{{applications.length}}</span>
                
                <span class="col-grow body-1" v-if="isApplicant"></span>
                <span class="col-grow body-2" v-if="isApplicant"></span>

              </div>
              <v-divider></v-divider>
            </v-flex>

            <v-flex xs12 v-if="isGrantor || isOfficer">
              <div class="row">
                <div class="col-6">
                  <div class="sm-title bold c-pv-10">Applications</div>

                  <GChart
                    type="BarChart"
                    :settings="{ packages: ['corechart', 'bar'] }"
                    :data="applicationsChart.data"
                    :options="applicationsChart.options"
                  />
                </div>

                <div class="col-6">
                  <div class="sm-title bold c-pv-10">Financial</div>

                  <GChart
                    type="BarChart"
                    :settings="{ packages: ['corechart', 'bar'] }"
                    :data="financialChart.data"
                    :options="financialChart.options"
                  />
                </div>
              </div>

              <v-divider></v-divider>
            </v-flex>

            <v-flex xs12>
              <div class="sm-title bold c-pt-10">Program Guidlines</div>

              <div class="subheading bold c-pt-10">Eligible Aplicants</div>
              <div class="body-1 c-pt-5">{{program.eligible_applicants}}</div>

              <div class="subheading bold c-pt-5">Additional Information on Eligibility</div>
              <div class="body-1 c-pt-5">{{program.additional_info_of_eligibility}}</div>

              <div class="subheading bold c-pt-5">Description</div>
              <div class="body-1 c-pt-5 c-pb-5">{{program.description}}</div>

              <v-divider></v-divider>

            </v-flex>

            <v-flex xs12 v-if="isGrantor || isOfficer">
              <div class="sm-title bold c-pt-10 c-pb-5">Applications: {{applications.length}}</div>
              <div>
                <application-list-item v-for="(application, index) in applications"
                  :key="'application-' + application.id" 
                  :application="application" 
                  :isFirst="index == 0"
                  :application-status-map="applicationStatusMap"
                ></application-list-item>
              </div>
            </v-flex>

          </v-layout>
        </v-card>
      </v-flex>

      <v-flex xs3>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card style="height: 400%">

              <div class="c-pt-5 c-pb-5 text-align-center">
                <v-avatar size="120px">
                    <img :src="agencyProfile._id | agencyLogoSrc(160, 160, false)" />
                </v-avatar>
              </div>
              <v-divider></v-divider>

              <div class="c-pt-5 c-pl-5 c-pb-5">
                <div class="sm-title c-pb-2 bold">Program Officers</div>
                <div v-for="officer in program.officers">
                  <div class="row-nowrap text-align-center c-pt-2">
                    <v-avatar size="40px">
                        <img v-if="officer.profile" v-bind:src="officer.profile.avatar | avatarSrc(30, 30, false)" />
                        <v-gravatar v-else :email="officer.account.name + '@deip.world'" />
                    </v-avatar>
                    <router-link class="a deip-blue-color body-1 c-pl-3 c-pt-2" :to="{ name: 'UserDetails', params: { account_name: officer.account.name } }">
                      {{ officer | fullname }}
                    </router-link>
                  </div>
                </div>
              </div>
              <v-divider></v-divider>

              <div class="c-pt-5 c-pl-5 c-pb-5">
                <v-icon color="#2962FF">email</v-icon>
                <span class="c-pl-1 deip-blue-color bold">{{program.grantor_contact_info || agencyProfile.email}}</span>
              </div>
              <v-divider></v-divider>

              <div class="c-p-10" v-if="isApplicant">
                <v-btn block color="primary" @click="applyToProgram()">Apply</v-btn>
                <send-application-dialog :meta="applicationDialogMeta" :program="program"></send-application-dialog>
              </div>

            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      
    </v-layout>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import _ from 'lodash';

    export default {
        name: "AgencyProgramDetails",
        
        data() {
            return {
              isSendingApplication: false,

              applicationStatusMap: {
                PENDING: 'application_pending',
                APPROVED: 'application_approved',
                REJECTED: 'application_rejected'
              },

              applicationDialogMeta: { isOpen: false }
            }
        },

        computed: {
            ...mapGetters({
                agencyProfile: 'agencyProgramDetails/agency',
                program: 'agencyProgramDetails/program',
                applications: 'agencyProgramDetails/applications',
                user: 'auth/user',
                isGrantor: 'auth/isGrantor',
                isOfficer: 'auth/isOfficer',
                isApplicant: 'auth/isApplicant'
            }),

            breadcrumbs() {
              return [
                { text: this.agencyProfile.shortName, disabled: false, to: `${this.agencyProfile._id}/programs` }, 
                { text: "Programs", disabled: false, to: `${this.agencyProfile._id}/programs` },
                { text: this.program.area.abbreviation, disabled: false, to: `/${this.agencyProfile._id}/programs?areaCode=${this.program.area.abbreviation}&subAreaCode=${this.program.subArea.abbreviation}` }, 
                { text: this.program.subArea.abbreviation, disabled: false, to:`/${this.agencyProfile._id}/programs?areaCode=${this.program.area.abbreviation}&subAreaCode=${this.program.subArea.abbreviation}` },
                { text: this.program.title, disabled: true }
              ];
            },

            approvedApps() { return _.filter(this.applications, app => app.status === this.applicationStatusMap.APPROVED); },
            rejectedApps() { return _.filter(this.applications, app => app.status === this.applicationStatusMap.REJECTED); },
            pendingApps() { return _.filter(this.applications, app => app.status === this.applicationStatusMap.PENDING); },

            applicationsChart() {
              return {
                data: [
                  [
                    '',
                    'Approved',
                    'Declined',
                    'Pending'
                  ], [
                    '',
                    this.approvedApps.length,
                    this.rejectedApps.length,
                    this.pendingApps.length
                  ]
                ],
                options: {
                  isStacked: true,
                  legend: { position: 'top' },
                  colors: ['#C8E6C9', '#FFCCBC', '#8FC3F7', '#F6F6F6'],
                  dataOpacity: 0.8,
                  chartArea: { left: 0 }
                }
              }
            },

            financialChart() {
              let countAppAmount = apps => _(apps)
                .map(app => this.fromAssetsToFloat(app.total_amount))
                .reduce((sum, amount) => sum + amount, 0);
                
              let approvedAmount = countAppAmount(this.approvedApps);
              let pendingAmount = countAppAmount(this.pendingApps);
              let remainingAmount = this.fromAssetsToFloat(this.program.award_ceiling) - approvedAmount - pendingAmount;

              return {
                data: [
                  [
                    '',
                    'Paid',
                    'Approved',
                    'Pending',
                    'Remaining',
                  ], [
                    '',
                    0,
                    approvedAmount,
                    pendingAmount,
                    remainingAmount
                  ]
                ],
                options: {
                  isStacked: true,
                  legend: { position: 'top' },
                  colors: ['#C8E6C9', '#FFCCBC', '#8FC3F7', '#F6F6F6'],
                  dataOpacity: 0.8,
                  chartArea: { left: 0 }
                }
              }
            }
        },

        methods: {
          applyToProgram() {
            this.applicationDialogMeta.isOpen = true;
          }

        },

        mounted() {
        }
    }
</script>

<style lang="less" scoped>

  .sub-area-list-item {
    cursor: pointer;
  }

  .sub-area-list-item:hover {
    background: #f1f8fe;
  }

  .sub-area-list-item.active {
    background: #f1f8fe;
  }

  .sub-area-list-item-content {
    padding-left: 20%;
    padding-top: 2%;
    padding-bottom: 2%;
    padding-right: 5%;
    min-height: 45px;
  }

  .sort-option {
    cursor: pointer;
  }

  .sort-icon {
    min-width: 24px; 
    min-height: 24px;
  }

</style>
