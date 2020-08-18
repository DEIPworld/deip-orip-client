<template>
  <eci-stats-widget
    :loading="!$ready"
    :data="{ expertiseStats, expertiseStatsByDisciplines }"
  />
</template>

<script>
  import { metricsMixin } from '@/components/EciMetrics/mixins';
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { mapState } from 'vuex';
  import { eciStatsStore } from './store';
  import EciStatsWidget from '@/components/EciMetrics/EciStats/EciStatsWidget';

  export default {
    name: 'EciStats',
    components: { EciStatsWidget },
    mixins: [componentStoreFactory(eciStatsStore), metricsMixin],
    computed: {
      ...mapState({
        expertiseStats(state, getters) { return getters[`${this.storeNS}/expertiseStats`]; },
        expertiseStatsByDisciplines(state, getters) { return getters[`${this.storeNS}/expertiseStatsByDisciplines`]; }
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
          this.$store.dispatch(`${this.storeNS}/getExpertiseStatsByDisciplines`, this.payload)
        ]);
      }
    }
  };
</script>
