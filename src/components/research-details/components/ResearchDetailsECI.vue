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
          v-model="filter.disciplineExternalId"
          class="my-0 py-0"
          :items="research.disciplines"
          item-text="name"
          item-value="external_id"
          label="Discipline"
          outlined dense
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
        filter:{
          disciplineExternalId: '',
          fromDate: '',
          toDate: '',
          contribution: '',
          criteria: ''
        },

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
      const discipline = this.research.disciplines[0];
      this.filter.disciplineExternalId = discipline.external_id;
      this.loadDisciplineEciHistory();
    },
    methods: {
      loadDisciplineEciHistory() {
        this.eciHistoryLoading = true;

        const disciplineExternalId = this.filter.disciplineExternalId;
        const fromDate = this.filter.fromDate ? this.moment(this.filter.fromDate)
          .startOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const toDate = this.filter.toDate ? this.moment(this.filter.toDate)
          .endOf('day')
          .toISOString(true)
          .split('.')[0] : '';
        const contribution = this.filter.contribution;
        const criteria = this.filter.criteria;

        const filter = {
          discipline: disciplineExternalId,
          from: fromDate,
          to: toDate,
          contribution: contribution,
          criteria: criteria
        };

        return this.$store.dispatch('rd/loadResearchEciHistoryRecords', {
            researchExternalId: this.research.external_id,
            ...filter
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
