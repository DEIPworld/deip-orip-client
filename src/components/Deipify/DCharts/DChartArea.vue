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
  import { AbstractChart } from '@/components/Deipify/DCharts/abstractChart';
  import { chartGradient, switchColor } from '@/plugins/charts';
  import deepmerge from 'deepmerge';

  export default {
    name: 'DChartArea',

    mixins: [AbstractChart],

    computed: {
      _options() {
        const defaultOptions = {
          areaOpacity: 0.5,
          fontSize: 12,
          fontName: 'Roboto',
          lineWidth: 1,
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
        return deepmerge(defaultOptions, this.options);
      }
    }
  };
</script>

<style scoped>

</style>
