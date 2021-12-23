<template>
  <app-layout>
    <layout-section>
      <v-row>
        <v-col cols="4">
          <d-block
            :title="$t('overviewRouting.eciValue')"
            :subtitle="$t('overviewRouting.subtitle')"
          >
            <v-skeleton-loader
              :loading="!$ready"
              min-height="232px"
              type="pie-chart"
              :types="{
                'pie-chart': 'avatar',
              }"
            >
              <d-chart-pie
                donut
                :data="eciValueDataTable"
                :options="{legend: 'none'}"
                @select="goToParticipants"
              />
            </v-skeleton-loader>
          </d-block>
        </v-col>

        <v-col cols="8">
          <d-block
            :title="$t('overviewRouting.eciOverview')"
            :subtitle="$t('overviewRouting.subtitle')"
          >
            <v-skeleton-loader
              :loading="!$ready"
              min-height="232px"
              type="image"
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
            </v-skeleton-loader>
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

      <domains-growth-rate class="mt-12" />

      <d-block
        class="mt-12"
        :title="$t('overviewRouting.distributionImpact.title')"
        :subtitle="$t('overviewRouting.subtitle')"
      >
        <d-filter-block
          v-model="distributionDomain"
          :reset-model="resetDistributionDomain"
          @apply="updateDistributionChartData()"
          @reset="updateDistributionChartData()"
        >
          <v-select
            v-model="distributionDomain"
            outlined
            :items="[{name: $t('defaultNaming.all'), _id: ''}, ...domainsList]"
            item-text="name"
            item-value="_id"
            :label="$t('overviewRouting.distributionImpact.domainField')"
          />
        </d-filter-block>

        <v-skeleton-loader
          :loading="!$ready"
          min-height="232px"
          type="pie-chart"
          :types="{
            'pie-chart': 'avatar',
          }"
        >
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
        </v-skeleton-loader>
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
  import DomainsGrowthRate from '@/components/DisciplinesGrowthRate/DisciplinesGrowthRate';
  import DFilterBlock from '@/components/Deipify/DFilter/DFilterBlock';
  import EciHistory from '@/components/EciMetrics/EciHistory/EciHistory';

  export default {
    name: 'Overview',
    components: {
      EciHistory,
      DFilterBlock,
      DomainsGrowthRate,
      DBlock,
      DChartArea,
      DChartPie,
      LayoutSection,
      AppLayout
    },
    data() {
      return {
        resetDistributionDomain: false,
        distributionDomain: false,

        criterias: mapSelectListFromEnum(ASSESSMENT_CRITERIA_TYPE, {
          blackList: [ASSESSMENT_CRITERIA_TYPE.UNKNOWN],
          allowBlank: true,
          blankLabel: this.$t('defaultNaming.all')
        }),

        distributionChartData: []
      };
    },

    computed: {
      ...mapGetters({
        domainsExpertiseStats: 'overview/domainsExpertiseStats',
        domainsExpertiseStatsHistory: 'overview/domainsExpertiseStatsHistory',
        criteriaTypes: 'overview/criteriaTypes'
      }),

      domainsList() { return this.$store.getters['Domains/topLevelList'](); },

      //= ====================

      eciValueDataTable() {
        return [
          ...[['Domain', 'Value']],
          ...this.domainsExpertiseStats.map((item) => [
            item.domainName,
            item.eci
          ])
        ];
      },

      //= ====================

      eciOverviewData() {
        const stamps = {};
        for (const domain of this.domainsExpertiseStatsHistory) {
          for (const change of domain.history) {
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
                .format('DD MMM YY, HH:mm')
            },
            ...stamps[stamp]
          ]);
      },
      eciOverviewDataTable() {
        return [
          ...[
            [
              'Date',
              ...this.domainsExpertiseStats.map(
                (item) => item.domainName
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
        this.$store.dispatch('overview/getDomainsExpertiseLastStats'),
        this.$store.dispatch('overview/getDomainsExpertiseStatsHistory')
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
            domain: this.domainsExpertiseStats[e[0].row]
              .domainId
          }
        });
      },
      updateDistributionChartData() {
        let dataTable = [];
        if (!this.distributionDomain) {
          this.domainsExpertiseStats.forEach((item) => {
            item.assessment_criterias.forEach((val, i) => {
              dataTable[i] = [
                this.criteriaTypes[val[0]],
                dataTable[i] ? dataTable[i][1] + val[1] : val[1]
              ];
            });
          });
        } else {
          const stats = this.domainsExpertiseStats
            .find(
              (item) => item.domainId === this.distributionDomain
            );
          if (stats) {
            dataTable = stats
              .assessment_criterias
              .map((item) => [
                this.criteriaTypes[item[0]],
                item[1]
              ]);
          }
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
