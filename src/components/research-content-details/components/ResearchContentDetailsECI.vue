<template>
  <div class="py-6">
    <eci-metrics
      v-if="isPublished"
      :content-id="content.external_id"
      :disciplines="research.disciplines"
      :contributions="false"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import EciMetrics from '@/components/EciMetrics/EciMetrics';

  export default {
    name: 'ResearchContentDetailsECI',
    components: { EciMetrics },
    data() {
      return {
        eciHistoryRecords: [],
        eciHistoryLoading: false
      };
    },
    computed: {
      ...mapGetters({
        isPublished: 'rcd/isPublished',
        research: 'rcd/research',
        content: 'rcd/content'
      })
    }
  };
</script>
