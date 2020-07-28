<template>
  <d-block v-if="$ready" title="Growth rate overview">
    <d-filter-block
      v-model="filter"
      :loading="loading"
      @apply="updateChartData()"
    >
      <v-col cols="2">
        <v-select
          v-model="filter.discipline"
          outlined
          hide-details
          :items="[{label: 'All', external_id: ''}, ...disciplines]"
          item-text="label"
          item-value="external_id"
          label="Disciplines"
        />
      </v-col>
      <v-col cols="2">
        <d-input-date
          v-model="filter.date"
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


    <v-skeleton-loader
      class="mt-6"
      :loading="loading"
      min-height="232px"
      type="chart"
      :types="{
        legend: 'table-cell@6',
        chart: 'image, legend'
      }"
    >
      <d-chart-column
        :data="chartData"
        :options="{
          vAxis: {format: '##%'},
          hAxis: {showTextEvery: 2},
          legend: {position: chartData[0].length > 2 ? 'right' : 'none'}
        }"
      />
    </v-skeleton-loader>
  </d-block>
</template>

<script>
  import { ECI_STAT_PERIOD_STEP_TYPE } from '@/variables';
  import { getTopLevelNodes } from '@/components/common/disciplines/DisciplineTreeService';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DChartColumn from '@/components/Deipify/DChart/DChartColumn';
  import DFilterBlock from '@/components/Deipify/DFilter/DFilterBlock';

  export default {
    name: 'DisciplinesGrowthRate',
    components: {
      DFilterBlock,
      DChartColumn,
      DInputDate,
      DBlock
    },
    data() {
      return {
        chartData: [],

        filter: {
          date: [],
          step: ECI_STAT_PERIOD_STEP_TYPE.UNKNOWN,
          discipline: ''
        },

        loading: true
      };
    },

    computed: {
      disciplines() {
        return getTopLevelNodes()
          .map((d) => ({
            external_id: d.id,
            label: d.label
          }));
      }
    },

    created() {
      this.updateChartData()
        .then(() => {
          this.$setReady();
        });
    },

    methods: {
      dateISO(date) {
        return date
          ? this.moment(date)
            .startOf('day')
            .toISOString(true)
            .split('.')[0]
          : '';
      },

      updateChartData() {
        this.loading = true;

        const fromDate = this.dateISO(this.filter.date[0]);
        const toDate = this.dateISO(this.filter.date[1]);

        const { step, discipline } = this.filter;

        return this.$store.dispatch('disciplinesGrowthRate/get', {
          from: fromDate,
          to: toDate,
          discipline: discipline || '',
          step
        })
          .then(() => {
            const dataTable = [];

            this.$store.getters['disciplinesGrowthRate/list']
              .filter((it) => (this.filter.discipline
                ? it.external_id === this.filter.discipline
                : true))
              .forEach((item, i) => {
                item.history.forEach((h, j) => {
                  if (i === 0) {
                    dataTable[j] = [this.moment(h.timestamp)
                      .format('DD MMM YY')];
                  }
                  dataTable[j].push({
                    v: h.growth_rate ? parseFloat(h.growth_rate) / 100 : 0.00,
                    f: h.growth_rate ? h.growth_rate : '0.00 %'
                  });
                });
              });

            if (!dataTable.length) {
              this.chartData = [['Date', ''], ['', 0]];
            } else {
              this.chartData = [
                [
                  'Date',
                  ...this.disciplines
                    .filter((item) => (this.filter.discipline
                      ? item.external_id === this.filter.discipline
                      : true))
                    .map((item) => item.label)
                ],
                ...dataTable
              ];
            }
            this.loading = false;
          });
      }
    }
  };
</script>

<style lang="scss">
  .v-skeleton-loader {
    $host: &;

    &__chart {
      display: grid;
      grid-template-areas: "ch l";
      grid-template-columns: 1fr 10%;
      grid-gap: 24px;
      min-height: inherit;

      #{$host}__image {
        grid-area: ch;
        height: 90%;
        border-radius: 4px;
      }

      #{$host}__legend {
        grid-area: l;
      }

      #{$host}__table-cell {
        width: 100px;
        height: 24px;
      }
    }
  }
</style>
