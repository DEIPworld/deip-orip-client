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
          v-model="filter.disciplineExternalId"
          class="my-0 py-0"
          :items="research.disciplines"
          item-text="name"
          item-value="external_id"
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
        filter: {
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
        isPublished: 'rcd/isPublished',
        research: 'rcd/research',
        content: 'rcd/content'
      })
    },
    created() {
      if (this.isPublished) {
        const discipline = this.research.disciplines[0];
        this.filter.disciplineExternalId = discipline.external_id;
        this.loadDisciplineEciHistory();
      }
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

        return this.$store.dispatch('rcd/loadResearchContentEciHistoryRecords', {
            researchContentExternalId: this.content.external_id,
            ...filter
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
