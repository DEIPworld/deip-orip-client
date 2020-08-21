<template>
  <v-skeleton-loader
    :loading="loading"
    min-height="232px"
    type="pie-chart"
    :types="{
      'pie-chart': 'avatar',
    }"
  >
    <d-chart-pie
      donut
      :data="internalData"
      :options="{
        legend: {alignment: 'center'}
      }"
    />
  </v-skeleton-loader>
</template>

<script>
  import DChartPie from '@/components/Deipify/DChart/DChartPie';
  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
  import { DataLoadable } from '@/mixins/dataLoadable';

  export default {
    name: 'EciHistoryContributionsChart',
    components: { DChartPie },
    mixins: [DataLoadable],

    data() {
      return {
        contributionTypeNameMap: {
          [EXPERTISE_CONTRIBUTION_TYPE.UNKNOWN]: 'Graduation',
          [EXPERTISE_CONTRIBUTION_TYPE.PUBLICATION]: 'Research',
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW]: 'Review',
          [EXPERTISE_CONTRIBUTION_TYPE.REVIEW_SUPPORT]: 'Review support'
        }
      };
    },

    computed: {
      internalData() {
        const contributions = this.data.filter((item) => item.contribution_type !== EXPERTISE_CONTRIBUTION_TYPE.UNKNOWN);

        const allocations = contributions.reduce((acc, item) => {
          if (acc[item.contribution_type] === undefined) {
            acc[item.contribution_type] = 0;
          }
          acc[item.contribution_type] += 1;
          return acc;
        }, {});

        return [
          ['Contribution Type', 'Value'],
          ...Object.entries(allocations)
            .map((e) => {
              const contribution = e[0];
              return [this.contributionTypeNameMap[contribution], e[1]];
            })
        ];
      }
    }
  };
</script>

<style lang="scss">
  .v-skeleton-loader {
    $host: &;

    &__pie-chart {
      #{$host}__avatar {
        height: 200px;
        width: 200px;
        margin: 16px;
      }
    }
  }
</style>
