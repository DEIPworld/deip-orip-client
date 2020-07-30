<template>
  <div>
    <d-filter-block
      v-model="eciDetailedOverviewFilter"
      :loading="loading"
      @apply="updateData"
    >
      <v-col cols="2">
        <v-select
          v-model="eciDetailedOverviewFilter.discipline"
          label="Disciplines"
          outlined
          :items="[{label: 'All', external_id: ''}, ...disciplinesList]"
          item-text="label"
          item-value="external_id"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="eciDetailedOverviewFilter.contribution"
          class="my-0 py-0"
          :items="contributions"
          label="Contribution Type"
          outlined
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="eciDetailedOverviewFilter.criteria"
          class="my-0 py-0"
          :items="criterias"
          label="Assessment criteria"
          outlined
        />
      </v-col>

      <v-col cols="2">
        <d-input-date
          v-model="eciDetailedOverviewFilter.date"
          label="Period"
          :picker-props="{
            min: moment('2020-01-01').format('YYYY-MM-DD'),
            range: true
          }"
          :field-props="{
            clearable: true,
          }"
        />
      </v-col>
    </d-filter-block>

    <eci-history-overview v-if="!overviewData.hideOverview" :overview-data="overviewData" />

    <slot name="eciHeader" />

    <d-chart-line :data="chartData" :options="_chartOptions" />

    <v-data-table
      :hide-default-footer="data.length < 10"
      :footer-props="{itemsPerPageOptions: [10, 20, 30, 40, 50, -1]}"
      :items-per-page="10"
      :headers="tableHeaders"
      :items="tableData"
    >
      <template v-slot:item.type="{ item }">
        <v-chip
          :color="contributionColor[item.contribution_type].background"
          :text-color="contributionColor[item.contribution_type].foreground"
        >{{ item.actionText }}</v-chip>
      </template>

      <template v-slot:item.title="{ item }">
        <router-link v-if="item.meta.link" class="a" :to="item.meta.link">
          {{ item.meta.title }}
        </router-link>
        <span v-else class="text-body-2">{{ item.meta.title }}</span>
      </template>

      <template v-slot:item.date="{ item }">
        <div class="text-no-wrap">{{ moment(item.timestamp).format('D MMM YYYY') }}</div>
      </template>

      <template v-slot:item.delta="{ item }">
        <div
          class="text-no-wrap rounded-sm"
          :class="{ 'success lighten-3': item.delta > 0, 'error lighten-3': item.delta < 0 }"
        >{{ item.delta }}</div>
      </template>

      <template v-slot:item.eci="{ item }">{{ item.eci }}</template>
    </v-data-table>
  </div>
</template>

