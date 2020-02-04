<template>
  <v-card class="pa-5 full-height full-width">
    <v-layout row align-center class="pb-3">
      <v-flex shrink>
        <platform-avatar
          :user="userInfo"
          :size="80"
        />
      </v-flex>
      <v-flex class="ml-4" grow>
        <div class="headline">{{ userInfo | fullname }}</div>
      </v-flex>
    </v-layout>
    <v-divider class="my-3" />
    <v-layout v-if="expertise.length" align-center class="pt-3">
      <v-flex shrink>
        <v-select
          class="my-0 py-0"
          v-model="selectedExpertiseId"
          :items="expertise"
          item-text="discipline_name"
          item-value="id"
          dense
          outline
          label="Discipline"
          @change="onDisciplineChanged()"
          :disabled="isHistoryLoading"
        />
      </v-flex>
    </v-layout>
    <div v-else class="py-3">User doesn't have any expertise tokens</div>
    <v-layout justify-center align-center v-if="isHistoryLoading">
      <v-progress-circular
        indeterminate
        :width="3"
        :size="40"
      />
    </v-layout>
    <div v-else-if="this.history.length">
      <div class="pb-3" v-if="overview">
        <div class="bold title">Overview</div>
        <v-layout row class="mt-3">
          <v-flex xs4 class="px-3">
            <GChart
              type="PieChart"
              :settings="{ packages: ['corechart'] }"
              :data="overview.contributionsAllocation"
              :options="contributionsAllocationChartOptions"
            />
          </v-flex>
          <v-divider vertical inset />
          <v-flex class="px-3">
            <v-layout column align-center justify-center full-height>
              <div class="title grey--text">Expertise Contribution Index</div>
              <div class="subheading mt-2">{{ selectedExpertise.amount }}</div>
            </v-layout>
          </v-flex>
          <v-divider vertical inset />
          <v-flex class="px-3">
            <v-layout column align-center justify-center full-height>
              <div class="title grey--text">Contributions</div>
              <div class="subheading mt-2">{{ overview.contributions }}</div>
            </v-layout>
          </v-flex>
          <v-divider vertical inset />
          <v-flex xs3 class="px-3 headline primary--text">
            <v-layout column align-center justify-center full-height>
              <div>TOP <b>{{ overview.percentile }}</b>%</div>
              <div>in {{ selectedExpertise.discipline_name }}</div>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
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
                  :disabled="isHistoryChartLoading"
                  label="From"
                  readonly
                  outline
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="filter.fromDate"
                @input="onFromDateSelected()"
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
                  :disabled="isHistoryChartLoading"
                  label="To"
                  readonly
                  outline
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="filter.toDate"
                @input="onToDateSelected()"
                :max="moment().format('YYYY-MM-DD')"
                :min="moment(filter.fromDate).add(1, 'days').format('YYYY-MM-DD')"
              />
            </v-menu>
          </v-flex>
          <v-flex shrink class="pl-3">
            <v-select
              class="my-0 py-0"
              v-model="filter.contentType"
              :items="filter.contentTypeItems"
              label="Contribution Type"
              outline
              dense
              clearable
              :disabled="isHistoryChartLoading"
            />
          </v-flex>
          <!-- <v-flex shrink class="pl-3">
            <v-select
              class="my-0 py-0"
              v-model="filter.criteria"
              :items="['Novelty', 'Methodology']"
              label="Criteria"
              outline
              dense
              :disabled="isHistoryChartLoading"
            />
          </v-flex> -->
        </v-layout>
        <v-layout justify-center align-center v-if="isHistoryChartLoading">
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
          <div class="subheading" v-else>No data to show</div>
        </template>
        <v-btn
          class="mx-0"
          color="primary"
          outline
          :to="{
            name: 'ReviewSetup',
          }"
        >Expertise Contribution Model Setup</v-btn>
      </div>
      <div class="py-3">
        <div class="bold title">History</div>
        <v-data-table
          :headers="historyTable.headers"
          :items="historyTable.items"
          class="elevation-0 mt-3"
          disable-initial-sort
          :loading="isHistoryPageLoading"
          :rows-per-page-items="[5, 10]"
          :pagination.sync="historyTable.pagination"
          :total-items="historyTable.totalItems"
        >
          <template v-slot:items="props">
            <td>
              <v-chip
                :color="historyTable.actionsColorMap[props.item.action]"
                text-color="white"
              ><span class="bold">{{ props.item.action.toUpperCase() }}</span>
              </v-chip>
            </td>
            <td>
              <router-link
                v-if="getHistoryRecordRouteParams(props.item)"
                class="a"
                :to="getHistoryRecordRouteParams(props.item)"
              >{{props.item.meta.title}}</router-link>
              <template v-else>{{props.item.meta.title}}</template>
            </td>
            <td class="text-xs-center">{{ moment(props.item.timestamp).format('D MMM YYYY') }}</td>
            <td class="text-xs-center">
              <div class="reward-eci py-1">{{ props.item.delta }}</div>
            </td>
            <td class="text-xs-center">{{ props.item.newAmount }}</td>
          </template>
        </v-data-table>
      </div>
    </div>
    <div v-else>
      Empty history for this discipline
    </div>
  </v-card>
