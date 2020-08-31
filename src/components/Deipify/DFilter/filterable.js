import Proxyable from 'vuetify/lib/mixins/proxyable';
import kindOf from 'kind-of';

export const Filterable = {
  mixins: [Proxyable],

  props: {
    loading: {
      type: Boolean,
      default: false
    },
    resetModel: {
      type: [Object, Array, String, Number, Boolean],
      default: () => ({})
    }
  },

  data() {
    return {
      updatedValue: undefined,
      resetVisible: false,
      filterCount: 0
    };
  },

  computed: {
    filterChanged() {
      return JSON.stringify(this.internalValue) !== this.updatedValue;
    }
  },

  created() {
    this.process();
  },

  methods: {
    onApply() {
      this.$emit('apply');

      this.process();
    },

    onReset() {
      this.internalValue = this.resetModel;

      this.$emit('reset');

      this.$nextTick(() => {
        this.process();
      });
    },

    setCount() {
      let count = 0;

      for (const key of Object.keys(this.internalValue)) {
        const type = kindOf(this.internalValue[key]);

        if ((type === 'string' || type === 'number') && this.internalValue[key]) {
          count += 1;
        }

        if (type === 'array' && this.internalValue[key].length) {
          count += 1;
        }

        if (
          type === 'object'
          && this.internalValue[key]
          && Object.keys(this.internalValue[key])
            .filter((k) => this.internalValue[key][k].length).length
        ) {
          count += 1;
        }
      }

      this.filterCount = count;
    },

    equaliseModels() {
      this.updatedValue = JSON.stringify(this.internalValue)
      // if (kindOf(this.internalValue) === 'object') {
      //   this.updatedValue = mergeDeep({}, this.internalValue);
      // } else if (kindOf(this.internalValue) === 'array') {
      //   this.updatedValue = [...this.internalValue];
      // } else {
      //   this.updatedValue = this.internalValue;
      // }
    },

    setReset() {
      this.resetVisible = JSON.stringify(this.resetModel) !== JSON.stringify(this.internalValue);
    },

    process() {
      this.equaliseModels();
      this.setCount();
      this.setReset();
    }
  }
};
