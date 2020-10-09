import { isArray } from '@/utils/helpers';
import Proxyable from 'vuetify/lib/mixins/proxyable';

export const arrayedModel = {
  mixins: [Proxyable],
  data() {
    return {
      internalLazyValue: this.value !== undefined
        ? this.value
        : []
    };
  },
  created() {
    if (!isArray(this.internalValue)) {
      console.warn('Model must be bound to an Array.', this.$options.name);
    }
  }
};

export const nulledModel = {
  mixins: [Proxyable],
  data() {
    return {
      internalLazyValue: this.value !== undefined
        ? this.value
        : null
    };
  },
  created() {
    if (this.value === undefined) {
      this.$emit('change', this.internalValue);
    }
  }
};

export const arrayModelAddFactory = (defModel) => ({
  mixins: [arrayedModel],

  methods: {
    appendModel() {
      this.internalValue.push({ ...defModel });
      this.$emit('change', this.internalValue);
    },
    normalizeModel() {
      if (!this.internalValue.length) {
        this.appendModel();
      }
    },
    removeFromModel(index) {
      this.$delete(this.internalValue, index);
      this.$emit('change', this.internalValue);
    },
  },

  watch: {
    internalValue() {
      this.normalizeModel();
    }
  },

  created() {
    this.normalizeModel();
  }
});
