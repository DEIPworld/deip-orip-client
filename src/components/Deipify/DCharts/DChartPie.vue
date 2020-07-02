<template>
  <GChart
    ref="chart"
    class="chart"
    type="PieChart"
    :data="data"
    :options="_options"
    :events="events"
    style="width: 100%; height: 232px;"
  />
</template>

<script>
  import deepmerge from 'deepmerge';
  import { chartGradient, switchColor } from '@/plugins/charts';
  import { AbstractChart } from '@/components/Deipify/DCharts/abstractChart';

  export default {
    name: 'DChartPie',

    mixins: [AbstractChart],

    props: {
      donut: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      _options() {
        const defaultOptions = {
          ...(this.donut ? { pieHole: 0.5 } : {}),
          fontSize: 12,
          fontName: 'Roboto',
          chartArea: {
            left: 16,
            top: 16,
            width: '100%',
            height: 200
          },
          slices: chartGradient(this.data.length - 1)
            .map((color) => ({
              color,
              textStyle: {
                color: switchColor(color)
              }
            }))
        };
        return deepmerge(defaultOptions, this.options);
      },

      events() {
        return {
          select: () => {
            const table = this.$refs.chart.chartObject;
            this.$emit('select', table.getSelection());
          }
        };
      }
    }
  };
</script>

<style scoped lang="scss">
  .chart {
    path[stroke-width="1"][stroke="#ffffff"] {
      stroke: transparent;
    }
  }
</style>
