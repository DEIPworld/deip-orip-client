import Proxyable from 'vuetify/lib/mixins/proxyable';
import kindOf from 'kind-of';

export const Filterable = {
  mixins: [Proxyable],

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      updatedValue: undefined,
      filterCount: 0
    };
  },

  computed: {
    filterChanged() {
      return JSON.stringify(this.updatedValue) !== JSON.stringify(this.internalValue);
    }
  },

  created() {
    this.equaliseModels();
    this.setCount()
  },

  methods: {
    onApply() {
      this.$emit('apply');

      this.equaliseModels();
      this.setCount();
    },

    onReset() {
      this.$emit('reset');

      this.$nextTick(() => {
        this.equaliseModels();
        this.setCount();
      })
    },

    setCount() {
      let count = 0;

      for (const key of Object.keys(this.internalValue)) {
        const type = kindOf(this.internalValue[key]);

        if ((type === 'string' || type === 'number') && this.internalValue[key]) {
          count++;
        }

        if (type === 'array' && this.internalValue[key].length) {
          count++;
        }

        if (type === 'object' && this.internalValue[key]) {
          count++;
        }
      }

      this.filterCount = count;
    },

    equaliseModels() {
      if (kindOf(this.internalValue) === 'object') {
        this.updatedValue = { ...this.internalValue };
      } else if (kindOf(this.internalValue) === 'array') {
        this.updatedValue = [...this.internalValue];
      } else {
        this.updatedValue = this.internalValue;
      }
    }
  }
};
