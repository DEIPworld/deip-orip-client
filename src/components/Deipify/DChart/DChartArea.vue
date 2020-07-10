<template>
  <GChart
    ref="chart"
    class="chart"
    type="AreaChart"
    :data="data"
    :options="_options"
    style="width: 100%; height: 232px;"
  />
</template>

<script>
  import { AbstractChart } from '@/components/Deipify/DChart/abstractChart';
  import { chartGradient } from '@/plugins/charts';

  export default {
    name: 'DChartArea',

    mixins: [AbstractChart],

    computed: {
      defaultOptions() {
        return {
          areaOpacity: 0.5,
          lineWidth: 1,
          chartArea: {
            right: '5%',
            top: '5%',
            width: '90%',
            height: '80%'
          },
          explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          },
          series: chartGradient(this.data[0].length - 1)
            .map((color) => ({
              color
            }))
        };
      }
    }
  };
</script>
