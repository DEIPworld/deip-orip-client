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
              :options="{
                legend: 'none',
                vAxis: {
                  format: '##%'
                },
                hAxis: {
                  showTextEvery: parseInt(eciOverviewDataTable.length / 6)
                }
              }"
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

      <disciplines-growth-rate class="mt-12" />

      <d-block
        class="mt-12"
        title="Distribution impact"
        subtitle="Updated today"
      >
        <d-filter-block
          v-model="distributionDiscipline"
          :reset-model="resetDistributionDiscipline"
          @apply="updateDistributionChartData()"
          @reset="updateDistributionChartData()"
        >
          <v-select
            v-model="distributionDiscipline"
            outlined
            :items="[{label: 'All', external_id: ''}, ...disciplines]"
            item-text="label"
            item-value="external_id"
            label="Domain"
          />
        </d-filter-block>

        <d-chart-pie
          :data="distributionChartData"
          :options="{
            legend: {
              position: 'right',
              alignment:'center'
            },
            chartArea: {
              top: 0
            }
          }"
          style="max-width: 400px;"
        />

      </d-block>

      <eci-history />

    </layout-section>
  </app-layout>
</template>

<script>
  import AppLayout from '@/components/layout/components/Layout';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import { chartGradient } from '@/plugins/charts';
  import { mapGetters } from 'vuex';

  import { ASSESSMENT_CRITERIA_TYPE } from '@/variables';

  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DChartPie from '@/components/Deipify/DChart/DChartPie';
  import DChartArea from '@/components/Deipify/DChart/DChartArea';

  import { mapSelectListFromEnum } from '@/utils/mapSelectListFromEnum';

  import moment from 'moment';
  import DisciplinesGrowthRate from '@/components/DisciplinesGrowthRate/DisciplinesGrowthRate';
  import { getTopLevelNodes } from '@/components/common/disciplines/DisciplineTreeService';
  import DFilterBlock from '@/components/Deipify/DFilter/DFilterBlock';
  import EciHistory from '@/components/EciMetrics/EciHistory/EciHistory';

  export default {
    name: 'Overview',
    components: {
      EciHistory,
      DFilterBlock,
      DisciplinesGrowthRate,
      DBlock,
      DChartArea,
      DChartPie,
      LayoutSection,
      AppLayout
    },
    data() {
      return {
        resetDistributionDiscipline: false,
        distributionDiscipline: false,

        criterias: mapSelectListFromEnum(ASSESSMENT_CRITERIA_TYPE, {
          blackList: [ASSESSMENT_CRITERIA_TYPE.UNKNOWN],
          allowBlank: true,
          blankLabel: 'All'
        }),

        distributionChartData: []
      };
    },

    computed: {
      ...mapGetters({
        disciplinesExpertiseStats: 'overview/disciplinesExpertiseStats',
        disciplinesExpertiseStatsHistory: 'overview/disciplinesExpertiseStatsHistory',
        criteriaTypes: 'overview/criteriaTypes'
      }),

      disciplines() {
        return getTopLevelNodes()
          .map((d) => ({
            external_id: d.id,
            label: d.label
          }));
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
      ])
        .then(() => {
          this.$setReady();
          this.updateDistributionChartData();
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
      updateDistributionChartData() {
        let dataTable = [];
        if (!this.distributionDiscipline) {
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
            .assessment_criterias
            .map((item) => [
              this.criteriaTypes[item[0]],
              item[1]
            ]);
        }

        this.distributionChartData = [['Criteria', 'Value'], ...dataTable];
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
