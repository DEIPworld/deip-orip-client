<template>
  <d-block>
    <template #title>
      <slot name="title">
        Expertise Contribution Index
      </slot>
    </template>
    <template #subtitle>
      <slot name="subtitle" />
    </template>
    <template #titleAddon>
      <slot name="titleAddon" />
    </template>

    <portal-target :name="`${portalKey}-filterPlaceholderHistory`" slim />

    <eci-metrics-history-chart :data="data" :options="chartOptions" />
    <eci-metrics-history-table :data="data" />

  </d-block>
</template>

<script>
  import EciMetricsHistoryChart from '@/components/EciMetrics/EciMetricsHistory/EciMetricsHistoryChart';
  import EciMetricsHistoryTable from '@/components/EciMetrics/EciMetricsHistory/EciMetricsHistoryTable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  export default {
    name: 'EciMetricsHistory',
    components: { DBlock, EciMetricsHistoryTable, EciMetricsHistoryChart },
    props: {
      data: {
        type: Array,
        default: () => ([])
      },
      portalKey: {
        type: String,
        default: undefined
      },
      chartOptions: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
