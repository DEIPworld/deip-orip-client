<template>
  <div class="py-6">
    <v-row no-gutters align="center">
      <v-col>
        <div class="half-bold title">
          Expertise Contribution Index
        </div>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-select
          v-model="selectedEciDisciplineId"
          class="my-0 py-0"
          :items="research.disciplines"
          item-text="name"
          item-value="id"
          label="Discipline"
          filled
          dense
          :disabled="eciHistoryLoading"
          @change="loadDisciplineEciHistory()"
        />
      </v-col>
    </v-row>

    <eci-history
      :data="eciHistoryRecords"
    />

  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';
  import { EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';
  import EciHistory from '@/components/EciHistory/EciHistory';

  export default {
    name: 'ResearchContentDetailsECI',
    components: { EciHistory },
    data() {
      return {
        selectedEciDisciplineId: null,

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
        const discipline = this.research.disciplines[0];
        this.selectedEciDisciplineId = discipline.id;
        this.loadDisciplineEciHistory();
      }
    },
    methods: {
      loadDisciplineEciHistory() {
        const disciplineId = this.selectedEciDisciplineId;
        const researchContentId = this.content.id;

        this.eciHistoryLoading = true;
        const cachedRecords = this.$store.getters['rcd/eciHistoryByDiscipline'](
          disciplineId
        );
        if (cachedRecords == null) {
          this.$store
            .dispatch('rcd/loadResearchContentEciHistoryRecords', {
              researchContentId,
              disciplineId
            })
            .then(() => {
              const records = this.$store.getters['rcd/eciHistoryByDiscipline'](
                disciplineId
              );
              this.eciHistoryRecords = records;
              this.eciHistoryLoading = false;
            });
        } else {
          this.eciHistoryRecords = cachedRecords;
          this.eciHistoryLoading = false;
        }
      }
    }
  };
</script>
