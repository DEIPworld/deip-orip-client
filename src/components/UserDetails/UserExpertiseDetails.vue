<template>
  <v-card v-if="$ready" class="pa-12 full-height full-width">
    <div class="pb-4 display-flex">
      <div>
        <platform-avatar :user="userInfo" :size="80" />
      </div>
      <div class="ml-6">
        <div class="text-h5">
          {{ userInfo | fullname }}
        </div>
        <div v-if="$options.filters.userLocation(userInfo)">
          <v-icon small>
            location_on
          </v-icon>
          {{ userInfo | userLocation }}
        </div>
        <div v-if="$options.filters.employmentOrEducation(userInfo)">
          <v-icon small>
            school
          </v-icon>
          {{ userInfo | employmentOrEducation }}
        </div>
      </div>
    </div>

    <v-divider class="my-4" />

    <div v-if="expertise.length">
      <div class="pt-4 display-flex">
        <div class="shrink">
          <v-select
            v-model="filter.disciplineExternalId"
            class="my-0 py-0"
            :items="disciplines"
            dense
            filled
            label="Discipline"
            :disabled="eciHistoryLoading"
          />
        </div>
        <div class="pl-4 shrink">
          <v-select
            v-model="filter.contribution"
            class="my-0 py-0"
            :items="contributions"
            label="Contribution Type"
            filled
            dense
            :disabled="eciHistoryLoading"
          />
        </div>
        <div class="pl-4 shrink">
          <v-select
            v-model="filter.criteria"
            class="my-0 py-0"
            :items="criterias"
            label="Criteria"
            filled
            dense
            :disabled="eciHistoryLoading"
          />
        </div>
        <div class="pl-4 shrink">
          <v-menu
            v-model="filter.fromDateMenu"
            :close-on-click="true"
            :close-on-content-click="true"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="filter.fromDate"
                :disabled="eciHistoryLoading"
                label="From"
                dense
                readonly
                clearable
                filled
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="filter.fromDate"
              no-title
              :max="moment(filter.toDate).subtract(1, 'days').format('YYYY-MM-DD')"
              :min="moment('2020-01-01').format('YYYY-MM-DD')"
            />
          </v-menu>
        </div>
        <div class="pl-4 shrink">
          <v-menu
            v-model="filter.toDateMenu"
            :close-on-click="true"
            :close-on-content-click="true"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="filter.toDate"
                :disabled="eciHistoryLoading"
                label="To"
                dense
                readonly
                clearable
                filled
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="filter.toDate"
              no-title
              :max="moment().format('YYYY-MM-DD')"
              :min="moment(filter.fromDate).add(1, 'days').format('YYYY-MM-DD')"
            />
          </v-menu>
        </div>
        <div class="pl-4 shrink">
          <v-btn
            color="primary"
            small
            @click="loadDisciplineEciHistory()">
            Apply
          </v-btn>
        </div>
      </div>
    </div>
    <div v-else class="py-4">
      User does not have Expertise Tokens
    </div>

    <div v-if="eciHistoryLoading" class="text-center ma-4">
      <v-progress-circular indeterminate :width="3" :size="40" />
    </div>

    <div v-else>
      <div v-if="overview" class="pb-4">
        <div class="font-weight-bold title">
          Overview
        </div>
        <v-row no-gutters class="mt-4">
          <v-col cols="3" class="px-2">
            <GChart
              type="PieChart"
              :settings="{ packages: ['corechart'] }"
              :data="overview.contributionsAllocation"
              :options="contributionsAllocationChartOptions"
            />
          </v-col>
          <v-col cols="9">
            <v-row v-if="eciStatsByDiscipline" no-gutters class="full-height">
              <v-col cols="3" class="divider-border-left">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div class="text-subtitle-1 grey--text text-center">
                    Expertise Contribution Index
                  </div>
                  <div class="text-subtitle-1 mt-2">
                    {{ eciStatsByDiscipline.eci }}
                  </div>
                </div>
              </v-col>
              <v-col cols="3" class="divider-border-left">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div class="text-subtitle-1 grey--text text-center">
                    Contributions
                  </div>
                  <div class="text-subtitle-1 mt-2">
                    {{ eciStatsByDiscipline.contributions.length }}
                  </div>
                </div>
              </v-col>
              <v-col cols="2" class="divider-border-left text-h5 primary--text">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div class="text-subtitle-1 grey--text text-center">
                    Percentile rank
                  </div>
                  <div class="text-subtitle-1 mt-2">
                    <div>{{eciStatsByDiscipline.percentile_rank}}</div>
                  </div>
                </div>
              </v-col>
              <v-col cols="2" class="divider-border-left">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div class="text-subtitle-1 grey--text text-center">
                    Citations
                  </div>
                  <div class="text-subtitle-1 mt-2">
                    {{ eciStatsByDiscipline.researches.length }}
                  </div>
                </div>
              </v-col>
              <v-col cols="2" class="divider-border-left">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div class="text-subtitle-1 grey--text text-center">
                    H-index
                  </div>
                  <div class="text-subtitle-1 mt-2">
                    {{eciStatsByDiscipline.researches.length}}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row v-else no-gutters class="full-height">
              <v-col cols="12">No records found for specified filter</v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <div class="pt-12 pb-4 display-flex justify-space-between">
        <div class="font-weight-bold title">
          Expertise Contribution Index
        </div>
        <router-link
          class="a mx-0 mr-12 pr-4"
          color="primary"
          outlined
          :to="{ name: 'ReviewSetup' }"
        >
          Alternative review model
        </router-link>
      </div>

      <eci-history
        :data="eciHistoryRecords"
      />

    </div>

    <div v-if="!eciHistoryRecords.length" class="text-h5 py-4">
      There are no history records for selected Discipline
    </div>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex';

  import { EXPERTISE_CONTRIBUTION_TYPE, ASSESSMENT_CRITERIA_TYPE } from '@/variables';
  import { UsersService } from '@deip/users-service';
  import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';
  import { mapSelectListFromEnum } from '@/utils/mapSelectListFromEnum';
  import EciHistory from '@/components/EciHistory/EciHistory';

  const usersService = UsersService.getInstance();
  const expertiseContributionsService = ExpertiseContributionsService.getInstance();

  export default {
    name: 'UserExpertiseDetails',
    components: { EciHistory },
    props: {
      username: {
        type: String,
        default: undefined
      }
    },

    data() {
      return {

        filter: {
          disciplineExternalId: '',
          fromDate: undefined,
          fromDateMenu: false,
          toDate: undefined,
          toDateMenu: false,
          criteria: '',
          contribution: ''
        },

        disciplines: [{
          text: 'All',
          value: ''
        }],
        criterias: mapSelectListFromEnum(ASSESSMENT_CRITERIA_TYPE, {
          blackList: [ASSESSMENT_CRITERIA_TYPE.UNKNOWN],
          allowBlank: true,
          blankLabel: 'All'
        }),
        contributions: mapSelectListFromEnum(EXPERTISE_CONTRIBUTION_TYPE, {
          blackList: [ASSESSMENT_CRITERIA_TYPE.UNKNOWN],
          allowBlank: true,
          blankLabel: 'All'
        }),

        eciHistoryRecords: [],
        eciHistoryLoading: false,

        contributionsAllocationChartOptions: {
          title: '',
          legend: {
            position: 'bottom',
            alignment: 'center'
          },
          colors: ['#3984B6', '#5ABAD1', '#161F63', '#B7DFCB'],
          chartArea: {
            right: 0,
            top: 0,
            width: '100%',
            height: '90%'
          },

          width: '100%',
          height: '100%',
          pieSliceTextStyle: {
            color: '#ffffff',
            fontSize: 12
          },
          pieHole: 0.5
        },

        contributionTypeNameMap: {
          [EXPERTISE_CONTRIBUTION_TYPE.UNKNOWN]: 'Graduation',
          [EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION]: 'Research',
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW]: 'Review',
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT]: 'Review support'
        }
      };
    },

    computed: {
      ...mapGetters({
        userInfo: 'userDetails/userInfo',
        expertise: 'userDetails/expertise',
        eciStatsByDiscipline: 'userDetails/eciStatsByDiscipline'
      }),
      overview() {
        const contributions = this.eciHistoryRecords.filter((item) => item.contribution_type !== EXPERTISE_CONTRIBUTION_TYPE.UNKNOWN);
        const allocations = contributions.reduce((acc, item) => {
          if (acc[item.contribution_type] === undefined) {
            acc[item.contribution_type] = 0;
          }
          acc[item.contribution_type] += 1;
          return acc;
        }, {});

        return {
          contributions: contributions.length,
          percentile: 10,
          contributionsAllocation: [
            ['Contribution Type', ''],
            ...Object.entries(allocations)
              .map((e) => {
                const contribution = e[0];
                return [this.contributionTypeNameMap[contribution], e[1]];
              })
          ]
        };
      }
    },

    methods: {

      loadDisciplineEciHistory() {
        this.eciHistoryLoading = true;
        
        const account = this.userInfo.account.name;
        const disciplineExternalId = this.filter.disciplineExternalId;
        const fromDate = this.filter.fromDate ? this.moment(this.filter.fromDate)
          .startOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const toDate = this.filter.toDate ? this.moment(this.filter.toDate)
          .endOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const contribution = this.filter.contribution;
        const criteria = this.filter.criteria;

        let filter = {
          account: account,
          discipline: disciplineExternalId,
          from: fromDate,
          to: toDate,
          contribution: contribution,
          criteria: criteria
        };

        return Promise.all([
          this.$store.dispatch('userDetails/loadAccountEciHistoryRecords', filter),
          this.$store.dispatch('userDetails/loadAccountEciStatsRecords', filter)
        ])
          .then(() => {
            const records = this.$store.getters['userDetails/eciHistoryByDiscipline'];
            this.eciHistoryRecords = records;
            this.eciHistoryLoading = false;
          });
      }
    },

    created() {
      this.$store.dispatch('userDetails/loadAccountExpertiseDetailsPage', {
        username: this.username
      })
        .then(() => {
          const disciplineExternalId = this.$route.query.discipline || '';

          this.disciplines.push(...this.expertise.map((exp) => {
            return {
              text: exp.discipline_name,
              value: exp.discipline_external_id
            };
          }));

          if (this.expertise.some((exp) => exp.discipline_external_id === disciplineExternalId)) {
            this.filter.disciplineExternalId = disciplineExternalId;
          }

          this.loadDisciplineEciHistory()
            .then(() => {
              this.$setReady();
            });
        });
    }

  };
</script>


<style lang="less" scoped>
  .eci-up {
    background: #C8E6C9;
  }

  .eci-down {
    background-color: #ffbdbd;
  }

  .divider-border-left {
    border-left: 1px solid;
    border-color: rgba(0, 0, 0, 0.12);
  }
</style>
