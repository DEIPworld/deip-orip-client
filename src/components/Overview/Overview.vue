<template>
  <app-layout v-if="$ready">
    <layout-section>
      <v-row>
        <v-col cols="4">
          <d-block
            title="Expertise contribution index value"
            subtitle="Updated today"
          >
            <d-chart-pie
              donut
              :data="eciValueDataTable"
              :options="{legend: 'none'}"
              @select="goToParticipants"
            />
          </d-block>
        </v-col>

        <v-col cols="8">
          <d-block
            title="Expertise contribution index overview"
            subtitle="Updated today"
          >
            <d-chart-area
              :data="eciOverviewDataTable"
              :options="{legend: 'none', vAxis: { format: '##%' }, hAxis: { showTextEvery: 2} }"
            />
          </d-block>
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

      <d-block title="Growth rate overview" class="mt-12">
        <v-row>
          <v-col cols="3">
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
          <v-col cols="3">
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
          <v-col cols="3">
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
        <v-col cols="10">
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
      </d-block>

      <d-block
        title="Distribution impact"
        subtitle="Updated today"
      >
        <v-row>
          <v-col cols="3">
            <v-select
              v-model="distributionDiscipline"
              filled
              :items="[{label: 'All', external_id: 'all'}, ...disciplines]"
              item-text="label"
              item-value="external_id"
              label="Disciplines"
            />
          </v-col>
          <v-col cols="10">
            <d-chart-pie
              :data="distributionChartData"
              :options="{
                legend: {position: 'bottom'},
                chartArea: {
                  top: 0
                }
              }"
              style="max-width: 600px;"
            />
          </v-col>
        </v-row>
      </d-block>

      <d-block title="Expertise Contribution Index detailed overview">
        <v-row>
          <v-col cols="2">
            <d-input-date 
              v-model="eciDetailedOverviewFilter.fromDate"
              label="From"
              :x-props="{
                max:moment(eciDetailedOverviewFilter.toDate).subtract(1, 'days').format('YYYY-MM-DD'),
                min:moment('2020-01-01').format('YYYY-MM-DD'),
                clearable:true
              }"
            />
          </v-col>
          <v-col cols="2">
            <d-input-date 
              v-model="eciDetailedOverviewFilter.toDate" 
              label="To" 
              :x-props="{
                max:moment().format('YYYY-MM-DD'),
                min:moment(eciDetailedOverviewFilter.fromDate).add(1, 'days').format('YYYY-MM-DD'),
                clearable:true
              }"
            />
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="eciDetailedOverviewFilter.contribution"
              class="my-0 py-0"
              :items="contributions"
              label="Contribution Type"
              filled
            />
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="eciDetailedOverviewFilter.criteria"
              class="my-0 py-0"
              :items="criterias"
              label="Assessment criteria"
              filled
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="eciDetailedOverviewFilter.discipline"
              label="Disciplines"
              filled
              :items="[{label: 'All', external_id: ''}, ...disciplines]"
              item-text="label"
              item-value="external_id"
            />
          </v-col>
          <v-col cols="1"> 
            <v-btn @click="updateDetailedChart()" color="primary">Apply</v-btn>
          </v-col>
        </v-row>

        <eci-history
          :data="eciHistoryByDiscipline"
        />

      </d-block>
    </layout-section>
  </app-layout>
</template>

