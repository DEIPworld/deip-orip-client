<template>
  <v-card class="pa-5 full-height full-width">

    <v-layout row align-center class="pb-3">
      <v-flex shrink>
        <platform-avatar :user="userInfo" :size="80"></platform-avatar>
      </v-flex>
      <v-flex grow class="ml-4">
        <div class="headline">{{ userInfo | fullname }}</div>
        <div v-if="$options.filters.userLocation(userInfo)">
          <v-icon small>location_on</v-icon>
          {{ userInfo | userLocation }}
        </div>
        <div v-if="$options.filters.employmentOrEducation(userInfo)">
          <v-icon small>school</v-icon>
          {{ userInfo | employmentOrEducation }}
        </div>
      </v-flex>
    </v-layout>

    <v-divider class="my-3"></v-divider>

    <v-layout v-if="expertise.length" align-center class="pt-3">
      <v-flex shrink>
        <v-select
          class="my-0 py-0"
          v-model="selectedEciDisciplineId"
          :items="expertise"
          item-text="discipline_name"
          item-value="discipline_id"
          dense
          outline
          label="Discipline"
          @change="loadDisciplineEciHistory()"
          :disabled="eciHistoryRecordsTable.loading"
        />
      </v-flex> 
    </v-layout>
    <div v-else class="py-3">User does not have Expertise Tokens</div>


    <v-layout v-if="eciHistoryRecordsTable.loading" justify-center align-center>
      <v-progress-circular indeterminate :width="3" :size="40"></v-progress-circular>
    </v-layout>

    <!-- <div v-else-if="eciHistoryRecordsTable.items.length"> -->
    <div v-else>
      <div v-if="overview" class="pb-3">
        <div class="bold title">Overview</div>
        <v-layout row class="mt-3">
          <v-flex xs4 class="px-2">
            <GChart
              type="PieChart"
              :settings="{ packages: ['corechart'] }"
              :data="overview.contributionsAllocation"
              :options="contributionsAllocationChartOptions"
            />
          </v-flex>
          <v-divider vertical inset />
          <v-flex xs8>
            <v-layout row full-height>
              <v-flex xs2 class="px-2">
                <v-layout column align-center justify-center full-height>
                  <div class="title grey--text text-xs-center">Expertise Contribution Index</div>
                  <div class="subheading mt-2">{{ selectedExpertise.amount }}</div>
                </v-layout>
              </v-flex>
              <v-divider vertical inset class="ma-0" style="max-height: 100%"/>
              <v-flex xs2 class="px-2">
                <v-layout column align-center justify-center full-height>
                  <div class="title grey--text text-xs-center">Contributions</div>
                  <div class="subheading mt-2">
                    <!-- {{ overview.contributions }} -->
                    <!-- Alice will have 3 contributions during the demo -->
                    3
                  </div>
                </v-layout>
              </v-flex>
              <v-divider vertical inset class="ma-0" style="max-height: 100%"/>
              <v-flex xs2 class="px-2 headline primary--text">
                <v-layout column align-center justify-center full-height>
                  <div>TOP <b>{{ overview.percentile }}</b>%</div>
                  <div>in {{ selectedExpertise.discipline_name }}</div>
                </v-layout>
              </v-flex>
              <v-divider vertical inset class="ma-0" style="max-height: 100%"/>
              <v-flex xs2 class="px-2">
                <v-layout column align-center justify-center full-height>
                  <div class="title grey--text text-xs-center">Citations</div>
                  <div class="subheading mt-2">
                    <!-- {{ overview.contributions }} -->
                    <!-- Alice will have 30 citations during the demo -->
                    30
                  </div>
                </v-layout>
              </v-flex>
              <v-divider vertical inset class="ma-0" style="max-height: 100%"/>
              <v-flex xs2 class="px-2">
                <v-layout column align-center justify-center full-height>
                  <div class="title grey--text text-xs-center">H-index</div>
                  <div class="subheading mt-2">
                    <!-- {{ overview.contributions }} -->
                    <!-- Alice will have 27 h-index during the demo -->
                    7
                  </div>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
      <v-layout justify-space-between class="pt-5 pb-3">
        <div class="bold title">Expertise Contribution Index</div>
        <router-link
          class="a mx-0 mr-5 pr-3"
          color="primary"
          outline
          :to="{ name: 'ReviewSetup' }"
        >Alternative review model</router-link>
      </v-layout>
      <div class="py-3">
        <v-layout row>
          <v-flex shrink>
            <v-menu
              v-model="filter.fromDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="filter.fromDate"
                  :disabled="eciHistoryRecordsTable.loading"
                  label="From"
                  readonly
                  outline
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="filter.fromDate"
                @input="updateEciHistoryFilter({ key: 'fromDate', value: moment(filter.fromDate).toDate() })"
                :max="moment(filter.toDate).subtract(1, 'days').format('YYYY-MM-DD')"
                :min="moment('2018-01-01').format('YYYY-MM-DD')"
              />
            </v-menu>
          </v-flex>
          <v-flex shrink class="pl-3">
            <v-menu
              v-model="filter.toDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="filter.toDate"
                  :disabled="eciHistoryRecordsTable.loading"
                  label="To"
                  readonly
                  outline
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="filter.toDate"
                @input="updateEciHistoryFilter({ key: 'toDate', value: moment(filter.toDate).toDate() })"
                :max="moment().format('YYYY-MM-DD')"
                :min="moment(filter.fromDate).add(1, 'days').format('YYYY-MM-DD')"
              />
            </v-menu>
          </v-flex>
          <v-flex shrink class="pl-3">
            <v-select
              class="my-0 py-0"
              v-model="filter.contributionType"
              :items="contributionTypeItems"
              label="Contribution Type"
              outline
              dense
              clearable
              :disabled="eciHistoryRecordsTable.loading"
              @change="updateEciHistoryFilter({ key: 'contributionType', value: filter.contributionType })"
            />
          </v-flex>
          <v-flex shrink class="pl-3">
            <v-select
              class="my-0 py-0"
              v-model="filter.criteria"
              :items="criteriaItems"
              label="Criteria"
              outline
              dense
              clearable
              :disabled="eciHistoryRecordsTable.loading"
              @change="updateEciHistoryFilter({ key: 'criteria', value: filter.criteria })"
            />
          </v-flex>
        </v-layout>
        <v-layout justify-center align-center v-if="eciHistoryRecordsTable.loading">
          <v-progress-circular
            indeterminate
            :width="3"
            :size="40"
          />
        </v-layout>
        <template v-else>
          <GChart
            v-if="eciChartData.length > 1"
            type="LineChart"
            :settings="{ packages: ['corechart'] }"
            :data="eciChartData"
            :options="eciChartOptions"
          />
        </template>
      </div>
      <div class="py-3">
        <div class="bold title">History</div>
        <v-data-table
          :headers="eciHistoryRecordsTable.headers"
          :items="eciHistoryRecordsTable.items"
          class="elevation-0 mt-3"
          disable-initial-sort
          :loading="eciHistoryRecordsTable.loading"
          :rows-per-page-items="[5, 10]"
          :pagination.sync="eciHistoryRecordsTable.pagination"
          :total-items="eciHistoryRecordsTable.totalItems"
        >
          <template v-slot:items="props">
            <td>
              <v-chip :color="eciHistoryRecordsTable.contributionColor[props.item.alteration_source_type]" text-color="white">
                <span class="bold uppercase">{{ props.item.actionText }}</span>
              </v-chip>
            </td>
            <td>
              <router-link v-if="props.item.link" class="a" :to="props.item.link">{{props.item.meta.title}}</router-link>
              <template v-else>{{props.item.meta.title}}</template>
            </td>
            <td class="text-xs-center">{{ moment(props.item.timestamp).format('D MMM YYYY') }}</td>
            <td class="text-xs-center">
              <div class="half-bold" :class="{ 'eci-up': props.item.delta > 0, 'eci-down': props.item.delta < 0 }">{{ props.item.delta }}</div>
            </td>
            <td class="text-xs-center">
              <div>{{ props.item.eci }}</div>
            </td>
          </template>
        </v-data-table>
      </div>
    </div>

    <div v-if="!eciHistoryRecordsTable.items.length" class="headline py-3">
      There are no history records for selected Discipline
    </div>

  </v-card>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables'
  import { UsersService } from '@deip/users-service';
  import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

  const usersService = UsersService.getInstance();
  const expertiseContributionsService = ExpertiseContributionsService.getInstance();

  export default {
    name: 'UserExpertiseDetails',
    data() {

      return {
        selectedEciDisciplineId: null,

        filter: {
          fromDate: this.moment().subtract(7, 'days').format('YYYY-MM-DD'),
          fromDateMenu: false,
          toDate: this.moment().format('YYYY-MM-DD'),
          toDateMenu: false,
          criteria: null,
          contributionType: null
        },

        eciHistoryRecordsTable: {
          headers: [
            {
              text: 'Type',
              align: 'left',
              sortable: false
            },
            {
              text: 'Title',
              align: 'left',
              sortable: false
            },
            {
              text: 'Date',
              align: 'center',
              sortable: false
            },
            {
              text: 'Reward ECI',
              align: 'center',
              sortable: false
            },
            {
              text: 'Total ECI',
              align: 'center',
              sortable: false
            }
          ],
          contributionColor: {
            [EXPERTISE_CONTRIBUTION_TYPE.REVIEW]: '#161F63',
            [EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT]: '#5ABAD1',
            [EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION]: '#8DDAB3'
          },
          pagination: {
            page: 1,
            rowsPerPage: 5
          },
          items: [],
          totalItems: 0,
          loading: false
        },

        contributionsAllocationChartOptions: {
          title: '',
          legend: {position: 'right', alignment: 'center'},
          colors: ['#3984B6', '#5ABAD1', '#161F63', '#B7DFCB'],
          chartArea: {
            right: 0,
            width: '100%',
            height: '100%'
          },

          width: '100%',
          height: '100%',
          pieSliceTextStyle: {
            color: '#ffffff',
            fontSize: 12
          },
          pieHole: 0.5
        },

        eciChartOptions: {
          title: '',
          backgroundColor: {
            fill: '#ffffff'
          },
          legend: {
            position: 'none'
          },
          chartArea: {
            top: '10%',
            width: '90%'
          },
          tooltip: { isHtml: true },
        }
      };
    },

    computed: {
      ...mapGetters({
        userInfo: 'userDetails/userInfo',
        expertise: 'userDetails/expertise',
        criteriaTypes: 'userDetails/criteriaTypes',
        criteriaItems: 'userDetails/criteriaItems',
        contributionTypesNamesMap: 'userDetails/contributionTypesNamesMap',
        contributionTypeItems: 'userDetails/contributionTypeItems'
      }),
      selectedExpertise() {
        return this.expertise.find(e => e.discipline_id == this.selectedEciDisciplineId);
      },
      overview() {
        if (!this.selectedExpertise) {
          return null;
        }

        let allocations = this.eciHistoryRecordsTable.items.reduce((acc, item) => {
          if (acc[item.alteration_source_type] === undefined) {
              acc[item.alteration_source_type] = 0;
          }
          acc[item.alteration_source_type] += 1;
          return acc;
        }, {});

        return {
          contributions: this.eciHistoryRecordsTable.items.length,
          percentile: 10,
          contributionsAllocation: [
            ['Contribution Type', ''],
            ...Object.entries(allocations).map((e) => {
              const contributionType = e[0];
              return [ this.contributionTypesNamesMap[contributionType], e[1]];
            })
          ],
        };
      },
      eciChartData() {
        return [
          ['Date', 'Value'],
          ...this.eciHistoryRecordsTable.items.map((e) => [new Date(e.timestamp), e.criteriaEci]),
        ];
      }
    },

    methods: {

      loadDisciplineEciHistory() {
        let disciplineId = this.selectedEciDisciplineId;
        let account = this.userInfo.account.name;
        this.eciHistoryRecordsTable.loading = true;
        let cachedRecords = this.$store.getters['userDetails/eciHistoryByDiscipline'](disciplineId);
        if (cachedRecords == null) {
          this.$store.dispatch('userDetails/loadAccountEciHistoryRecords', { account, disciplineId })
            .then(() => {
              let records = this.$store.getters['userDetails/eciHistoryByDiscipline'](disciplineId);
              this.eciHistoryRecordsTable.items = records.reverse();
              this.eciHistoryRecordsTable.pagination.page = 1;
              this.eciHistoryRecordsTable.loading = false;
            });
        } else {
          this.eciHistoryRecordsTable.items = cachedRecords.reverse();
          this.eciHistoryRecordsTable.pagination.page = 1;
          this.eciHistoryRecordsTable.loading = false;
        }
      },

      updateEciHistoryFilter({ key, value }) {
        this.filter.fromDateMenu = false;
        this.filter.toDateMenu = false;
        this.$store.dispatch('userDetails/updateEciHistoryFilter', { key, value })
          .then(() => {
            this.loadDisciplineEciHistory();
          });
      }
    },

    created() {
      const disciplineId = this.$route.query.discipline_id;
      const idx = this.expertise.findIndex(e => e.discipline_id == disciplineId);
      if (idx != -1) {
        this.selectedEciDisciplineId = this.expertise[idx].discipline_id;
      } else if (this.expertise.length) {
        this.selectedEciDisciplineId = this.expertise[0].discipline_id;
      }

      if (this.selectedEciDisciplineId) {
        this.loadDisciplineEciHistory();
      }
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
</style>
