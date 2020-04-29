<template>
  <v-container fluid class="ma-0 pa-0 full-height">
    <v-card class="full-height elevation-0">
      <v-card>
        <v-card-text class="px-0 pa-0">
          <v-breadcrumbs divider="/" :items="breadcrumbs" />
        </v-card-text>
      </v-card>

      <v-row no-gutters>
        <v-col cols="12" sm="9">
          <v-divider />
          <v-card class="pa-6 elevation-0">
            <div>
              <div class="display-1 py-6">
                {{ program.additional_info.funding_opportunity_title }}
              </div>
            </div>
            <div>
              <v-divider />
              <div class="py-4 display-flex">
                <div class="flex-1 body-1">
                  Organization Name:
                </div>
                <div class="flex-1 body-2">
                  {{ organizationProfile.name }}
                </div>

                <div class="flex-1 body-1">
                  Estimated total program funding:
                </div>
                <div class="flex-1 body-2">
                  $ {{ fromAssetsToFloat(program.amount) }}
                </div>
              </div>
              <div class="pt-4 display-flex">
                <div class="flex-1 body-1">
                  Opportunity Number:
                </div>
                <div class="flex-1 body-2">
                  {{ program.funding_opportunity_number }}
                </div>

                <div class="flex-1 body-1">
                  Current funding:
                </div>
                <div class="flex-1 body-2">
                  $ {{ fromAssetsToFloat(program.current_supply) }}
                </div>
              </div>
              <div class="pt-4 display-flex">
                <div class="flex-1 body-1">
                  Area:
                </div>
                <div class="flex-1 body-2">
                  {{ program.area.title }}
                </div>

                <div class="flex-1 body-1">
                  Expected number of awards:
                </div>
                <div class="flex-1 body-2">
                  {{ program.expected_number_of_awards }}
                </div>
              </div>
              <div class="pt-4 display-flex">
                <div class="flex-1 body-1">
                  Open date:
                </div>
                <div class="flex-1 body-2">
                  {{ new Date(`${program.posted_date}Z`).toDateString() }}
                </div>

                <div class="flex-1 body-1">
                  Award ceiling:
                </div>
                <div class="flex-1 body-2">
                  $ {{ fromAssetsToFloat(program.award_ceiling) }}
                </div>
              </div>
              <div class="py-4 display-flex">
                <div class="flex-1 body-1">
                  Close date:
                </div>
                <div class="flex-1 body-2">
                  {{ new Date(`${program.close_date}Z`).toDateString() }}
                </div>

                <div class="flex-1 body-1">
                  Award floor:
                </div>
                <div class="flex-1 body-2">
                  $ {{ fromAssetsToFloat(program.award_floor) }}
                </div>
              </div>
              <v-divider />
            </div>

            <!-- <div>
                <v-row no-gutters>
                  <v-col cols="6">
                    <div class="title font-weight-bold py-6">Applications</div>

                    <GChart
                      type="BarChart"
                      :settings="{ packages: ['corechart', 'bar'] }"
                      :data="applicationsChart.data"
                      :options="applicationsChart.options"
                    />
                  </v-col>

                  <v-col cols="6">
                    <div class="title font-weight-bold py-6">Financial</div>

                    <GChart
                      type="BarChart"
                      :settings="{ packages: ['corechart', 'bar'] }"
                      :data="financialChart.data"
                      :options="financialChart.options"
                    />
                  </v-col>
                </v-row>

                <v-divider></v-divider>
              </div> -->

            <div>
              <div class="title font-weight-bold pt-6">
                Program Guidlines
              </div>

              <div class="subtitle-1 font-weight-bold pt-6">
                Eligible Aplicants
              </div>
              <div class="body-1 pt-4">
                {{ program.additional_info.eligible_applicants }}
              </div>

              <div class="subtitle-1 font-weight-bold pt-4">
                Additional Information on Eligibility
              </div>
              <div class="body-1 pt-4">
                {{ program.additional_info.additional_info_of_eligibility }}
              </div>

              <div class="subtitle-1 font-weight-bold pt-4">
                Description
              </div>
              <div class="body-1 pt-4 pb-4">
                {{ program.additional_info.description }}
              </div>

              <v-divider />
            </div>

            <!-- <div>
                <div class="title font-weight-bold pt-6 pb-4">Applications: {{applications.length}}</div>
                <div>
                  <application-list-item v-for="(application, index) in applications"
                    :key="'application-' + application.id"
                    :application="application"
                    :isFirst="index == 0"
                    :application-status-map="applicationStatusMap"
                  ></application-list-item>
                </div>
              </div> -->

            <div class="pt-4 pb-12">
              <router-link
                :to="{
                  name: 'CreateGrantProgramAward',
                  params: {
                    agency: decodeURIComponent(organizationProfile.permlink),
                    foa: decodeURIComponent(program.funding_opportunity_number)
                  }
                }"
              >
                <v-btn class="ma-0" color="primary">
                  Add Award Receivers
                </v-btn>
              </router-link>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="3">
          <v-divider />
          <v-card class="fill-height">
            <div class="pt-4 pb-4 text-center">
              <v-avatar size="120px">
                <img :src="$options.filters.researchGroupLogoSrc(organizationProfile.id, 240, 240, true)">
              </v-avatar>
            </div>
            <v-divider />

            <div class="pt-4 pl-4 pb-4">
              <div class="title pb-2 font-weight-bold">
                Program Officers
              </div>
              <div v-for="(officer, n) in program.officers" :key="'officer-' + n">
                <div class="pt-2">
                  <platform-avatar
                    :user="officer"
                    :size="40"
                    link-to-profile
                    link-to-profile-class="px-1"
                  />
                </div>
              </div>
            </div>
            <v-divider />

            <div class="pt-4 pl-4 pb-4">
              <v-icon color="#2962FF">
                email
              </v-icon>
              <span class="pl-1 font-weight-bold">{{ program.additional_info.grantor_email || organizationProfile.email }}</span>
            </div>
            <v-divider />
            <!-- <div class="pa-6">
              <v-btn block color="primary" @click="applyToProgram()">Apply</v-btn>
              <send-application-dialog :meta="applicationDialogMeta" :program="program"></send-application-dialog>
            </div> -->
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';

  export default {
    name: 'AgencyGrantProgramDetails',

    data() {
      return {
        isSendingApplication: false,

        applicationStatusMap: {
          PENDING: 'application_pending',
          APPROVED: 'application_approved',
          REJECTED: 'application_rejected'
        },

        applicationDialogMeta: { isOpen: false }
      };
    },

    computed: {
      ...mapGetters({
        organizationProfile: 'agencyGrantProgramDetails/organization',
        program: 'agencyGrantProgramDetails/program',
        applications: 'agencyGrantProgramDetails/applications',
        user: 'auth/user'
      }),

      breadcrumbs() {
        return [
          { text: this.organizationProfile.name, disabled: false, href: `/#/${this.organizationProfile.permlink}/group-details` },
          { text: 'Programs', disabled: false, href: `/#/${this.organizationProfile.permlink}/programs` },
          // { text: this.program.area.abbreviation, disabled: true },
          // { text: this.program.subArea.abbreviation, disabled: true },
          { text: this.program.additional_info.funding_opportunity_title, disabled: true }
        ];
      },

      approvedApps() { return this.applications.filter((app) => app.status === this.applicationStatusMap.APPROVED); },
      rejectedApps() { return this.applications.filter((app) => app.status === this.applicationStatusMap.REJECTED); },
      pendingApps() { return this.applications.filter((app) => app.status === this.applicationStatusMap.PENDING); },

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
        };
      },

      financialChart() {
        const countAppAmount = (apps) => apps
          .map((app) => this.fromAssetsToFloat(app.total_amount))
          .reduce((sum, amount) => sum + amount, 0);

        const approvedAmount = countAppAmount(this.approvedApps);
        const pendingAmount = countAppAmount(this.pendingApps);
        const remainingAmount = this.fromAssetsToFloat(this.program.amount) - approvedAmount - pendingAmount;

        return {
          data: [
            [
              '',
              'Paid',
              'Approved',
              'Pending',
              'Remaining'
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
        };
      }
    },

    mounted() {
    },

    methods: {
      applyToProgram() {
        this.applicationDialogMeta.isOpen = true;
      }

    }
  };
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
