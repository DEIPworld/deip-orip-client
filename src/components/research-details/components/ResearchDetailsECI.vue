<template>
  <div>
    <v-row>
      <v-col cols="auto" class="pr-4">
        <v-icon large color="grey lighten-2">
          mdi-poll-box
        </v-icon>
      </v-col>
      <v-col class="text-h6">
        Expertise Contribution Index
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
          @change="loadDisciplineEciHistory"
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
    name: 'ResearchDetailsEci',
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
        research: 'rd/research',
        eciHistoryByDisciplineMap: 'rd/eciHistoryByDisciplineMap'
      })
    },
    created() {
      const discipline = this.research.disciplines[0];
      this.selectedEciDisciplineId = discipline.id;
      this.loadDisciplineEciHistory();
    },
    methods: {
      loadDisciplineEciHistory() {
        const disciplineId = this.selectedEciDisciplineId;
        const researchId = this.research.id;
        this.eciHistoryLoading = true;
        const cachedRecords = this.$store.getters['rd/eciHistoryByDiscipline'](
          disciplineId
        );
        if (cachedRecords == null) {
          this.$store
            .dispatch('rd/loadResearchEciHistoryRecords', {
              researchId,
              disciplineId
            })
            .then(() => {
              const records = this.$store.getters['rd/eciHistoryByDiscipline'](
                disciplineId
              );
              this.eciHistoryRecords = records;
              this.eciHistoryLoading = false;
            });
        } else {
          this.eciHistoryRecords = cachedRecords;
          this.eciHistoryLoading = false;
        }
      },
      reloadDisciplineEciHistory() {
        const disciplineIds = Object.keys(this.eciHistoryByDisciplineMap);
        const promises = [];
        for (let i = 0; i < disciplineIds.length; i++) {
          const disciplineId = disciplineIds[i];
          promises.push(
            this.$store.dispatch('rd/loadResearchEciHistoryRecords', {
              researchId: this.research.id,
              disciplineId
            })
          );
        }
        return Promise.all(promises)
          .then(() => this.loadDisciplineEciHistory());
      }
    }
  };
</script>
