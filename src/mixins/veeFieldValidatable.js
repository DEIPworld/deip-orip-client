import { ValidationProvider } from 'vee-validate';

export const factory = (
  lazyRules = 'required',
  requiredProp = 'required'
) => ({
  name: 'VeeFieldValidatable',

  components: {
    ValidationProvider
  },

  ...(requiredProp ? {
    props: {
      [requiredProp]: {
        type: Boolean,
        default: false
      }
    }
  } : {}),

  data() {
    return {
      veeLazyRules: lazyRules
    };
  },

  computed: {
    $$isRequired() {
      return this[requiredProp];
    },

    $$veeRules() {
      return this.$$getVeeRules(this.veeLazyRules);
    }
  },
  methods: {
    $$getVeeRules(rules) {
      if (rules) {
        return this.$$isRequired ? rules : null;
      }

      return true;
    }
  }
});

export const VeeFieldValidatable = factory();
