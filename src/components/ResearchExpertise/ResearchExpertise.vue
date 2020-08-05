<template>
  <div v-if="$ready">
    <layout-section>
      <v-sheet :max-width="800">
        <div class="text-h4">
          {{ research.title }}
        </div>
        <div class="pt-2">
          <v-icon small>
            today
          </v-icon>
          Created {{ research.created_at | dateFormat('D MMM YYYY', true) }}
        </div>
      </v-sheet>

    </layout-section>
    <v-divider />
    <layout-section>
      <eci-metrics :research-id="research.external_id" enable-stats filter-position="top" />
    </layout-section>
  </div>

</template>

<script>
  import EciMetrics from '@/components/EciMetrics/EciMetrics';
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ResearchExpertise',
    components: { LayoutSection, EciMetrics },
    computed: {
      ...mapGetters({
        research: 'rd/research',
      })
    },
    created() {
      this.$store.dispatch('rd/loadResearchDetails', {
        group_permlink: decodeURIComponent(this.$route.params.research_group_permlink),
        research_permlink: decodeURIComponent(this.$route.params.research_permlink)
      }).then(() => {
        this.$setReady();
      })
    }
  };
</script>
