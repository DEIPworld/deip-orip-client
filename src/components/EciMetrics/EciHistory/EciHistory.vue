<template>
  <d-block :title="$t('defaultNaming.eciDetailed')">
    <eci-filter
      v-model="filterModel"
      :disciplines="internalDisciplines"
      :contributions="internalContributions"
      :criterias="internalCriterias"
      :loading="!$ready"
    />

    <eci-history-chart
      :data="expertiseHistory"
      :loading="!$ready"
    />

    <eci-history-table
      :data="expertiseHistory"
      :loading="!$ready"
    />
  </d-block>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { eciHistoryStore } from '@/components/EciMetrics/EciHistory/store';
  import { mapState } from 'vuex';
  import { filterableMetrics, metricsMixin } from '@/components/EciMetrics/mixins';
  import EciHistoryChart from '@/components/EciMetrics/EciHistory/EciHistoryChart';
  import EciHistoryTable from '@/components/EciMetrics/EciHistory/EciHistoryTable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import EciFilter from '@/components/EciMetrics/EciFilter/EciFilter';

  export default {
    name: 'EciHistory',
    components: {
      DBlock,
      EciFilter,
      EciHistoryTable,
      EciHistoryChart
    },
    mixins: [
      componentStoreFactory(eciHistoryStore),
      metricsMixin,
      filterableMetrics
    ],
    computed: {
      ...mapState({
        expertiseHistory(state, getters) { return getters[`${this.storeNS}/expertiseHistory`]; }
      })
    },
    methods: {
      updateData() {
        this.$setReady(false);

        return Promise.all([
          this.$store.dispatch(`${this.storeNS}/getExpertiseHistory`, this.payload)
        ])
          .then(() => {
            this.$setReady(true);
          });
      }
    }
  };
</script>
