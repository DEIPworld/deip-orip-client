import Proxyable from 'vuetify/lib/mixins/proxyable';
import kindOf from 'kind-of';
import RecursiveIterator from 'recursive-iterator';

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

      for (const { parent, node } of new RecursiveIterator(this.internalValue)) {
        if (kindOf(node) === 'array' && node.length) {
          count += 1;
        }
        if (kindOf(node) === 'string' && node && kindOf(parent) !== 'array') {
          count += 1;
        }
        if (kindOf(node) === 'boolean' && node && kindOf(parent) !== 'array') {
          count += 1;
        }
      }

      this.filterCount = count;
    },

    equaliseModels() {
      this.$nextTick(() => {
        this.updatedValue = JSON.stringify(this.internalValue);
      });
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
