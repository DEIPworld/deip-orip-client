import kindOf from 'kind-of';
import { mapGetters } from 'vuex';

export const ResearchRequestModelMixin = {
  props: {
    researchId: {
      type: String,
      default: null
    },
    viewProps: {
      type: Object,
      default: () => ({})
    },
    getFrom: {
      type: String,
      default: null
    },
  },

  computed: {
    ...mapGetters({
      tenant: 'auth/tenant',
      user: 'auth/user'
    })
  },

  data() {
    return {
      formData: {
        researchTitle: null,
        description: null,
        researchDisciplines: [],
        location: {
          city: null,
          country: null
        },
        problem: null,
        solution: null,
        tenantCriterias: [],
        funding: null,
        eta: null,

        budgetAttachment: null,
        businessPlanAttachment: null,
        cvAttachment: null,
        marketResearchAttachment: null

      },

      formValid: false,
      formProcessing: false
    };
  },

  methods: {
    createFormData(model) {
      const formData = new FormData();

      const fileFields = [
        'budgetAttachment',
        'businessPlanAttachment',
        'cvAttachment',
        'marketResearchAttachment'
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(model)) {
        if (model[key]) {
          const type = kindOf(model[key]);

          if (type === 'object' || type === 'array') {
            formData.append(key, JSON.stringify(model[key]));
          }

          if (type === 'string' && !fileFields.includes(key))  {
            formData.append(key, model[key]);
          }

          if (type === 'file') {
            formData.append(key, model[key], model[key].name);
          }
        }
      }

      return formData;
    }
  },

  created() {
    this.$store.getters['auth/tenant'].profile.settings.researchComponents.forEach((item) => {
      if (item.isVisible) {
        this.formData.tenantCriterias.push({
          component: item._id,
          type: 'stepper',
          value: {
            index: 0
          }
        });
      } else {
        this.formData.tenantCriterias.push({
          component: item._id,
          type: 'stepper',
          value: {
            index: null
          }
        });
      }
    });
  }
}
