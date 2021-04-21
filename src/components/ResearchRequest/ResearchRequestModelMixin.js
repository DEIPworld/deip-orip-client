import kindOf from 'kind-of';
import { mapGetters } from 'vuex';
import { attributesChore } from '@/mixins/chores/attributesChore';

export const ResearchRequestModelMixin = {
  mixins: [attributesChore],
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
    }
  },

  computed: {
    ...mapGetters({
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
        attributes: [],
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

          if (type === 'string' && !fileFields.includes(key)) {
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
    this.$$projectAttributes.forEach((item) => {
      if (item.isPublished) {
        this.formData.attributes.push({
          attributeId: item._id,
          type: 'stepper',
          value: null
        });
      } else {
        this.formData.attributes.push({
          attributeId: item._id,
          type: 'stepper',
          value: null
        });
      }
    });
  }
};