<script>
  import AppLayout from '@/components/layout/components/Layout';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import { chartGradient } from '@/plugins/charts';
  import { mapGetters } from 'vuex';

  import { getTopLevelNodes } from '@/components/common/disciplines/DisciplineTreeService';
  import { EXPERTISE_CONTRIBUTION_TYPE, ASSESSMENT_CRITERIA_TYPE } from '@/variables';

  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DChartPie from '@/components/Deipify/DChart/DChartPie';
  import DChartArea from '@/components/Deipify/DChart/DChartArea';

  import fakeData from './fakeGrowthRateData.json';
  import EciHistory from '@/components/EciHistory/EciHistory';
  import { mapSelectListFromEnum } from '@/utils/mapSelectListFromEnum';

  import moment from 'moment';

  export default {
    name: 'Overview',
    components: {
      EciHistory,
      DBlock,
      DChartArea,
      DChartPie,
      DInputDate,
      LayoutSection,
      AppLayout
    },
    data() {
      return {
        eciDetailedOverviewFilter: {
          discipline: '',
          fromDate: undefined,
          toDate: undefined,
          contribution: '',
          criteria: ''
        },

        growthRateFromDate: this.moment()
          .subtract(7, 'days')
          .format('YYYY-MM'),
        growthRateToDate: this.moment().format('YYYY-MM'),
        growthRateDiscipline: 'all',
        distributionDiscipline: 'all',

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
      };
    },
    methods: {
      goToParticipants(e) {
        this.$router.push({
          name: 'participants',
          query: {
            discipline: this.disciplinesExpertiseStats[e[0].row]
              .discipline_external_id
          }
        });
      },

      updateDetailedChart() {
        const discipline = this.eciDetailedOverviewFilter.discipline;
        const fromDate = this.eciDetailedOverviewFilter.fromDate ? this.moment(this.eciDetailedOverviewFilter.fromDate)
          .startOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const toDate = this.eciDetailedOverviewFilter.toDate ? this.moment(this.eciDetailedOverviewFilter.toDate)
          .endOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const contribution = this.eciDetailedOverviewFilter.contribution;
        const criteria = this.eciDetailedOverviewFilter.criteria;
   
        const filter = {
          discipline: discipline,
          from: fromDate,
          to: toDate,
          contribution: contribution,
          criteria: criteria
        };

        this.$store.dispatch('overview/getEciHistoryByDiscipline', filter);
      }
    },

    computed: {
      ...mapGetters({
        disciplinesExpertiseStats: 'overview/disciplinesExpertiseStats',
        disciplinesExpertiseStatsHistory: 'overview/disciplinesExpertiseStatsHistory',
        eciHistoryByDiscipline: 'overview/eciHistoryByDiscipline',
        criteriaTypes: 'overview/criteriaTypes'
      }),

      disciplines() {
        return getTopLevelNodes().map((d) => ({
          external_id: d.id,
          label: d.label
        }));
      },

      growthRateChartData() {
        let dataTable = [];
        if (this.growthRateDiscipline === 'all') {
          dataTable = fakeData;
        } else {
          fakeData.forEach((item) =>
            dataTable.push([
              item[0],
              item.find((val) => val.discipline === this.growthRateDiscipline)
            ])
          );
        }
        return [
          [
            'Month',
            ...this.disciplines
              .filter((item) =>
                this.growthRateDiscipline === 'all'
                  ? true
                  : item.external_id === this.growthRateDiscipline
              )
              .map((item) => item.label)
          ],
          ...dataTable.filter((item, i) => {
            return (
              this.moment(item[0].v)
                .isSameOrBefore(this.growthRateToDate) &&
              this.moment(item[0].v)
                .isSameOrAfter(this.growthRateFromDate)
            );
          })
        ];
      },
      growthRateChartOptions() {
        return {
          fontSize: 12,
          fontName: 'Roboto',
          chart: {
            title: 'Company Performance',
            subtitle: 'Sales, Expenses, and Profit: 2014-2017'
          },
          chartArea: {
            width: '85%',
            height: '80%',
            left: 24
          },
          vAxis: {
            format: 'percent'
          },
          series: chartGradient(this.growthRateChartData[0].length - 1).map(
            (color) => ({
              color
            })
          )
        };
      },

      distributionChartData() {
        let dataTable = [];
        if (this.distributionDiscipline === 'all') {
          this.disciplinesExpertiseStats.forEach((item) => {
            item.assessment_criterias.forEach((val, i) => {
              dataTable[i] = [
                this.criteriaTypes[val[0]],
                dataTable[i] ? dataTable[i][1] + val[1] : val[1]
              ];
            });
          });
        } else {
          dataTable = this.disciplinesExpertiseStats
            .find(
              (item) =>
                item.discipline_external_id === this.distributionDiscipline
            )
            .assessment_criterias.map((item) => [
              this.criteriaTypes[item[0]],
              item[1]
            ]);
        }

        return [['Criteria', 'Value'], ...dataTable];
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

            const date = change.timestamp;
            const data = {
              v: parseFloat(change.percentage) / 100,
              f: parseFloat(change.percentage) + '%'
            };

            if (!stamps[date]) {
              stamps[date] = [data];
            } else {
              stamps[date].push(data);
            }
          }
        }
        return Object.keys(stamps)
          .map((stamp) => [
            {
              v: stamp,
              f: moment(stamp)
                .format('DD MMM YY, hh:mm:ss')
            },
            ...stamps[stamp]
          ]);
      },
      eciOverviewDataTable() {
        return [
          ...[
            [
              'Date',
              ...this.disciplinesExpertiseStats.map(
                (item) => item.discipline_name
              )
            ]
          ],
          ...this.eciOverviewData
        ];
      },

      //= ====================

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
            .map(
              (color) => ({
                color
              })
            )
        };
      }
    },

    created() {

      Promise.all([
        this.$store.dispatch('overview/getDisciplinesExpertiseLastStats'),
        this.$store.dispatch('overview/getDisciplinesExpertiseStatsHistory'),
        this.$store.dispatch('overview/getEciHistoryByDiscipline', this.eciDetailedOverviewFilter)
      ])
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>

<style lang="scss">
  .chart {
    path[stroke-width='1'][stroke='#ffffff'] {
      stroke: transparent;
    }
  }
</style>
