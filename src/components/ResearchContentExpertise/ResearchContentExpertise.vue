<template>
  <div v-if="$ready">
    <layout-section>
      <v-sheet :max-width="800">
        <div class="text-h4">
          {{ content.title }}
        </div>
        <div class="pt-2">
          <v-icon small>
            today
          </v-icon>
          Created {{ content.created_at | dateFormat('D MMM YYYY', true) }}
        </div>
      </v-sheet>

    </layout-section>
    <v-divider />
    <layout-section>
      <eci-metrics :content-id="content.external_id" enable-stats filter-position="top" />
    </layout-section>
  </div>
</template>

<script>

  import LayoutSection from '@/components/layout/components/LayoutSection';
  import EciMetrics from '@/components/EciMetrics/EciMetrics';
  import { mapGetters } from 'vuex';
  export default {
    name: 'ResearchContentExpertise',
    components: { EciMetrics, LayoutSection },
    computed: {
      ...mapGetters({
        content: 'rcd/content',
        research: 'rcd/research'
      })
    },
    created() {
      this.$store.dispatch('rcd/loadResearchContentDetails', {
        group_permlink: decodeURIComponent(this.$route.params.research_group_permlink),
        research_permlink: decodeURIComponent(this.$route.params.research_permlink),
        content_permlink: decodeURIComponent(this.$route.params.content_permlink),
        ref: this.$route.query.ref
      }).then(() => {
        this.$setReady();
      });
    }
  };
</script>

<style scoped>

</style>
