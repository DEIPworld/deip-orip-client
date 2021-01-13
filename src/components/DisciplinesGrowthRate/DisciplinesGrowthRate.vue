<template>
  <d-block v-if="$ready" :title="$t('defaultNaming.growthRateOver')">
    <d-filter-block
      v-model="filterModel"
      :reset-model="resetFilterModel"
      :loading="loading"
      @apply="updateChartData()"
      @reset="updateChartData()"
    >
      <v-select
        v-model="filterModel.discipline"
        outlined
        hide-details
        :items="[{name: $t('defaultNaming.all'), externalId: ''}, ...disciplines]"
        item-text="name"
        item-value="externalId"
        :label="$t('defaultNaming.filters.domainField')"
      />

      <d-input-date
        v-model="filterModel.date"
        :label="$t('defaultNaming.filters.periodField')"
        :picker-props="{
          min: moment('2020-01-01').format('YYYY-MM-DD'),
          range: true
        }"
        :field-props="{
          clearable: true,
        }"
      />
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
          hAxis: {showTextEvery: parseInt(chartData.length / 6)},
          legend: {position: chartData[0].length > 2 ? 'right' : 'none'}
        }"
      />
    </v-skeleton-loader>
  </d-block>
</template>

<script>
  import { ECI_STAT_PERIOD_STEP_TYPE } from '@/variables';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DInputDate from '@/components/Deipify/DInput/DInputDate';
  import DChartColumn from '@/components/Deipify/DChart/DChartColumn';
  import DFilterBlock from '@/components/Deipify/DFilter/DFilterBlock';

  const defaultFilterModel = () => ({
    date: [],
    step: ECI_STAT_PERIOD_STEP_TYPE.UNKNOWN,
    discipline: ''
  });

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

        resetFilterModel: defaultFilterModel(),
        filterModel: defaultFilterModel(),

        loading: true
      };
    },

    computed: {
      disciplines() { return this.$store.getters['Disciplines/topLevelList'](); }
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

        const fromDate = this.dateISO(this.filterModel.date[0]);
        const toDate = this.dateISO(this.filterModel.date[1]);

        const { step, discipline } = this.filterModel;

        return this.$store.dispatch('disciplinesGrowthRate/get', {
          from: fromDate,
          to: toDate,
          discipline: discipline || '',
          step
        })
          .then(() => {
            const dataTable = [];

            this.$store.getters['disciplinesGrowthRate/list']
              .filter((it) => (this.filterModel.discipline
                ? it.external_id === this.filterModel.discipline
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
                    .filter((item) => (this.filterModel.discipline
                      ? item.externalId === this.filterModel.discipline
                      : true))
                    .map((item) => item.name)
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
