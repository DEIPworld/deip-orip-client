<template>
  <div class="ma-5">
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
          solo
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
      <div class="pb-3">
        <div class="bold title">Overview</div>
        <v-layout row class="mt-3">
          <v-flex xs4 class="px-3">
            <GChart
              type="PieChart"
              :settings="{ packages: ['corechart'] }"
              :data="overview.contributionsAllocation"
              :options="contributionsAllocationChartoptions"
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
        <div class="bold title">Chart</div>
      </div>
      <div class="py-3">
        <div class="bold title">History</div>
        <v-data-table
          :headers="historyTable.headers"
          :items="historyTable.items"
          class="elevation-1 mt-3"
          disable-initial-sort
          :loading="historyTable.loading"
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
            <td class="text-xs-center">{{ props.item.delta }}</td>
            <td class="text-xs-center">{{ props.item.newAmount }}</td>
          </template>
        </v-data-table>
      </div>
    </div>
    <div v-else>
      Empty history for this discipline
    </div>
  </div>
</template>

<script>
  import deipRpc from '@deip/deip-oa-rpc-client';
  import { mapGetters } from 'vuex';
  import { getExpertiseHistory } from '@/services/AccountExpertiseService';
  import percentiles from './percentiles.json';

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

  const sortedPercentilesData = percentiles.sort((a, b) => a.eciBound - b.eciBound);

  export default {
    name: "AccountExpertiseDetails",

    data() {
      return {
        selectedExpertiseId: null,

        history: [],
        isHistoryLoading: false,

        historyTable: {
          headers: [
            { text: 'Type', align: 'left', sortable: false },
            { text: 'Title', align: 'left', sortable: false },
            { text: 'Date', align: 'center', sortable: false },
            { text: 'ECI', align: 'center', sortable: false },
            { text: 'Total ECI', align: 'center', sortable: false },
          ],
          actionsColorMap: {
            'content': '#5ABAD1',
            'review': '#161F63',
            'init': '#8DDAB3',
          },
          pagination: {
            page: 1,
            rowsPerPage: 5,
          },
          items: [],
          totalItems: 0,
          loading: false,
        },

        contributionsAllocationChartoptions: {
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
        let percentile;
        const lowerBoundPercentileData = sortedPercentilesData[0];
        if (this.selectedExpertise.amount <= lowerBoundPercentileData.eciBound) {
          percentile = lowerBoundPercentileData.percentile;
        } else {
          let i = 0;
          while (sortedPercentilesData[i].eciBound < this.selectedExpertise.amount && i < sortedPercentilesData.length) {
            percentile = sortedPercentilesData[i].percentile;
            i += 1;
          }
        }
        let allocations = {};
        this.history.forEach((e) => {
          allocations[e.action] = (allocations[e.action] || 0) + 1;
        });

        return {
          contributions: this.history.length,
          percentile,
          contributionsAllocation: [
            ['Contribution Type', ''],
            ...Object.entries(allocations).map((e) => {
              const contributionType = e[0];
              return [
                `${contributionType[0].toUpperCase()}${contributionType.slice(1)}`,
                e[1]
              ];
            })
          ],
        };
      }
    },

    watch: {
      'historyTable.pagination': {
        handler()  {
          this.loadExpertiseHistoryDetailsPage()
            .then(({ items, total }) => {
              this.historyTable.items = items;
              this.historyTable.totalItems = total;
            })
        },
        deep: true,
      }
    },

    methods: {
      getHistoryRecordRouteParams(item) {
        switch (item.action) {
          case 'content':
            return {
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(item.meta.research_group_permlink),
                research_permlink: encodeURIComponent(item.meta.research_permlink),
                content_permlink: encodeURIComponent(item.meta.permlink)
              }
            };
          case 'review':
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
        this.historyTable.loading = true;
        const detailsPromises = [];
        const pageItems = [...this.history].reverse()
          .slice((page - 1) * perPage, page * perPage);
        pageItems.forEach((pageItem, index) => {
          let detailsPromise;
          switch (pageItem.action) {
            case 'content':
              detailsPromise = loadContentDetails(pageItem.actionObjectId);
              break;
            case 'review':
              detailsPromise = loadReviewDetails(pageItem.actionObjectId);
              break;
            case 'init':
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
          })
          .finally(() => {
            this.historyTable.loading = false;
          });
      },
      loadExpertiseHistory(disciplineId) {
        this.isHistoryLoading = true;
        return getExpertiseHistory(this.$route.params.account_name, disciplineId)
          .then((history) => {
            this.history = history;
            // return this.loadExpertiseHistoryDetailsPage();
          })
          .catch(console.error)
          .finally(() => {
            this.isHistoryLoading = false;
          });
      },
      onDisciplineChanged() {
        this.loadExpertiseHistory(this.selectedExpertise.discipline_id);
      }
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
        this.loadExpertiseHistory(this.selectedExpertise.discipline_id)
      }
    }
  };
</script>


<style lang="less" scoped>
</style>