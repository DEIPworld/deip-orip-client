<template>
  <div>
    <d-chart-line :data="chartData" :options="_chartOptions" />
    <v-data-table
      :hide-default-footer="data.length < 50"
      :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
      :items-per-page="50"
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
  import DChartLine from '@/components/Deipify/DChart/DChartLine';
  import deepmerge from 'deepmerge';
  import { chartGradient, switchColor } from '@/plugins/charts';
  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
  import moment from 'moment';

  export default {
    name: 'EciHistory',
    components: { DChartLine },
    props: {
      chartOptions: {
        type: Object,
        default: () => ({})
      },
      data: {
        type: Array,
        default: () => ([])
      }
    },
    data() {
      const colors = chartGradient(4);

      return {
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
        return [...this.data].reverse();
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
