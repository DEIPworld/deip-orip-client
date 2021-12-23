import { mapSelectListFromEnum } from '@/utils/mapSelectListFromEnum';
import { ASSESSMENT_CRITERIA_TYPE, EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

export const defaultFilterModel = () => ({
  domain: '',
  date: [],
  contribution: '',
  criteria: ''
});

export const metricsMixin = {
  props: {

    contentId: {
      type: String,
      default: undefined
    },

    projectId: {
      type: String,
      default: undefined
    },

    accountName: {
      type: String,
      default: undefined
    },

    domains: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    payload() {
      return {
        filter: this.filterModel || {},
        ...(this.contentId ? { contentId: this.contentId } : {}),
        ...(this.projectId ? { projectId: this.projectId } : {}),
        ...(this.accountName ? { accountName: this.accountName } : {}),
        ...(this.domains ? { domains: this.domains } : {})
      };
    }
  }
};

export const filterableMetrics = {
  props: {
    filterDomains: {
      type: [Array, Boolean],
      default() { return this.$store.getters['Domains/topLevelList'](); }
    },
    filterCriterias: {
      type: [Array, Boolean],
      default() {
        return mapSelectListFromEnum(ASSESSMENT_CRITERIA_TYPE, {
          blackList: [ASSESSMENT_CRITERIA_TYPE.UNKNOWN],
          allowBlank: true,
          blankLabel: this.$t('defaultNaming.all')
        });
      }
    },
    filterContributions: {
      type: [Array, Boolean],
      default() {
        return mapSelectListFromEnum(EXPERTISE_CONTRIBUTION_TYPE, {
          blackList: [ASSESSMENT_CRITERIA_TYPE.UNKNOWN],
          allowBlank: true,
          blankLabel: this.$t('defaultNaming.all')
        });
      }
    }
  },
  data() {
    return {
      filterModel: defaultFilterModel()
    };
  },
  computed: {
    internalDomains() {
      return this.filterDomains
        .map((d) => ({
          _id: d._id,
          label: d.label || d.name
        }));
    },

    internalCriterias() {
      return this.filterCriterias;
    },

    internalContributions() {
      return this.filterContributions;
    }
  },
  watch: {
    filterModel(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.updateData();
      }
    }
  },
  created() {
    this.updateData();
  },
  methods: {
    updateData() {
      this.$setReady(false);

      return Promise.resolve(true)
        .then(() => {
          this.$setReady(true);
        });
    }
  }
};