<script>
  import EciHistoryOverview from '@/components/EciHistory/EciHistoryOverview';
  import DChartLine from '@/components/Deipify/DChart/DChartLine';
  import DFilterBlock from '@/components/Deipify/DFilter/DFilterBlock';
  import deepmerge from 'deepmerge';
  import { mapSelectListFromEnum } from '@/utils/mapSelectListFromEnum';
  import { EXPERTISE_CONTRIBUTION_TYPE, ASSESSMENT_CRITERIA_TYPE } from '@/variables';
  import { getTopLevelNodes } from '@/components/common/disciplines/DisciplineTreeService';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import { chartGradient, switchColor } from '@/plugins/charts';
  import moment from 'moment';

  export default {
    name: 'EciHistory',
    components: { DChartLine, EciHistoryOverview, DFilterBlock, DInputDate },
    props: {
      chartOptions: {
        type: Object,
        default: () => ({})
      },
      data: {
        type: Array,
        default: () => ([])
      },
      overviewData: {
        type: Object,
        default: () => ({ hideOverview: true })
      },
      loading: {
        type: Boolean,
        default: false
      },
      disciplines: {
        type: Array,
        default: () => getTopLevelNodes()
      }
    },
    data() {
      const colors = chartGradient(4);

      return {
        eciDetailedOverviewFilter: {
          discipline: '',
          date: [],
          contribution: '',
          criteria: ''
        },

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

        tableHeaders: [
          {
            text: 'Type',
            align: 'left',
            value: 'type',
            sortable: false
          },
          {
            text: 'Title',
            align: 'left',
            value: 'title',
            sortable: false
          },
          {
            text: 'Date',
            align: 'center',
            value: 'date',
            sortable: false,
            class: 'white-space-nowrap'
          },
          {
            text: 'Reward ECI',
            align: 'center',
            sortable: false,
            value: 'delta',
            class: 'white-space-nowrap'
          },
          {
            text: 'Total ECI',
            align: 'center',
            sortable: false,
            value: 'eci',
            class: 'white-space-nowrap'
          }
        ],

        contributionColor: {
          [EXPERTISE_CONTRIBUTION_TYPE.UNKNOWN]: {
            background: colors[2],
            foreground: switchColor(colors[3])
          },
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW]: {
            background: colors[2],
            foreground: switchColor(colors[2])
          },
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT]: {
            background: colors[1],
            foreground: switchColor(colors[1])
          },
          [EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION]: {
            background: colors[0],
            foreground: switchColor(colors[0])
          },
        }
      };
    },

    computed: {
      disciplinesList() {
        return this.disciplines
          .map((d) => ({
            external_id: d.external_id || d.id,
            label: d.label || d.name
          }));
      },

      _chartOptions() {
        const defaultOptions = {
          legend: 'none',
          explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          }
        };

        return deepmerge(defaultOptions, this.chartOptions);
      },

      chartData() {
        const chartData = this.data.map((item) => [
          new Date(item.timestamp),
          item.eci
        ]);

        const lastPoint = [
          moment().toDate(),
          this.data.length ? this.data[this.data.length - 1].eci : 0
        ];

        return [
          ['Date', 'Value'],
          ...chartData,
          lastPoint
        ];
      },

      tableData() {
        return [...this.data.map((r, i) => {
          return { ...r, id: `${i}-${r.discipline_external_id}` };
        })].reverse();
      }
    },

    methods: {
      updateData() {
        const { discipline, contribution, criteria } = this.eciDetailedOverviewFilter;
        const fromDate = this.eciDetailedOverviewFilter.date[0]
          ? this.moment(this.eciDetailedOverviewFilter.date[0])
            .startOf('day')
            .toISOString(true)
            .split('.')[0]
          : '';
        const toDate = this.eciDetailedOverviewFilter.date[1]
          ? this.moment(this.eciDetailedOverviewFilter.date[1])
            .endOf('day')
            .toISOString(true)
            .split('.')[0]
          : '';

        const filter = {
          discipline,
          from: fromDate,
          to: toDate,
          contribution,
          criteria
        };
        this.$emit('updateData', filter);
      }
    }
  };






  // eciDisciplineHistoryRecordsChart() {
  //   const disciplineId = this.selectedEciDisciplineId;
  //   const records = this.$store.getters['rd/eciHistoryByDiscipline'](
  //     disciplineId
  //   );
  //   if (!records) return null;
  //
  //   const getPointTooltipHtml = (eci, action, delta) => {
  //     const assessmentType = delta >= 0 ? 'Approved' : 'Rejected';
  //     const assessmentClass = delta >= 0
  //       ? 'green--text text--lighten-4'
  //       : 'red--text text--lighten-4';
  //     return `
  //     <div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
  //         <div class="bold white--text text-capitalize">${action}</div>
  //         ${
  //       eci != 0
  //         ? `<div class="${assessmentClass} bold">${assessmentType}</div>`
  //         : ''
  //     }
  //         ${
  //       delta != 0
  //         ? `<div class="white--text">${
  //           delta > 0 ? '+' : '-'
  //         } ${delta}</div>`
  //         : ''
  //     }
  //     </div>
  //   `;
  //   };
  //
  //   const data = records.map((record, i) => {
  //     const date = new Date(record.timestamp);
  //     const value = record.eci;
  //     const { delta } = record;
  //     const { actionText } = record;
  //     const tooltip = getPointTooltipHtml(value, actionText, delta);
  //     return [date, value, tooltip];
  //   });
  //
  //   const now = moment()
  //     .toDate();
  //   const lastEciValue = records.length ? records[records.length - 1].eci : 0;
  //
  //   return {
  //     data: [
  //       [
  //         'Date',
  //         'Value',
  //         {
  //           type: 'string',
  //           role: 'tooltip',
  //           p: { html: true }
  //         }
  //       ],
  //       [
  //         moment(this.research.created_at)
  //           .toDate(),
  //         0,
  //         `<div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
  //         <div class="bold white--text text-capitalize">Project Created</div>
  //       </div>`
  //       ],
  //       ...data,
  //       [
  //         now,
  //         lastEciValue,
  //         `<div style="width: 100px; padding: 5px; background: #828282; border-radius: 2px; opacity: 0.9">
  //         <div class="bold white--text text-capitalize">Now</div>
  //       </div>`
  //       ]
  //     ],
  //
  //     options: {
  //       title: '',
  //       backgroundColor: {
  //         fill: '#ffffff'
  //       },
  //       legend: {
  //         position: 'none'
  //       },
  //       chartArea: {
  //         right: 0,
  //         top: '10%',
  //         width: '90%'
  //       },
  //       tooltip: { isHtml: true },
  //       explorer: {
  //         actions: ['dragToZoom', 'rightClickToReset'],
  //         axis: 'horizontal',
  //         keepInBounds: true,
  //         maxZoomIn: 4.0
  //       }
  //     }
  //   };
  // },
</script>

<style scoped>

</style>
