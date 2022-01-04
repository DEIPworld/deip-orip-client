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
        v-model="filterModel.domain"
        outlined
        hide-details
        :items="[{name: $t('defaultNaming.all'), _id: ''}, ...domains]"
        item-text="name"
        item-value="_id"
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
    domain: ''
  });

  export default {
    name: 'DomainsGrowthRate',
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
      domains() { return this.$store.getters['Domains/topLevelList'](); }
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

        const { step, domain } = this.filterModel;

        return this.$store.dispatch('domainsGrowthRate/get', {
          from: fromDate,
          to: toDate,
          domain: domain || '',
          step
        })
          .then(() => {
            const dataTable = [];

            this.$store.getters['domainsGrowthRate/list']
              .filter((it) => (this.filterModel.domain
                ? it._id === this.filterModel.domain
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
                  ...this.domains
                    .filter((item) => (this.filterModel.domain
                      ? item._id === this.filterModel.domain
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
