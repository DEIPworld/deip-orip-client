<template>
  <app-layout v-if="$ready">
    <layout-section>
      <v-row>
        <v-col cols="4">
          <div class="text-h5">
            Expertise contribution index value
          </div>
          <div class="text-body-2 text--secondary">
            Last update 05 May 2020
          </div>
          <d-chart-pie
            donut
            :data="eciValueDataTable"
            :options="{legend: 'none'}"
            @select="goToParticipants"
          />
        </v-col>

        <v-col cols="8">
          <div class="text-h5">
            Expertise contribution index overview
          </div>
          <div class="text-body-2 text--secondary">
            Last update 05 May 2020
          </div>
          <d-chart-area
            :data="eciOverviewDataTable"
            :options="{legend: 'none', vAxis: { format: '##%' } }"
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

      <v-row class="pt-4">
        <v-col cols="10">
          <div class="text-h5">
            Growth rate overview
          </div>
          <v-row>
            <v-col>
              <v-menu
                v-model="growthRateFromDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="growthRateFromDate"
                    label="From"
                    readonly
                    filled
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="growthRateFromDate"
                  type="month"
                  :max="moment(growthRateToDate).subtract(1, 'days').format('YYYY-MM-DD')"
                  :min="moment('2018-01-01').format('YYYY-MM-DD')"
                  @input="changegrowthRateData"
                />
              </v-menu>
            </v-col>
            <v-col>
              <v-menu
                v-model="growthRateToDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="growthRateToDate"
                    label="To"
                    readonly
                    filled
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="growthRateToDate"
                  type="month"
                  :max="moment().format('YYYY-MM')"
                  :min="moment(growthRateFromDate).add(1, 'days').format('YYYY-MM')"
                  @input="changegrowthRateData"
                />
              </v-menu>
            </v-col>
            <v-col>
              <v-select
                v-model="growthRateDiscipline"
                filled
                :items="[ ,disciplines]"
                label="Disciplines"
                @input=""
              />
            </v-col>
          </v-row>
          <GChart
            ref="donutChart"
            class="chart mt-6"
            type="ColumnChart"
            :data="chartData"
            :options="chartOptions"
            :settings="{ packages: ['corechart'] }"
            style="width: 100%; height: 232px;"
          />
        </v-col>
      </v-row>

      <v-sheet>
        <div class="text-h5">
          Expertise Contribution Index detailed overview
        </div>

        <v-row>
          <v-col cols="3">
            <d-input-date
              v-model="eciOverviewFilter.dateFrom"
              label="From"
            />
          </v-col>
          <v-col cols="3">
            <d-input-date
              v-model="eciOverviewFilter.dateTo"
              label="To"
            />
          </v-col>
          <v-col cols="3">
            <v-select filled label="Assessment criteria" />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="eciOverviewFilter.discipline"
              label="Disciplines"
              filled
              :items="disciplines"
              item-text="label"
              item-value="external_id"
            />
          </v-col>
        </v-row>

        <!--        <GChart-->
        <!--          type="LineChart"-->
        <!--          :data="eciDisciplineHistoryRecordsChart.data"-->
        <!--          :options="eciDisciplineHistoryRecordsChart.options"-->
        <!--        />-->
      </v-sheet>
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

  export default {
    name: 'Overview',
    components: {
      DChartArea,
      DChartPie,
      DInputDate,
      LayoutSection,
      AppLayout
    },
    data() {
      return {
        eciOverviewFilter: {
          discipline: null,
          dateFrom: '2020-06-11',
          dateTo: '2020-07-02'
        },

        growthRateFromDateMenu: false,
        growthRateToDateMenu: false,
        growthRateFromDate: this.moment()
          .subtract(7, 'days')
          .format('YYYY-MM'),
        growthRateToDate: this.moment()
          .format('YYYY-MM'),
        growthRateDiscipline: '',
        // disciplines: ['Geomchemisty', 'Biology', 'Chemistry', 'Physics', 'Genetics', 'Bioinformatics', 'Genomics', 'Bioacoustics']
      };
    },
    methods: {
      changegrowthRateData() {

      },
      goToParticipants(e) {
        console.log(e);
      },


      loadDisciplineEciHistory() { // temp
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
    },

    computed: {
      ...mapGetters({
        disciplinesExpertiseStats: 'overview/disciplinesExpertiseStats',
        disciplinesExpertiseStatsHistory: 'overview/disciplinesExpertiseStatsHistory',
        researchContentsExpertiseHistory: 'overview/researchContentsExpertiseHistory'
      }),

      disciplines() {
        return getTopLevelNodes().map((d) => ({ external_id: d.id, label: d.label }));
      },

      chartData() {
        return [
          ['Month', ...this.disciplines],
          [{
            v: '2020-01',
            f: 'Jun'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-02',
            f: 'Feb'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-03',
            f: 'Mar'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-04',
            f: 'Apr'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-05',
            f: 'May'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-06',
            f: 'June'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-07',
            f: 'July'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-08',
            f: 'Aug'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-09',
            f: 'Sep'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-10',
            f: 'Oct'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-11',
            f: 'Nov'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }],
          [{
            v: '2020-12',
            f: 'Dec'
          }, {
            v: 0.018,
            f: '1.8%'
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.021,
            f: `${this.toDeipPercent(0.021)}%`
          }, {
            v: 0.016,
            f: `${this.toDeipPercent(0.016)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.015,
            f: `${this.toDeipPercent(0.015)}%`
          }, {
            v: 0.005,
            f: `${this.toDeipPercent(0.005)}%`
          }, {
            v: 0.01,
            f: `${this.toDeipPercent(0.01)}%`
          }]
          // ['Feb', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['Mar', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['Apr', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['May', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['June', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['July', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['Aug', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['Sep', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['Oct', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['Nov', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
          // ['Dec', 1.8, 0.5, 2.1, 1.7, 1.5, 1.5, 0.5, 1.0],
        ].filter((item, i) => {
          if (i != 0) {
            console.log(item[0].v);
            return this.moment(item[0].v)
              .isSameOrBefore(this.growthRateToDate) && this.moment(item[0].v)
              .isSameOrAfter(this.growthRateFromDate);
          }
        });
      },
      chartOptions() {
        return {
          chart: {
            title: 'Company Performance',
            subtitle: 'Sales, Expenses, and Profit: 2014-2017'
          },
          vAxis: {
            format: 'percent'
          },
          series: chartGradient(this.chartData[0].length - 1)
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
      this.$store.dispatch('overview/getAll')
        .then(() => {
          this.eciOverviewFilter.discipline = this.disciplines[0].external_id

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
