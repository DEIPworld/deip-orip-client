<template>
  <GChart
    ref="chart"
    class="chart"
    type="ColumnChart"
    :data="data"
    :options="_options"
    style="width: 100%; height: 232px;"
  />
</template>

<script>
  import { AbstractChart } from '@/components/Deipify/DChart/abstractChart';
  import { chartGradient } from '@/plugins/charts';

  export default {
    name: 'DChartColumn',

    mixins: [AbstractChart],

    computed: {
      defaultOptions() {
        return {
          areaOpacity: 0.5,
          lineWidth: 1,
          chartArea: {
            top: '5%',
            left: '5%',
            width: '85%',
            height: '80%'
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
