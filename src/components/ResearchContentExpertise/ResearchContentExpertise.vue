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
      <eci-history-and-stats
        :content-id="content.external_id"
      />
    </layout-section>
  </div>
</template>

<script>

  import LayoutSection from '@/components/layout/components/LayoutSection';
  import { mapGetters } from 'vuex';
  import EciHistoryAndStats from '@/components/EciMetrics/EciHistoryAndStats';

  export default {
    name: 'ResearchContentExpertise',
    components: { EciHistoryAndStats, LayoutSection },
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
