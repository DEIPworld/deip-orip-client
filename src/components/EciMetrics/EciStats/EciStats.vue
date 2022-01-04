<template>
  <eci-stats-widget
    :loading="!$ready"
    :data="{ expertiseStats, expertiseStatsByDomains }"
  />
</template>

<script>
  import { metricsMixin } from '@/components/EciMetrics/mixins';
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { mapState } from 'vuex';
  import EciStatsWidget from '@/components/EciMetrics/EciStats/EciStatsWidget';
  import { eciStatsStore } from './store';

  export default {
    name: 'EciStats',
    components: { EciStatsWidget },
    mixins: [componentStoreFactory(eciStatsStore), metricsMixin],
    computed: {
      ...mapState({
        expertiseStats(state, getters) { return getters[`${this.storeNS}/expertiseStats`]; },
        expertiseStatsByDomains(state, getters) { return getters[`${this.storeNS}/expertiseStatsByDomains`]; }
      })
    },
    created() {
      this.updateData()
        .then(() => {
          this.$setReady();
        });
    },
    methods: {
      updateData() {
        return Promise.all([
          this.$store.dispatch(`${this.storeNS}/getExpertiseStats`, this.payload),
          this.$store.dispatch(`${this.storeNS}/getExpertiseStatsByDomains`, this.payload)
        ]);
      }
    }
  };
</script>
