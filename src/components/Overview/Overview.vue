<template>
  <app-layout v-if="$ready">
    <layout-section>
      <v-row>
        <v-col cols="4">
          <content-block
            title="Expertise contribution index value"
            description="Last update 05 May 2020"
          >
            <d-chart-pie
              donut
              :data="eciValueDataTable"
              :options="{legend: 'none'}"
              @select="goToParticipants"
            />
          </content-block>

        </v-col>

        <v-col cols="8">
          <content-block
            title="Expertise contribution index overview"
            description="Last update 05 May 2020"
          >
            <d-chart-area
              :data="eciOverviewDataTable"
              :options="{legend: 'none', vAxis: { format: '##%' } }"
            />
          </content-block>

        </v-col>

        <v-col cols="12">
          <GChart
            ref="eciValueChart"
            class="chart"
            type="PieChart"
            :data="eciValueDataTable"
            :options="uniLegendOptions"
            :settings="{ packages: ['corechart'] }"
            style="width: 100%; height: 24px;"
          />
        </v-col>
      </v-row>

      <v-row class="pt-4">
        <v-col cols="10">
          <div class="text-h5">
            Growth rate overview
          </div>
          <v-row>
            <v-col>
              <d-input-date
                v-model="growthRateFromDate"
                label="To"
                :x-props="{
                  'hide-details': true,
                  type: 'month',
                  max:moment(growthRateToDate).subtract(1, 'days').format('YYYY-MM-DD'),
                  min:moment('2018-01-01').format('YYYY-MM-DD'),
                }"
              />
            </v-col>
            <v-col>
              <d-input-date
                v-model="growthRateToDate"
                label="To"
                :x-props="{
                  'hide-details': true,
                  type: 'month',
                  max:moment().format('YYYY-MM'),
                  min:moment(growthRateFromDate).add(1, 'days').format('YYYY-MM'),
                }"
              />
            </v-col>
            <v-col>
              <v-select
                v-model="growthRateDiscipline"
                filled
                hide-details
                :items="[{label: 'All', external_id: 'all'}, ...disciplines]"
                item-text="label"
                item-value="external_id"
                label="Disciplines"
              />
            </v-col>
          </v-row>
          <GChart
            ref="growthRateChart"
            class="chart"
            type="ColumnChart"
            :data="growthRateChartData"
            :options="growthRateChartOptions"
            :settings="{ packages: ['corechart'] }"
            style="width: 100%; height: 232px;"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <div class="text-h5">Distribution impact</div>
          <div class="text-body-2 text--secondary">Updated today</div>
          <v-row>
            <v-col cols="4">
              <v-select
                v-model="distributionDiscipline"
                filled
                :items="[{label: 'All', external_id: 'all'}, ...disciplines]"
                item-text="label"
                item-value="external_id"
                label="Disciplines"
              />
            </v-col>
          </v-row>
          <GChart
            ref="distributionChart"
            class="chart"
            type="PieChart"
            :data="distributionChartData"
            :options="distributionChartOptions"
            :settings="{ packages: ['corechart'] }"
            style="width: 100%; height: 300px; max-width: 760px;"
          />
        </v-col>
      </v-row>

      <content-block title="Expertise Contribution Index detailed overview">
        <v-row>
          <v-col cols="3">
            <d-input-date
              v-model="eciDetailedOverviewFilter.dateFrom"
              label="From"
            />
          </v-col>
          <v-col cols="3">
            <d-input-date
              v-model="eciDetailedOverviewFilter.dateTo"
              label="To"
            />
          </v-col>
          <v-col cols="3">
            <v-select filled label="Assessment criteria" />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="eciDetailedOverviewFilter.discipline"
              label="Disciplines"
              filled
              :items="disciplines"
              item-text="label"
              item-value="external_id"
              @change="updateDetailedChart"
            />
          </v-col>
        </v-row>

        <d-chart-line
          :data="eciHistoryByDisciplineChartData"
          :options="{legend: 'none'}"
        />

        <v-data-table
          v-custom="'hover-row'"

          :hide-default-footer="eciHistoryByDiscipline.length < 50"
          :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
          :items-per-page="50"

          :headers="eciDetailedOverviewTableHeaders"
          :items="eciHistoryByDiscipline"
        >
          <template v-slot:item.type="{ item }">
            <v-chip :color="contributionColor[item.contribution_type]" text-color="white">
              {{ item.actionText }}
            </v-chip>
          </template>

          <template v-slot:item.title="{ item }">
            <router-link
              v-if="item.meta.link"
              class="a"
              :to="item.meta.link"
            >
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
              :class="{ 'success lighten-4': item.delta > 0, 'error lighten-4': item.delta < 0 }"
            >
              {{ item.delta }}
            </div>
          </template>

          <template v-slot:item.eci="{ item }">
            {{ item.eci }}
          </template>

        </v-data-table>
      </content-block>
    </layout-section>
  </app-layout>
