<template>
  <div class="px-5 py-4">
    <v-layout row align-baseline>
      <v-flex grow>
        <div class="half-bold title">Expertise Contribution Index</div>
      </v-flex>
      <v-flex shrink>
        <v-select
          class="my-0 py-0"
          v-model="selectedEciDisciplineId"
          :items="research.disciplines"
          item-text="name"
          item-value="id"
          label="Discipline"
          outline
          dense
          @change="selectEciDiscipline()"
          :disabled="eciHistoryRecordsTable.loading"
        ></v-select>
      </v-flex>
    </v-layout>

    <v-layout row v-if="eciDisciplineHistoryRecordsChart">
      <div class="full-width">
        <GChart
          type="LineChart"
          :settings="{ packages: ['corechart'] }"
          :data="eciDisciplineHistoryRecordsChart.data"
          :options="eciDisciplineHistoryRecordsChart.options"
        />
      </div>
    </v-layout>

    <v-layout row v-if="hasEciDisciplineHistoryRecords">
      <div class="full-width">
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
              <v-chip
                :color="eciHistoryRecordsTable.actionsColorMap[props.item.action]"
                text-color="white"
              >
                <span class="bold">{{ props.item.actionText.toUpperCase() }}</span>
              </v-chip>
            </td>
            <td>
              <router-link
                v-if="props.item.meta.link"
                class="a"
                :to="props.item.meta.link"
              >{{props.item.meta.title}}
              </router-link>
              <span v-else class="body-2">{{props.item.meta.title}}</span>
            </td>
            <td class="text-xs-center">{{ moment(props.item.timestamp).format('D MMM YYYY') }}</td>
            <td class="text-xs-center">
              <div
                class="half-bold"
                :class="{ 'eci-up': props.item.delta > 0, 'eci-down': props.item.delta < 0 }"
              >{{ props.item.delta }}
              </div>
            </td>
            <td class="text-xs-center">
              <div>{{ props.item.newAmount }}</div>
            </td>
          </template>
        </v-data-table>
      </div>
    </v-layout>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

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
          actionsColorMap: {
            review: '#161F63',
            vote_for_review: '#5ABAD1',
            init: '#8DDAB3'
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
        let records = this.$store.getters['rcd/eciHistoryByDiscipline'](
          this.selectedEciDisciplineId
        );
        return records != null && records.length != 0;
      },
      eciDisciplineHistoryRecordsChart() {
        let disciplineId = this.selectedEciDisciplineId;
        let researchContentId = this.content.id;
        let records = this.$store.getters['rcd/eciHistoryByDiscipline'](
          disciplineId
        );
        if (!records) return null;

        const getPointTooltipHtml = (eci, action, delta) => {
          let assessmentType = delta >= 0 ? 'Approved' : 'Rejected';
          let assessmentClass =
            delta >= 0
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
            let date = new Date(record.timestamp);
            let value = record.newAmount;
            let delta = record.delta;
            let actionText = record.actionText;
            let tooltip = getPointTooltipHtml(value, actionText, delta);
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

        const now = moment()
          .toDate();
        const lastEciValue = records.length
          ? records[records.length - 1].newAmount
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
    methods: {
      selectEciDiscipline() {
        let disciplineId = this.selectedEciDisciplineId;
        let researchContentId = this.content.id;

        this.eciHistoryRecordsTable.loading = true;
        let cachedRecords = this.$store.getters['rcd/eciHistoryByDiscipline'](
          disciplineId
        );
        if (cachedRecords == null) {
          this.$store
            .dispatch('rcd/loadResearchContentEciHistoryRecords', {
              researchContentId,
              disciplineId
            })
            .then(() => {
              let records = this.$store.getters['rcd/eciHistoryByDiscipline'](
                disciplineId
              );
              this.eciHistoryRecordsTable.items = records.reverse();
              this.eciHistoryRecordsTable.pagination.page = 1;
              this.eciHistoryRecordsTable.loading = false;
            });
        } else {
          this.eciHistoryRecordsTable.items = cachedRecords.reverse();
          this.eciHistoryRecordsTable.pagination.page = 1;
          this.eciHistoryRecordsTable.loading = false;
        }
      }
    },
    created() {
      if (this.isPublished) {
        let discipline = this.research.disciplines[0];
        this.selectedEciDisciplineId = discipline.id;
        this.selectEciDiscipline(discipline.id);
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
