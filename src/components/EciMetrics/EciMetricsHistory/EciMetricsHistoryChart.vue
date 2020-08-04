<template>
  <d-chart-line :data="internalData" :options="chartOptions" />
</template>

<script>
  import deepmerge from 'deepmerge';
  import DChartLine from '@/components/Deipify/DChart/DChartLine';
  import moment from 'moment';

  export default {
    name: 'EciMetricsHistoryChart',
    components: { DChartLine },
    props: {
      data: {
        type: Array,
        default: () => ([])
      },
    },

    data() {
      return {
        chartOptions: {
          legend: 'none',
          explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          }
        }
      };
    },

    computed: {
      internalData() {
        const chartData = this.data.map((item) => [
          new Date(item.timestamp),
          item.eci
        ]);

        const lastPoint = [
          moment().toDate(),
          this.data.length ? this.data[this.data.length - 1].eci : 0
        ];

        return [
          ['Date', 'Value'],
          ...chartData,
          lastPoint
        ];
      }
    }
  };
</script>
