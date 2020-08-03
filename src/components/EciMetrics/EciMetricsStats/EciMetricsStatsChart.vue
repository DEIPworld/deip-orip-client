<template>
  <div>
    <d-chart-pie
      donut
      :data="internalData"
      :options="{
        legend: {alignment: 'center'}
      }"
    />
  </div>

</template>

<script>
  import DChartPie from '@/components/Deipify/DChart/DChartPie';
  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

  export default {
    name: 'EciMetricsStatsChart',
    components: { DChartPie },
    props: {
      data: {
        type: Array,
        default: () => ([])
      }
    },

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
