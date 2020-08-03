<template>
  <d-block>
    <template #title>
      <slot name="title">
        Overview
      </slot>
    </template>
    <template #subtitle>
      <slot name="subtitle" />
    </template>
    <template #titleAddon>
      <slot name="titleAddon" />
    </template>

    <portal-target :name="`${portalKey}-filterPlaceholderStats`" slim />

    <v-row class="align-center">
      <v-col cols="3">
        <eci-metrics-stats-chart :data="data.expertiseHistory" />
      </v-col>
      <v-col>
        <eci-metrics-stats-info :data="data.expertiseStats" />
      </v-col>
    </v-row>

  </d-block>
</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import EciMetricsStatsChart from '@/components/EciMetrics/EciMetricsStats/EciMetricsStatsChart';
  import EciMetricsStatsInfo from '@/components/EciMetrics/EciMetricsStats/EciMetricsStatsInfo';

  export default {
    name: 'EciMetricsStats',
    components: { EciMetricsStatsInfo, EciMetricsStatsChart, DBlock },
    props: {
      data: {
        type: Object,
        default: () => ({})
      },
      portalKey: {
        type: String,
        default: undefined
      }
    }
  };
</script>
