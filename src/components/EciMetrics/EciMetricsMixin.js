import { componentStoreFactory } from '@/mixins/registerStore';
import { eciStore } from '@/components/EciMetrics/store';
import { mapState } from 'vuex';

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
      filterModel: {
        discipline: '',
        date: [],
        contribution: '',
        criteria: ''
      },

      loading: true
    };
  },

  computed: {
    ...mapState({
      expertiseHistory(state, getters) { return getters[`${this.storeNS}/expertiseHistory`]; },
      expertiseStats(state, getters) { return getters[`${this.storeNS}/expertiseStats`]; },
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
        ...(this.accountName ? { accountName: this.accountName } : {})
      };

      return Promise.all([
        ...(this.enableHistory ? [this.$store.dispatch(`${this.storeNS}/getExpertiseHistory`, payload)] : []),
        ...(this.enableStats ? [this.$store.dispatch(`${this.storeNS}/getExpertiseStats`, payload)] : [])
      ])
        .then(() => {
          this.loading = false;
        });
    }
  }
}
