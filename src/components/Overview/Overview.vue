<template>
  <app-layout v-if="$ready">
    <layout-section>
      <v-row>
        <v-col cols="4">
          <div class="text-h5">Expertise contribution index value</div>
          <div class="text-body-2 text--secondary">Last update 05 May 2020</div>
          <GChart
            ref="donutChart"
            class="chart mt-6"
            type="PieChart"
            :data="eciValueDataTable"
            :options="eciValueOptions"
            :settings="{ packages: ['corechart'] }"
            :events="eciValueEvents"
            style="width: 100%; height: 232px;"
          />
        </v-col>

        <v-col cols="8">
          <div class="text-h5">Expertise contribution index overview</div>
          <div class="text-body-2 text--secondary">Last update 05 May 2020</div>
          <GChart
            class="chart mt-6"
            ref="eciOverviewChart"
            type="AreaChart"
            :data="eciOverviewDataTable"
            :options="eciOverviewOptions"
            :settings="{ packages: ['corechart'] }"
            style="width: 100%; height: 232px;"
          />
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

    </layout-section>
  </app-layout>
</template>

<script>
  import AppLayout from '@/components/layout/components/Layout';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import { chartGradient, chartPalette, switchColor } from '@/plugins/charts';
  import { mapGetters } from 'vuex';
  import { hex } from 'wcag-contrast';

  export default {
    name: 'Overview',
    components: {
      LayoutSection,
      AppLayout
    },
    computed: {
      ...mapGetters({
        disciplinesExpertiseStats: 'overview/disciplinesExpertiseStats',
        disciplinesExpertiseStatsHistory: 'overview/disciplinesExpertiseStatsHistory',
        researchContentsExpertiseHistory: 'overview/researchContentsExpertiseHistory',
      }),

      eciValueData() {
        return this.disciplinesExpertiseStats.map((item) => [
          item.discipline_name,
          item.eci
        ]);
      },
      eciValueDataTable() {
        return [
          ...[['Discipline', 'Value']],
          ...this.eciValueData
        ];
      },
      eciValueOptions() {
        return {
          pieHole: 0.5,
          fontSize: 12,
          fontName: 'Roboto',
          legend: 'none',
          chartArea: {
            left: 16,
            top: 16,
            width: 200,
            height: 200
          },
          slices: chartGradient(this.eciValueData.length)
            .map((color) => ({
              color,
              textStyle: {
                color: switchColor(color)
              }
            }))
        };
      },
      eciValueEvents() {
        return {
          select: () => {
            const table = this.$refs.eciValueChart.chartObject;
            const selection = table.getSelection();
          }
        };
      },

      //=====================

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
          // console.log('----------')
        }
        return Object.keys(stamps).map((key) => [key, ...stamps[key]]);
      },
      eciOverviewDataTable() {
        return [
          ...[['Date', ...this.disciplinesExpertiseStats.map((item) => item.discipline_name)]],
          ...this.eciOverviewData
        ];
      },
      eciOverviewOptions() {
        return {
          legend: 'none',
          areaOpacity: 1,
          fontSize: 12,
          fontName: 'Roboto',
          lineWidth: 0,
          vAxis: {
            format: 'percent'
          },
          hAxis: {
            format: 'MMM d, y',
            gridlines: {

            }
          },
          // chartArea: {
          //   left: 50,
          //   top: 16,
          //   height: 200,
          // },
          explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          },
          series: chartGradient(this.eciOverviewData[0].length - 1)
            .map((color) => ({
              color
            }))
        };
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
          slices: chartGradient(this.eciValueData.length)
            .map((color) => ({
              color
            }))
        };
      },
    },
    created() {
      this.$store.dispatch('overview/getAll').then(() => {
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
    /*text[font-family="Roboto"] {*/
    /*  font-weight: 500;*/
    /*}*/
  }
</style>
