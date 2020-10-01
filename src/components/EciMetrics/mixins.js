import { getTopLevelNodes } from '@/components/common/disciplines/DisciplineTreeService';
import { mapSelectListFromEnum } from '@/utils/mapSelectListFromEnum';
import { ASSESSMENT_CRITERIA_TYPE, EXPERTISE_CONTRIBUTION_TYPE } from '@/variables';

export const defaultFilterModel = () => ({
  discipline: '',
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

    researchId: {
      type: String,
      default: undefined
    },

    accountName: {
      type: String,
      default: undefined
    },

    disciplines: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    payload() {
      return {
        filter: this.filterModel || {},
        ...(this.contentId ? { contentId: this.contentId } : {}),
        ...(this.researchId ? { researchId: this.researchId } : {}),
        ...(this.accountName ? { accountName: this.accountName } : {}),
        ...(this.disciplines ? { disciplines: this.disciplines } : {})
      };
    }
  }
};

export const filterableMetrics = {
  props: {
    filterDisciplines: {
      type: [Array, Boolean],
      default: () => getTopLevelNodes()
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
    internalDisciplines() {
      return this.filterDisciplines
        .map((d) => ({
          external_id: d.external_id || d.id,
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
