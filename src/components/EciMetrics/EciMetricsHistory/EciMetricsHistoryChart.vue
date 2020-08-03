<template>
  <d-chart-line :data="internalData" :options="internalOptions" />
</template>

<script>
  import deepmerge from 'deepmerge';
  import DChartLine from '@/components/Deipify/DChart/DChartLine';
  import moment from 'moment';

  export default {
    name: 'EciMetricsHistoryChart',
    components: { DChartLine },
    props: {
      options: {
        type: Object,
        default: () => ({})
      },

      data: {
        type: Array,
        default: () => ([])
      },
    },
    computed: {
      internalOptions() {
        const defaultOptions = {
          legend: 'none',
          explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          }
        };

        return deepmerge(defaultOptions, this.options);
      },

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
