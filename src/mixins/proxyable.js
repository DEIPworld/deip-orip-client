export const proxyable = {
  props: {
    value: {
      required: false
    }
  },

  data() {
    return {
      internalLazyValue: this.value
    };
  },

  computed: {
    internalValue: {
      get() {
        return this.internalLazyValue;
      },
      set(val) {
        if (val === this.internalLazyValue) return;
        this.internalLazyValue = val;

        this.$emit('change', val);
      }
    }
  },

  watch: {
    value(val) {
      this.internalLazyValue = val;
    }
  }
};
