<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
     <v-flex xs12>
        <v-card>
          <v-card-text class="px-0 pa-0">
            <v-breadcrumbs divider="/" :items="breadcrumbs"></v-breadcrumbs>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs9>
        <v-divider></v-divider>
        <v-card class="pl-4 pr-4 pb-5">
          <v-layout row wrap>
            <v-flex xs12>
              <div class="display-1 pb-5 pt-5">{{program.additional_info.funding_opportunity_title}}</div>
              <v-divider></v-divider>
            </v-flex>

            <v-flex xs12>
              <v-layout row pt-4>
                <v-flex flex-1 body-1>Organization Name</v-flex>
                <v-flex flex-1 body-2>{{organizationProfile.name}}</v-flex>

                <v-flex flex-1 body-1>Estimated total program funding:</v-flex>
                <v-flex flex-1 body-2>$ {{fromAssetsToFloat(program.amount)}}</v-flex>
              </v-layout>
              <v-layout pt-3>
                <v-flex flex-1 body-1>Opportunity Number:</v-flex>
                <v-flex flex-1 body-2>{{program.funding_opportunity_number}}</v-flex>

                <v-flex flex-1 body-1>Expected number of awards:</v-flex>
                <v-flex flex-1 body-2>{{program.expected_number_of_awards}}</v-flex>
              </v-layout>
              <v-layout pt-3>
                <v-flex flex-1 body-1>Area:</v-flex>
                <v-flex flex-1 body-2>{{program.area.title}}</v-flex>

                <v-flex flex-1 body-1>Award ceiling:</v-flex>
                <v-flex flex-1 body-2>$ {{fromAssetsToFloat(program.award_ceiling)}}</v-flex>
              </v-layout>
              <v-layout pt-3>
                <v-flex flex-1 body-1>Open date:</v-flex>
                <v-flex flex-1 body-2>{{new Date(`${program.posted_date}Z`).toDateString()}}</v-flex>

                <v-flex flex-1 body-1>Award floor:</v-flex>
                <v-flex flex-1 body-2>$ {{fromAssetsToFloat(program.award_floor)}}</v-flex>
              </v-layout>
              <v-layout pt-3 pb-4>
                <v-flex flex-1 body-1>Close date:</v-flex>
                <v-flex flex-1 body-2>{{new Date(`${program.close_date}Z`).toDateString()}}</v-flex>

                <v-flex flex-1 body-1 v-if="isGrantor || isOfficer">Number of applications:</v-flex>
                <v-flex flex-1 body-2 v-if="isGrantor || isOfficer">{{applications.length}}</v-flex>

                <v-flex flex-1 body-1 v-if="isApplicant"></v-flex>
                <v-flex flex-1 body-2 v-if="isApplicant"></v-flex>

              </v-layout>
              <v-divider></v-divider>
            </v-flex>

            <v-flex xs12 v-if="isGrantor || isOfficer">
              <v-layout row>
                <v-flex xs6>
                  <div class="title font-weight-bold py-4">Applications</div>

                  <GChart
                    type="BarChart"
                    :settings="{ packages: ['corechart', 'bar'] }"
                    :data="applicationsChart.data"
                    :options="applicationsChart.options"
                  />
                </v-flex>

                <v-flex xs6>
                  <div class="title font-weight-bold py-4">Financial</div>

                  <GChart
                    type="BarChart"
                    :settings="{ packages: ['corechart', 'bar'] }"
                    :data="financialChart.data"
                    :options="financialChart.options"
                  />
                </v-flex>
              </v-layout>

              <v-divider></v-divider>
            </v-flex>

            <v-flex xs12>
              <div class="title font-weight-bold pt-4">Program Guidlines</div>

              <div class="subheading font-weight-bold pt-4">Eligible Aplicants</div>
              <div class="body-1 pt-3">{{program.additional_info.eligible_applicants}}</div>

              <div class="subheading font-weight-bold pt-3">Additional Information on Eligibility</div>
              <div class="body-1 pt-3">{{program.additional_info.additional_info_of_eligibility}}</div>

              <div class="subheading font-weight-bold pt-3">Description</div>
              <div class="body-1 pt-3 pb-3">{{program.additional_info.description}}</div>

              <v-divider></v-divider>

            </v-flex>

            <v-flex xs12 v-if="isGrantor || isOfficer">
              <div class="title font-weight-bold pt-4 pb-3">Applications: {{applications.length}}</div>
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
        <v-layout row wrap fill-height>
          <v-flex xs12>
            <v-card class="fill-height">

              <div class="pt-3 pb-3 text-align-center">
                <v-avatar size="120px">
                  <img :src="$options.filters.researchGroupLogoSrc(organizationProfile.id, 50, 50, true)">
                </v-avatar>
              </div>
              <v-divider></v-divider>

              <div class="pt-3 pl-3 pb-3">
                <div class="title pb-2 font-weight-bold">Program Officers</div>
                <div v-for="(officer, n) in program.officers" :key="'officer-' + n">
                  <v-layout text-align-center pt-2>
                    <platform-avatar
                      :user="officer"
                      :size="40"
                      link-to-profile
                      link-to-profile-class="px-1"
                    ></platform-avatar>
                  </v-layout>
                </div>
              </div>
              <v-divider></v-divider>

              <div class="pt-3 pl-3 pb-3">
                <v-icon color="#2962FF">email</v-icon>
                <span class="pl-1 font-weight-bold">{{program.additional_info.grantor_email || organizationProfile.email}}</span>
              </div>
              <v-divider></v-divider>

              <div class="pa-4" v-if="isApplicant">
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
    import deipRpc from '@deip/rpc-client';
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
                organizationProfile: 'organizationProgramDetails/organization',
                program: 'organizationProgramDetails/program',
                applications: 'organizationProgramDetails/applications',
                user: 'auth/user',
                isGrantor: 'auth/isGrantor',
                isOfficer: 'auth/isOfficer',
                isApplicant: 'auth/isApplicant'
            }),

            breadcrumbs() {
              return [
                { text: this.organizationProfile.shortName, disabled: false, to: `${this.organizationProfile._id}/programs` },
                { text: "Programs", disabled: false, to: `${this.organizationProfile._id}/programs` },
                { text: this.program.area.abbreviation, disabled: false, to: `/${this.organizationProfile._id}/programs?areaCode=${this.program.area.abbreviation}&subAreaCode=${this.program.subArea.abbreviation}` },
                { text: this.program.subArea.abbreviation, disabled: false, to:`/${this.organizationProfile._id}/programs?areaCode=${this.program.area.abbreviation}&subAreaCode=${this.program.subArea.abbreviation}` },
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
              let remainingAmount = this.fromAssetsToFloat(this.program.amount) - approvedAmount - pendingAmount;

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

  .flex-1{
    flex: 1;
  }

</style>
