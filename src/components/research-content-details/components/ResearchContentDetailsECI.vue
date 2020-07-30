<template>
  <div class="py-6">
    <eci-history
      :data="eciHistoryRecords"
      :disciplines="research.disciplines"
      :loading="eciHistoryLoading"
      @updateData="loadDisciplineEciHistory"
    >
      <template #eciHeader>
        <div class="half-bold title">
          Expertise Contribution Index
        </div>
      </template>
    </eci-history>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import EciHistory from '@/components/EciHistory/EciHistory';

  export default {
    name: 'ResearchContentDetailsECI',
    components: { EciHistory },
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
    },
    created() {
      if (this.isPublished) {
        this.loadDisciplineEciHistory();
      }
    },
    methods: {
      loadDisciplineEciHistory(updatedFilter = {}) {
        this.eciHistoryLoading = true;

        return this.$store.dispatch('rcd/loadResearchContentEciHistoryRecords', {
          researchContentExternalId: this.content.external_id,
          ...updatedFilter
        })
          .then(() => {
            const records = this.$store.getters['rcd/eciHistoryByDiscipline'];
            this.eciHistoryRecords = records;
            this.eciHistoryLoading = false;
          });
      }
    }
  };
</script>
