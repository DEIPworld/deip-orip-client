<template>
  <eci-metrics
    :disciplines="research.disciplines"
    :research-id="research.external_id"
    :contributions="false"
  />
</template>

<script>
  import { mapGetters } from 'vuex';
  import EciMetrics from '@/components/EciMetrics/EciMetrics';

  export default {
    name: 'ResearchDetailsEci',
    components: {
      EciMetrics
    },
    data() {
      return {
        eciHistoryRecords: [],
        eciHistoryLoading: false
      };
    },
    computed: {
      ...mapGetters({
        research: 'rd/research'
      })
    }
  };
</script>