</template>

<script>
  import deipRpc from '@deip/deip-oa-rpc-client';
  import { mapGetters } from 'vuex';
  import {
    actionTypes,
    getExpertiseHistory,
  } from '@/services/AccountExpertiseService';
  import { getEciPercentile } from '@/utils/user';

  const loadContentDetails = (contentId) => {
    const contentDetails = {};
    return deipRpc.api.getResearchContentByIdAsync(contentId)
      .then((res) => {
        contentDetails.title = res.title;
        contentDetails.permlink = res.permlink;
        return deipRpc.api.getResearchByIdAsync(res.research_id);
      }).then((res) => {
        contentDetails.research_permlink = res.permlink;
        contentDetails.research_group_permlink = res.group_permlink;
        return contentDetails;
      })
  };

  const loadReviewDetails = (reviewId) => {
    return deipRpc.api.getReviewByIdAsync(reviewId)
      .then((res) => {
        return loadContentDetails(res.research_content_id);
      }).then((res) => {
        return {
          id: reviewId,
          title: `Reviewed: "${res.title}"`,
          content_permlink: res.permlink,
          research_permlink: res.research_permlink,
          research_group_permlink: res.research_group_permlink,
        };
      })
  };

  export default {
    name: "AccountExpertiseDetails",

    data() {
      const now = this.moment();
      const toDate = now.format('YYYY-MM-DD');
      const fromDate = now.subtract(7, 'days').format('YYYY-MM-DD');

      const contentTypesNamesMap = {
        [actionTypes.CONTENT]: 'Content',
        [actionTypes.REVIEW]: 'Review',
        [actionTypes.INIT]: 'Initial expertise',
      };

      return {
        selectedExpertiseId: null,

        filter: {
          fromDate,
          toDate,
          fromDateMenu: false,
          toDateMenu: false,

          contentType: null,
          contentTypeItems: Object.entries(contentTypesNamesMap)
            .map(([key, value]) => ({ text: value, value: key })),

          criteria: null,
        },
        isHistoryPageLoading: false,

        history: [],
        filteredHistory: [],
        isHistoryLoading: false,
        isHistoryChartLoading: false,

        historyTable: {
          headers: [
            { text: 'Type', align: 'left', sortable: false },
            { text: 'Title', align: 'left', sortable: false },
            { text: 'Date', align: 'center', sortable: false },
            { text: 'Reward ECI', align: 'center', sortable: false },
            { text: 'Total ECI', align: 'center', sortable: false },
          ],
          actionsColorMap: {
            [actionTypes.CONTENT]: '#5ABAD1',
            [actionTypes.REVIEW]: '#161F63',
            [actionTypes.INIT]: '#8DDAB3',
          },
          pagination: {
            page: 1,
            rowsPerPage: 5,
          },
          items: [],
          totalItems: 0,
          loading: false,
        },

        contributionsAllocationChartOptions: {
          title: "",
          legend: { position: 'right', alignment: 'center' },
          colors: ['#3984B6', '#161F63', '#B7DFCB', '#5ABAD1'],
          chartArea: {
            right: 0,
            width: "100%",
            height: "100%"
          },

          width: "100%",
          height: "100%",
          pieSliceTextStyle: {
            color: "#ffffff",
            fontSize: 12
          },
          pieHole: 0.6
        },

        eciChartOptions: {
          title: "",
          backgroundColor: {
            fill: "#ffffff"
          },
          legend: {
            position: "none"
          },
          chartArea: {
            top: "10%",
            width: "90%"
          },
          tooltip: { isHtml: true },
        },

        contentTypesNamesMap,
      };
    },

    computed: {
      ...mapGetters({
        userInfo: 'userDetails/userInfo',
        expertise: 'userDetails/expertise',
      }),
      selectedExpertise() {
        return this.expertise.find(e => e.id === this.selectedExpertiseId);
      },
      overview() {
        if (!this.selectedExpertise) {
          return null;
        }

        let allocations = {};
        this.history.forEach((e) => {
          allocations[e.action] = (allocations[e.action] || 0) + 1;
        });

        return {
          contributions: this.history.length,
          percentile: getEciPercentile(this.selectedExpertise.amount),
          contributionsAllocation: [
            ['Contribution Type', ''],
            ...Object.entries(allocations).map((e) => {
              const contributionType = e[0];
              return [
                this.contentTypesNamesMap[contributionType],
                e[1]
              ];
            })
          ],
        };
      },
      eciChartData() {
        return [
          ['Date', 'Value'],
          ...this.filteredHistory.map((e) => [new Date(e.timestamp), e.newAmount]),
        ];
      }
    },

    watch: {
      'historyTable.pagination': {
        handler()  {
          this.loadExpertiseHistoryDetailsPage()
        },
        deep: true,
      }
    },

    methods: {
      getHistoryRecordRouteParams(item) {
        switch (item.action) {
          case actionTypes.CONTENT:
            return {
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(item.meta.research_group_permlink),
                research_permlink: encodeURIComponent(item.meta.research_permlink),
                content_permlink: encodeURIComponent(item.meta.permlink)
              }
            };
          case actionTypes.REVIEW:
            return {
              name: 'ResearchContentReview',
              params: {
                review_id: item.meta.id,
                research_group_permlink: encodeURIComponent(item.meta.research_group_permlink),
                research_permlink: encodeURIComponent(item.meta.research_permlink),
                content_permlink: encodeURIComponent(item.meta.content_permlink)
              }
            };
          default:
            return null;
        }
      },
      loadExpertiseHistoryDetailsPage() {
        const { page, rowsPerPage: perPage } = this.historyTable.pagination;
        this.isHistoryPageLoading = true;

        const pageItems = [...this.history].reverse()
          .slice((page - 1) * perPage, page * perPage);

        const detailsPromises = [];
        pageItems.forEach((pageItem, index) => {
          let detailsPromise;
          switch (pageItem.action) {
            case actionTypes.CONTENT:
              detailsPromise = loadContentDetails(pageItem.actionObjectId);
              break;
            case actionTypes.REVIEW:
              detailsPromise = loadReviewDetails(pageItem.actionObjectId);
              break;
            case actionTypes.INIT:
              detailsPromise = Promise.resolve({ title: `Initial value` });
              break;
            default:
              detailsPromise = Promise.resolve({ title: `OBJ_ID: ${pageItem.actionObjectId}` })
              break;
          }
          detailsPromise = detailsPromise.then((meta) => {
            pageItem.meta = meta;
          });

          detailsPromises.push(detailsPromise);
        });
        return Promise.all(detailsPromises)
          .then(() => {
            return {
              items: pageItems,
              total: this.history.length
            }
          })
          .catch((err) => {
            console.error(err);
            return { items: [], total: 0 };
          }).then(({ items, total }) => {
            this.historyTable.items = items;
            this.historyTable.totalItems = total;
          })
          .finally(() => {
            this.isHistoryPageLoading = false;
          });
      },
      loadExpertiseHistory() {
        this.isHistoryLoading = true;
        return getExpertiseHistory(this.$route.params.account_name, this.selectedExpertise.discipline_id)
          .then((history) => {
            this.history = history;
          })
          .catch(console.error)
          .finally(() => {
            this.isHistoryLoading = false;
          });
      },
      loadFilteredHistory() {
        this.isHistoryChartLoading = true;
        const fromDateMs = (new Date(this.filter.fromDate)).getTime();
        const toDateMs = +this.moment(this.filter.toDate)
          .add(1, 'days')
          .startOf('day');

        return getExpertiseHistory(
          this.$route.params.account_name,
          this.selectedExpertise.discipline_id,
          fromDateMs,
          toDateMs
        ).then((history) => {
          this.filteredHistory = history.filter((item) => {
            if (this.filter.contentType && item.action !== this.filter.contentType) {
              return false;
            }

            return true;
          });
        }).catch((err) => {
          console.error(err);
        }).finally(() => {
          this.isHistoryChartLoading = false;
        });
      },
      onDisciplineChanged() {
        this.loadExpertiseHistory();
      },
      onFromDateSelected() {
        this.filter.fromDateMenu = false
        this.loadFilteredHistory();
      },
      onToDateSelected() {
        this.filter.toDateMenu = false
        this.loadFilteredHistory();
      },
    },

    created() {
      const disciplineId = +this.$route.query.discipline_id;
      const expertiseIndex = this.expertise.findIndex(e => e.discipline_id === disciplineId);
      if (expertiseIndex > -1) {
        this.selectedExpertiseId = this.expertise[expertiseIndex].id;
      } else if (this.expertise.length) {
        this.selectedExpertiseId = this.expertise[0].id;
      }
      if (this.selectedExpertiseId !== null) {
        this.loadExpertiseHistory();
        this.loadFilteredHistory();
      }
    }
  };
</script>


<style lang="less" scoped>
  .reward-eci {
    font-weight: 600;
    background: #C8E6C9;
  }
</style>