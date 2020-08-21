<template>
  <v-skeleton-loader
    class="mt-6"
    :loading="loading"
    min-height="232px"
    type="image"
  >
    <d-chart-line :data="internalData" :options="chartOptions" />
  </v-skeleton-loader>
</template>

<script>
  import DChartLine from '@/components/Deipify/DChart/DChartLine';
  import { DataLoadable } from '@/mixins/dataLoadable';
  import moment from 'moment';

  export default {
    name: 'EciHistoryChart',
    components: { DChartLine },
    mixins: [DataLoadable],

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
          moment()
            .toDate(),
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