</template>

<script>
  import AppLayout from '@/components/layout/components/Layout';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import { chartGradient } from '@/plugins/charts';
  import { mapGetters } from 'vuex';

  import { getTopLevelNodes } from '@/components/common/disciplines/DisciplineTreeService';

  import DInputDate from '@/components/Deipify/DInputDate/DInputDate';
  import DChartPie from '@/components/Deipify/DCharts/DChartPie';
  import DChartArea from '@/components/Deipify/DCharts/DChartArea';
  import ContentBlock from '@/components/layout/components/ContentBlock';
  import DChartLine from '@/components/Deipify/DCharts/DChartLine';
  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

  import fakeData from './fakeGrowthRateData.json';

  export default {
    name: 'Overview',
    components: {
      DChartLine,
      ContentBlock,
      DChartArea,
      DChartPie,
      DInputDate,
      LayoutSection,
      AppLayout
    },
    data() {
      return {
        eciDetailedOverviewFilter: {
          discipline: null,
          dateFrom: '2020-06-11',
          dateTo: '2020-07-02'
        },
        eciDetailedOverviewTableHeaders: [
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
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW]: '#161F63',
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT]: '#5ABAD1',
          [EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION]: '#8DDAB3'
        },

        growthRateFromDate: this.moment().subtract(7, 'days').format('YYYY-MM'),
        growthRateToDate: this.moment().format('YYYY-MM'),
        growthRateDiscipline: 'all',
        distributionDiscipline: 'all'
      };
    },
    methods: {
      goToParticipants(e) {
        console.log(e);
      },

      updateDetailedChart() {
        this.$store.dispatch('overview/getEciHistoryByDiscipline', this.eciDetailedOverviewFilter.discipline)
      }
    },

    computed: {
      ...mapGetters({
        disciplinesExpertiseStats: 'overview/disciplinesExpertiseStats',
        disciplinesExpertiseStatsHistory: 'overview/disciplinesExpertiseStatsHistory',
        eciHistoryByDiscipline: 'overview/eciHistoryByDiscipline'
        criteriaTypes: 'overview/criteriaTypes'
      }),

      disciplines() {
        // return this.disciplinesExpertiseStats.map((item) => ({ id: item.discipline_external_id, name: item.discipline_name }));
        return getTopLevelNodes().map((d) => ({ external_id: d.id, label: d.label }));
      },

      growthRateChartData() {
        let dataTable = [];
        if (this.growthRateDiscipline === 'all') {
          dataTable = fakeData;
        } else {
          fakeData.forEach((item) => dataTable.push([item[0], item.find((val) => val.discipline === this.growthRateDiscipline)]))
        }
        return [
          ['Month', ...this.disciplines.filter((item) => this.growthRateDiscipline === 'all' ? true : item.external_id === this.growthRateDiscipline).map((item) => item.label)],
          ...dataTable.filter((item, i) => {
            return this.moment(item[0].v).isSameOrBefore(this.growthRateToDate) && this.moment(item[0].v).isSameOrAfter(this.growthRateFromDate);
          })
        ]
      },
      growthRateChartOptions() {
        return {
          fontSize: 12,
          fontName: 'Roboto',
          chart: {
            title: 'Company Performance',
            subtitle: 'Sales, Expenses, and Profit: 2014-2017',
          },
          chartArea: {
            width: '85%',
            height: '80%',
            left: 24
          },
          vAxis: {
            format: 'percent'
          },
          series: chartGradient(this.growthRateChartData[0].length - 1)
            .map((color) => ({
              color
            }))
        }
      },

      distributionChartData() {
        let dataTable = [];
        if (this.distributionDiscipline === 'all') {
          this.disciplinesExpertiseStats.forEach((item) => {
            item.assessment_criterias.forEach((val, i) => {
              dataTable[i] = [this.criteriaTypes[val[0]], dataTable[i] ? dataTable[i][1] + val[1] : val[1]];
            });
          });
        } else {
          dataTable = this.disciplinesExpertiseStats.find((item) => item.discipline_external_id === this.distributionDiscipline)
            .assessment_criterias.map((item) => [this.criteriaTypes[item[0]], item[1]]);
        }

        return [['Criteria', 'Value'],
                ...dataTable
        ];
      },

      distributionChartOptions() {
        return {
          fontSize: 12,
          fontName: 'Roboto',
          chart: {
            title: 'Company Performance',
            subtitle: 'Sales, Expenses, and Profit: 2014-2017'
          },
          chartArea: {
            top: 0,
            height: 200
          },
          legend: {
            position: 'bottom'
          },
          slices: chartGradient(this.distributionChartData.length)
            .map((color) => ({
              color
            }))
        };
      },

      //= ====================

      eciValueDataTable() {
        return [
          ...[['Discipline', 'Value']],
          ...this.disciplinesExpertiseStats.map((item) => [
            item.discipline_name,
            item.eci
          ])
        ];
      },

      //= ====================

      eciOverviewData() {
        const stamps = {};
        for (const discipline of this.disciplinesExpertiseStatsHistory) {
          for (const change of discipline.history) {
            const date = new Date(change.timestamp);
            const data = parseFloat(change.share) / 100;

            if (!stamps[date]) {
              stamps[date] = [data];
            } else {
              stamps[date].push(data);
            }
          }
        }
        return Object.keys(stamps)
          .map((key) => [key, ...stamps[key]]);
      },
      eciOverviewDataTable() {
        return [
          ...[['Date', ...this.disciplinesExpertiseStats.map((item) => item.discipline_name)]],
          ...this.eciOverviewData
        ];
      },

      //= ====================

      eciHistoryByDisciplineChartData() {
        return [
          ['Date', 'Value'],
          ...this.eciHistoryByDiscipline.map(
            (item) => ([new Date(item.timestamp), item.eci])
          )
        ];
      },

      // LEGEND

      uniLegendOptions() {
        return {
          pieHole: 0.5,
          fontSize: 12,
          fontName: 'Roboto',
          height: 24,
          sliceVisibilityThreshold: 0,
          legend: {
            position: 'bottom',
            alignment: 'start'
          },
          chartArea: {
            left: 0,
            top: 0,
            width: '100%',
            height: 0
          },
          slices: chartGradient(this.eciValueDataTable.length - 1)
            .map((color) => ({
              color
            }))
        };
      }
    },

    created() {
      this.eciDetailedOverviewFilter.discipline = this.disciplines[0].external_id;

      Promise.all([
        this.$store.dispatch('overview/getDisciplinesExpertiseStats'),
        this.$store.dispatch('overview/getDisciplinesExpertiseStatsHistory'),
        this.$store.dispatch('overview/getEciHistoryByDiscipline', this.eciDetailedOverviewFilter.discipline),
      ]).then(() => {
        this.$setReady();
      });
    }
  };
</script>

<style lang="scss">
  .chart {
    path[stroke-width="1"][stroke="#ffffff"] {
      stroke: transparent;
    }
  }
</style>
