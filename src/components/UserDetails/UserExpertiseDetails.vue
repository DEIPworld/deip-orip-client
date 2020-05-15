<template>
  <v-card class="pa-12 full-height full-width" v-if="dataLoaded">
    <div class="pb-4 display-flex">
      <div>
        <platform-avatar :user="userInfo" :size="80" />
      </div>
      <div class="ml-6">
        <div class="headline">
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

    <div v-if="expertise.length" class="pt-4 display-flex">
      <div class="shrink">
        <v-select
          v-model="selectedEciDisciplineId"
          class="my-0 py-0"
          :items="expertise"
          item-text="discipline_name"
          item-value="discipline_id"
          dense
          filled
          label="Discipline"
          :disabled="eciHistoryRecordsTable.loading"
          @change="loadDisciplineEciHistory()"
        />
      </div>
    </div>
    <div v-else class="py-4">
      User does not have Expertise Tokens
    </div>


    <div v-if="eciHistoryRecordsTable.loading">
      <v-progress-circular indeterminate :width="3" :size="40" />
    </div>

    <!-- <div v-else-if="eciHistoryRecordsTable.items.length"> -->
    <div v-else>
      <div v-if="overview" class="pb-4">
        <div class="font-weight-bold title">
          Overview
        </div>
        <v-row no-gutters class="mt-4">
          <v-col cols="4" class="px-2">
            <GChart
              type="PieChart"
              :settings="{ packages: ['corechart'] }"
              :data="overview.contributionsAllocation"
              :options="contributionsAllocationChartOptions"
            />
          </v-col>
          <v-col cols="8">
            <v-row no-gutters class="full-height">
              <v-divider
                vertical
                inset
                class="ma-0"
                style="max-height: 100%"
              />
              <v-col cols="2" class="px-2">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div class="title grey--text text-center">
                    Expertise Contribution Index
                  </div>
                  <div class="subtitle-1 mt-2">
                    {{ selectedExpertise.amount }}
                  </div>
                </div>
              </v-col>
              <v-divider
                vertical
                inset
                class="ma-0"
                style="max-height: 100%"
              />
              <v-col cols="2" class="px-2">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div class="title grey--text text-center">
                    Contributions
                  </div>
                  <div class="subtitle-1 mt-2">
                    <!-- {{ overview.contributions }} -->
                    <!-- Alice will have 3 contributions during the demo -->
                    3
                  </div>
                </div>
              </v-col>
              <v-divider
                vertical
                inset
                class="ma-0"
                style="max-height: 100%"
              />
              <v-col cols="2" class="px-2 headline primary--text">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div>TOP <b>{{ overview.percentile }}</b>%</div>
                  <div>in {{ selectedExpertise.discipline_name }}</div>
                </div>
              </v-col>
              <v-divider
                vertical
                inset
                class="ma-0"
                style="max-height: 100%"
              />
              <v-col cols="2" class="px-2">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div class="title grey--text text-center">
                    Citations
                  </div>
                  <div class="subtitle-1 mt-2">
                    <!-- {{ overview.contributions }} -->
                    <!-- Alice will have 30 citations during the demo -->
                    30
                  </div>
                </div>
              </v-col>
              <v-divider
                vertical
                inset
                class="ma-0"
                style="max-height: 100%"
              />
              <v-col cols="2" class="px-2">
                <div class="display-flex justify-center align-center flex-column full-height">
                  <div class="title grey--text text-center">
                    H-index
                  </div>
                  <div class="subtitle-1 mt-2">
                    <!-- {{ overview.contributions }} -->
                    <!-- Alice will have 27 h-index during the demo -->
                    7
                  </div>
                </div>
              </v-col>
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
      <div class="py-4">
        <div class="display-flex">
          <div class="shrink">
            <v-menu
              v-model="filter.fromDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="filter.fromDate"
                  :disabled="eciHistoryRecordsTable.loading"
                  label="From"
                  readonly
                  filled
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="filter.fromDate"
                :max="moment(filter.toDate).subtract(1, 'days').format('YYYY-MM-DD')"
                :min="moment('2018-01-01').format('YYYY-MM-DD')"
                @input="updateEciHistoryFilter({ key: 'fromDate', value: moment(filter.fromDate).toDate() })"
              />
            </v-menu>
          </div>
          <div class="pl-4 shrink">
            <v-menu
              v-model="filter.toDateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="filter.toDate"
                  :disabled="eciHistoryRecordsTable.loading"
                  label="To"
                  readonly
                  filled
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="filter.toDate"
                :max="moment().format('YYYY-MM-DD')"
                :min="moment(filter.fromDate).add(1, 'days').format('YYYY-MM-DD')"
                @input="updateEciHistoryFilter({ key: 'toDate', value: moment(filter.toDate).toDate() })"
              />
            </v-menu>
          </div>
          <div class="pl-4 shrink">
            <v-select
              v-model="filter.contributionType"
              class="my-0 py-0"
              :items="contributionTypeItems"
              label="Contribution Type"
              filled
              dense
              clearable
              :disabled="eciHistoryRecordsTable.loading"
              @change="updateEciHistoryFilter({ key: 'contributionType', value: filter.contributionType })"
            />
          </div>
          <div class="pl-4 shrink">
            <v-select
              v-model="filter.criteria"
              class="my-0 py-0"
              :items="criteriaItems"
              label="Criteria"
              filled
              dense
              clearable
              :disabled="eciHistoryRecordsTable.loading"
              @change="updateEciHistoryFilter({ key: 'criteria', value: filter.criteria })"
            />
          </div>
        </div>
        <div v-if="eciHistoryRecordsTable.loading">
          <v-progress-circular
            indeterminate
            :width="3"
            :size="40"
          />
        </div>
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
      <div class="py-4">
        <div class="font-weight-bold title">
          History
        </div>
        <v-data-table
          :headers="eciHistoryRecordsTable.headers"
          :items="eciHistoryRecordsTable.items"
          hide-default-header
          class="elevation-0 mt-4"
          :loading="eciHistoryRecordsTable.loading"
          :items-per-page-options="[5, 10]"
          :options.sync="eciHistoryRecordsTable.pagination"
          :server-items-length="eciHistoryRecordsTable.totalItems"
        >
          <template v-slot:header="{props:{headers}}">
            <thead>
              <tr>
                <th
                  v-for="item in headers"
                  :key="`${item.text}`"
                  :class="`${item.whiteSpace ? `white-space-${item.whiteSpace}` : ''} ${item.align ? `text-${item.align}` : ''}`"
                >
                  {{ item.text }}
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot:item="{item}">
            <td>
              <v-chip :color="eciHistoryRecordsTable.contributionColor[item.alteration_source_type]" text-color="white">
                <span class="font-weight-bold uppercase">{{ item.actionText }}</span>
              </v-chip>
            </td>
            <td>
              <router-link v-if="item.link" class="a" :to="item.link">
                {{ item.meta.title }}
              </router-link>
              <template v-else>
                {{ item.meta.title }}
              </template>
            </td>
            <td class="text-center">
              {{ moment(item.timestamp).format('D MMM YYYY') }}
            </td>
            <td class="text-center">
              <div class="half-font-weight-bold" :class="{ 'eci-up': item.delta > 0, 'eci-down': item.delta < 0 }">
                {{ item.delta }}
              </div>
            </td>
            <td class="text-center">
              <div>{{ item.eci }}</div>
            </td>
          </template>
        </v-data-table>
      </div>
    </div>

    <div v-if="!eciHistoryRecordsTable.items.length" class="headline py-4">
      There are no history records for selected Discipline
    </div>
  </v-card>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
  import { UsersService } from '@deip/users-service';
  import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

  const usersService = UsersService.getInstance();
  const expertiseContributionsService = ExpertiseContributionsService.getInstance();

  export default {
    name: 'UserExpertiseDetails',
    props: {
      username: {
        type: String,
        default: undefined
      }
    },

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
              sortable: false,
              whiteSpace: 'nowrap'
            },
            {
              text: 'Reward ECI',
              align: 'center',
              sortable: false,
              whiteSpace: 'nowrap'
            },
            {
              text: 'Total ECI',
              align: 'center',
              sortable: false,
              whiteSpace: 'nowrap'
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
          legend: { position: 'right', alignment: 'center' },
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
          tooltip: { isHtml: true }
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
        return this.expertise.find((e) => e.discipline_id == this.selectedEciDisciplineId);
      },
      overview() {
        if (!this.selectedExpertise) {
          return null;
        }

        const allocations = this.eciHistoryRecordsTable.items.reduce((acc, item) => {
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
              return [this.contributionTypesNamesMap[contributionType], e[1]];
            })
          ]
        };
      },
      eciChartData() {
        return [
          ['Date', 'Value'],
          ...this.eciHistoryRecordsTable.items.map((e) => [new Date(e.timestamp), e.criteriaEci])
        ];
      }
    },

    created() {
      const disciplineId = this.$route.query.discipline_id;
      const idx = this.expertise.findIndex((e) => e.discipline_id == disciplineId);
      if (idx != -1) {
        this.selectedEciDisciplineId = this.expertise[idx].discipline_id;
      } else if (this.expertise.length) {
        this.selectedEciDisciplineId = this.expertise[0].discipline_id;
      }

      if (this.selectedEciDisciplineId) {
        this.loadDisciplineEciHistory();
      }
    },

    methods: {

      loadDisciplineEciHistory() {
        const disciplineId = this.selectedEciDisciplineId;
        const account = this.userInfo.account.name;
        this.eciHistoryRecordsTable.loading = true;
        const cachedRecords = this.$store.getters['userDetails/eciHistoryByDiscipline'](disciplineId);
        if (cachedRecords == null) {
          this.$store.dispatch('userDetails/loadAccountEciHistoryRecords', { account, disciplineId })
            .then(() => {
              const records = this.$store.getters['userDetails/eciHistoryByDiscipline'](disciplineId);
              this.eciHistoryRecordsTable.items = records.reverse();
              this.eciHistoryRecordsTable.pagination.page = 1;
              this.eciHistoryRecordsTable.loading = false;
              this.eciHistoryRecordsTable.totalItems = records.length;
            });
        } else {
          this.eciHistoryRecordsTable.items = cachedRecords.reverse();
          this.eciHistoryRecordsTable.pagination.page = 1;
          this.eciHistoryRecordsTable.loading = false;
          this.eciHistoryRecordsTable.totalItems = cachedRecords.length;
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

    $dataPreload() {
      return this.$store.dispatch('userDetails/loadAccountExpertiseDetailsPage', {
        username: decodeURIComponent(this.username)
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
</style>
