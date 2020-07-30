<template>
  <div>
    <eci-history
      :data="eciHistoryRecords"
      :disciplines="research.disciplines"
      :loading="eciHistoryLoading"
      @updateData="loadDisciplineEciHistory"
    >
      <template #eciHeader>
        <div class="d-flex">
          <v-icon class="mr-5" large color="grey lighten-2">
            mdi-poll-box
          </v-icon>
          <div class="text-h6 my-auto">
            Expertise Contribution Index
          </div>
        </div>
      </template>
    </eci-history>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import EciHistory from '@/components/EciHistory/EciHistory';

  export default {
    name: 'ResearchDetailsEci',
    components: { EciHistory },
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
    },
    created() {
      this.loadDisciplineEciHistory();
    },
    methods: {
      loadDisciplineEciHistory(updatedFilter = {}) {
        this.eciHistoryLoading = true;

        return this.$store.dispatch('rd/loadResearchEciHistoryRecords', {
          researchExternalId: this.research.external_id,
          ...updatedFilter
        })
          .then(() => {
            const records = this.$store.getters['rd/eciHistoryByDiscipline'];
            this.eciHistoryRecords = records;
            this.eciHistoryLoading = false;
          });
      },
      reloadDisciplineEciHistory() {
        return this.loadDisciplineEciHistory();
      }
    }
  };
</script>
