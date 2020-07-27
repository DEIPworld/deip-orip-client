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
              v-model="growthRateDisciplinesFilter.from"
              label="From"
              :x-props="{
                max:moment(growthRateDisciplinesFilter.to).subtract(1, 'days').format('YYYY-MM-DD'),
                min:moment('2018-01-01').format('YYYY-MM-DD'),
                clearable:true
              }"
              @input="updateGrowthRateChart"
            />
          </v-col>
          <v-col cols="3">
            <d-input-date
              v-model="growthRateDisciplinesFilter.to"
              label="To"
              :x-props="{
                max:moment().format('YYYY-MM-DD'),
                min:moment(growthRateDisciplinesFilter.from).add(1, 'days').format('YYYY-MM-DD'),
                clearable:true
              }"
              @input="updateGrowthRateChart"
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="growthRateDisciplinesFilter.growthRateDiscipline"
              outlined
              hide-details
              :items="[{label: 'All', external_id: 'all'}, ...disciplines]"
              item-text="label"
              item-value="external_id"
              label="Disciplines"
              @input="updateGrowthRateChart"
            />
          </v-col>
        </v-row>
        <v-col cols="12">
          <d-chart-column
            :data="growthRateChartData"
            :options="{
              vAxis: {format: '##%'},
              hAxis: {showTextEvery: 2},
              legend: {position: growthRateChartData[0][1] ? 'right' : 'none'}
            }"
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
              outlined
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
          <v-col cols="3">
            <v-select
              v-model="eciDetailedOverviewFilter.discipline"
              label="Disciplines"
              outlined
              :items="[{label: 'All', external_id: ''}, ...disciplines]"
              item-text="label"
              item-value="external_id"
            />
          </v-col>
          <v-col cols="1">
            <v-btn color="primary" @click="updateDetailedChart()">
              Apply
            </v-btn>
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
  import { EXPERTISE_CONTRIBUTION_TYPE, ASSESSMENT_CRITERIA_TYPE, ECI_STAT_PERIOD_STEP_TYPE } from '@/variables';

  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DChartPie from '@/components/Deipify/DChart/DChartPie';
  import DChartArea from '@/components/Deipify/DChart/DChartArea';
  import DChartColumn from '@/components/Deipify/DChart/DChartColumn';

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
      DChartColumn,
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

        growthRateDisciplinesFilter: {
          from: undefined,
          to: undefined,
          step: ECI_STAT_PERIOD_STEP_TYPE.UNKNOWN,
          growthRateDiscipline: 'all'
        },
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
        })
      };
    },

    computed: {
      ...mapGetters({
        disciplinesExpertiseStats: 'overview/disciplinesExpertiseStats',
        disciplinesExpertiseStatsHistory: 'overview/disciplinesExpertiseStatsHistory',
        eciHistoryByDiscipline: 'overview/eciHistoryByDiscipline',
        disciplinesGrowthRate: 'overview/disciplinesGrowthRate',
        criteriaTypes: 'overview/criteriaTypes'
      }),

      disciplines() {
        return getTopLevelNodes().map((d) => ({
          external_id: d.id,
          label: d.label
        }));
      },

      growthRateChartData() {
        const dataTable = [];
        if (this.growthRateDisciplinesFilter.growthRateDiscipline === 'all') {
          this.disciplinesGrowthRate.forEach((item, i) => {
            item.history.forEach((h, j) => {
              if (i === 0) {
                dataTable[j] = [this.moment(h.timestamp).format('DD MMM YY')];
              }
              dataTable[j].push({
                v: h.growth_rate ? parseFloat(h.growth_rate) / 100 : 0.00, f: h.growth_rate ? h.growth_rate : '0.00 %'
              });
            });
          });
        } else {
          this.disciplinesGrowthRate.forEach((item) => {
            if (item.external_id === this.growthRateDisciplinesFilter.growthRateDiscipline) {
              item.history.forEach((h) => {
                if (h.growth_rate) {
                  dataTable.push([
                    this.moment(h.timestamp).format('DD MMM YY'),
                    { v: h.growth_rate ? parseFloat(h.growth_rate) / 100 : 0.00, f: h.growth_rate ? h.growth_rate : '0.00 %' }
                  ]);
                }
              });
            }
          });
        }
        if (!dataTable.length) {
          return [['Date', ''], ['', 0]];
        }

        return [
          [
            'Date',
            ...this.disciplines
              .filter((item) => (this.growthRateDisciplinesFilter.growthRateDiscipline === 'all'
                ? true
                : item.external_id === this.growthRateDisciplinesFilter.growthRateDiscipline))
              .map((item) => item.label)
          ],
          ...dataTable
        ];
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
              (item) => item.discipline_external_id === this.distributionDiscipline
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
              f: `${parseFloat(change.percentage)}%`
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
        this.updateGrowthRateChart(),
        this.$store.dispatch('overview/getEciHistoryByDiscipline', this.eciDetailedOverviewFilter)
      ])
        .then(() => {
          this.$setReady();
        });
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

      updateGrowthRateChart() {
        const from = this.growthRateDisciplinesFilter.from ? this.moment(this.growthRateDisciplinesFilter.from)
          .startOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const to = this.growthRateDisciplinesFilter.to ? this.moment(this.growthRateDisciplinesFilter.to)
          .startOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const { step } = this.growthRateDisciplinesFilter;

        return this.$store.dispatch('overview/getDisciplinesGrowthRate', { from, to, step });
      },

      updateDetailedChart() {
        const { discipline } = this.eciDetailedOverviewFilter;
        const fromDate = this.eciDetailedOverviewFilter.fromDate ? this.moment(this.eciDetailedOverviewFilter.fromDate)
          .startOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const toDate = this.eciDetailedOverviewFilter.toDate ? this.moment(this.eciDetailedOverviewFilter.toDate)
          .endOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const { contribution } = this.eciDetailedOverviewFilter;
        const { criteria } = this.eciDetailedOverviewFilter;

        const filter = {
          discipline,
          from: fromDate,
          to: toDate,
          contribution,
          criteria
        };

        this.$store.dispatch('overview/getEciHistoryByDiscipline', filter);
      }
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
