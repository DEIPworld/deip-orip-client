<template>
  <div class="py-6">
    <v-row no-gutters align="center">
      <v-col>
        <div class="half-bold title">
          Expertise Contribution Index
        </div>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-select
          v-model="selectedEciDisciplineId"
          class="my-0 py-0"
          :items="research.disciplines"
          item-text="name"
          item-value="id"
          label="Discipline"
          filled
          dense
          :disabled="eciHistoryRecordsTable.loading"
          @change="loadDisciplineEciHistory()"
        />
      </v-col>
    </v-row>

    <v-row v-if="eciDisciplineHistoryRecordsChart">
      <div class="full-width">
        <GChart
          type="LineChart"
          :settings="{ packages: ['corechart'] }"
          :data="eciDisciplineHistoryRecordsChart.data"
          :options="eciDisciplineHistoryRecordsChart.options"
        />
      </div>
    </v-row>

    <v-row v-if="hasEciDisciplineHistoryRecords">
      <div class="full-width">
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
            <tr>
              <td>
                <v-chip :color="eciHistoryRecordsTable.contributionColor[item.contribution_type]" text-color="white">
                  <span class="bold uppercase">{{ item.actionText }}</span>
                </v-chip>
              </td>
              <td>
                <router-link
                  v-if="item.meta.link"
                  class="a"
                  :to="item.meta.link"
                >
                  {{ item.meta.title }}
                </router-link>
                <span v-else class="text-body-2">{{ item.meta.title }}</span>
              </td>
              <td class="text-center">
                {{ moment(item.timestamp).format('D MMM YYYY') }}
              </td>
              <td class="text-center">
                <div
                  class="half-bold"
                  :class="{ 'eci-up': item.delta > 0, 'eci-down': item.delta < 0 }"
                >
                  {{ item.delta }}
                </div>
              </td>
              <td class="text-center">
                <div>{{ item.eci }}</div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

  export default {
    name: 'ResearchContentDetailsECI',

    data() {
      return {
        selectedEciDisciplineId: null,

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
        }
      };
    },
    computed: {
      ...mapGetters({
        isPublished: 'rcd/isPublished',
        research: 'rcd/research',
        content: 'rcd/content'
      }),
      hasEciDisciplineHistoryRecords() {
        const records = this.$store.getters['rcd/eciHistoryByDiscipline'](
          this.selectedEciDisciplineId
        );
        return records != null && records.length != 0;
      },
      eciDisciplineHistoryRecordsChart() {
        const disciplineId = this.selectedEciDisciplineId;
        const researchContentId = this.content.id;
        const records = this.$store.getters['rcd/eciHistoryByDiscipline'](
          disciplineId
        );
        if (!records) return null;

        const getPointTooltipHtml = (eci, action, delta) => {
          const assessmentType = delta >= 0 ? 'Approved' : 'Rejected';
          const assessmentClass = delta >= 0
            ? 'green--text text--lighten-4'
            : 'red--text text--lighten-4';
          return `
          <div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
              <div class="bold white--text text-capitalize">${action}</div>
              ${
            eci != 0
              ? `<div class="${assessmentClass} bold">${assessmentType}</div>`
              : ''
          }
              ${
            delta != 0
              ? `<div class="white--text">${
                delta > 0 ? '+' : '-'
              } ${delta}</div>`
              : ''
          }
          </div>
        `;
        };

        const data = records.length
          ? records.map((record, i) => {
            const date = new Date(record.timestamp);
            const value = record.eci;
            const { delta } = record;
            const { actionText } = record;
            const tooltip = getPointTooltipHtml(value, actionText, delta);
            return [date, value, tooltip];
          })
          : [
            [
              moment(this.content.created_at)
                .toDate(),
              0,
              `<div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
              <div class="bold white--text text-capitalize">Material Uploaded</div>
          </div>`
            ]
          ];

        const now = moment().toDate();
        const lastEciValue = records.length
          ? records[records.length - 1].eci
          : 0;

        return {
          data: [
            [
              'Date',
              'Value',
              {
                type: 'string',
                role: 'tooltip',
                p: { html: true }
              }
            ],
            ...data,
            [
              now,
              lastEciValue,
              `<div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
                <div class="bold white--text text-capitalize">Now</div>
            </div>`
            ]
          ],
          options: {
            title: '',
            backgroundColor: {
              fill: '#ffffff'
            },
            legend: {
              position: 'none'
            },
            chartArea: {
              right: 0,
              top: '10%',
              width: '90%'
            },
            tooltip: { isHtml: true },
            explorer: {
              actions: ['dragToZoom', 'rightClickToReset'],
              axis: 'horizontal',
              keepInBounds: true,
              maxZoomIn: 4.0
            }
          }
        };
      }
    },
    created() {
      if (this.isPublished) {
        const discipline = this.research.disciplines[0];
        this.selectedEciDisciplineId = discipline.id;
        this.loadDisciplineEciHistory(discipline.id);
      }
    },
    methods: {
      loadDisciplineEciHistory() {
        const disciplineId = this.selectedEciDisciplineId;
        const researchContentId = this.content.id;

        this.eciHistoryRecordsTable.loading = true;
        const cachedRecords = this.$store.getters['rcd/eciHistoryByDiscipline'](
          disciplineId
        );
        if (cachedRecords == null) {
          this.$store
            .dispatch('rcd/loadResearchContentEciHistoryRecords', {
              researchContentId,
              disciplineId
            })
            .then(() => {
              const records = this.$store.getters['rcd/eciHistoryByDiscipline'](
                disciplineId
              );
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
      }
    }
  };
</script>

<style lang="less" scoped>
  .eci-up {
    background-color: #b8ddc8;
  }

  .eci-down {
    background-color: #ffbdbd;
  }
</style>
