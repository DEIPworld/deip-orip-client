import { componentStoreFactory } from '@/mixins/registerStore';
import { eciStore } from '@/components/EciMetrics/store';
import { mapState } from 'vuex';

export const defaultFilterModel = () => ({
  discipline: '',
  date: [],
  contribution: '',
  criteria: ''
});

export const EciMetricsMixin = {
  mixins: [componentStoreFactory(eciStore)],

  props: {
    enableStats: {
      type: Boolean,
      default: false
    },

    enableHistory: {
      type: Boolean,
      default: true
    },

    disciplines: {
      type: Array,
      default: () => ([])
    },

    contentId: {
      type: String,
      default: undefined
    },

    researchId: {
      type: String,
      default: undefined
    },

    accountName: {
      type: String,
      default: undefined
    }
  },

  data() {
    return {
      resetFilterModel: defaultFilterModel(),
      filterModel: defaultFilterModel(),

      loading: true
    };
  },

  computed: {
    ...mapState({
      expertiseHistory(state, getters) { return getters[`${this.storeNS}/expertiseHistory`]; },
      expertiseHistoryByDisciplines(state, getters) { return getters[`${this.storeNS}/expertiseHistoryByDisciplines`]; },
      expertiseStats(state, getters) { return getters[`${this.storeNS}/expertiseStats`]; },
      expertiseStatsByDisciplines(state, getters) { return getters[`${this.storeNS}/expertiseStatsByDisciplines`]; }
    })
  },

  created() {
    for (const key of Object.keys(this.filterModel)) {
      if (this.$route.query[key]) {
        this.filterModel[key] = this.$route.query[key];
      }
    }

    this.updateData()
      .then(() => {
        this.$setReady();
      });
  },

  methods: {
    updateData() {
      this.loading = true;

      const payload = {
        filter: this.filterModel,
        ...(this.contentId ? { contentId: this.contentId } : {}),
        ...(this.researchId ? { researchId: this.researchId } : {}),
        ...(this.accountName ? { accountName: this.accountName } : {}),
        ...(this.disciplines ? { disciplines: this.disciplines } : {})
      };

      return Promise.all([
        ...(this.enableHistory ? [this.$store.dispatch(`${this.storeNS}/getExpertiseHistory`, payload)] : []),

        ...(this.enableStats ? [this.$store.dispatch(`${this.storeNS}/getExpertiseStats`, payload)] : []),
        ...(this.enableStats && this.disciplines ? [this.$store.dispatch(`${this.storeNS}/getExpertiseStatsByDisciplines`, payload)] : [])
      ])
        .then(() => {
          this.loading = false;
        });
    }
  }
}
