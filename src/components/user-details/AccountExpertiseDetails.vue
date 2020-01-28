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
          v-model="selectedDisciplineId"
          :items="expertise"
          item-text="discipline_name"
          item-value="discipline_id"
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
                class="a"
                :to="getHistoryRecordRouteParams(props.item)"
              >{{props.item.meta.title}}</router-link>
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
      return {
        selectedDisciplineId: null,

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
          },
          pagination: {
            page: 1,
            rowsPerPage: 5,
          },
          items: [],
          totalItems: 0,
          loading: false,
        },
      };
    },

    computed: {
      ...mapGetters({
        userInfo: 'userDetails/userInfo',
        expertise: 'userDetails/expertise',
      }),
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
            return { name: 'NoAccessPage' };
        }
      },
      loadExpertiseHistoryDetailsPage() {
        const { page, rowsPerPage: perPage } = this.historyTable.pagination;
        this.historyTable.loading = true;
        const detailsPromises = [];
        const pageItems = this.history.slice((page - 1) * perPage, page * perPage);
        pageItems.forEach((pageItem, index) => {
          let detailsPromise;
          switch (pageItem.action) {
            case 'content':
              detailsPromise = loadContentDetails(pageItem.actionObjectId);
              break;
            case 'review':
              detailsPromise = loadReviewDetails(pageItem.actionObjectId);
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
        this.loadExpertiseHistory(this.selectedDisciplineId);
      }
    },

    created() {
      const disciplineId = +this.$route.query.discipline_id;
      if (this.expertise.find(e => e.discipline_id === disciplineId)) {
        this.selectedDisciplineId = disciplineId;
      } else if (this.expertise.length) {
        this.selectedDisciplineId = this.expertise[0].discipline_id;
      }
      if (this.selectedDisciplineId !== null) {
        this.loadExpertiseHistory(this.selectedDisciplineId)
      }
    }
  };
</script>


<style lang="less" scoped>
</style>