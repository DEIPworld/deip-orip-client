export const AbstractField = {
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    xProps: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    _xProps() {
      return {
        outlined: true,
        hideDetails: 'auto',
        ...this.xProps
      };
    }
  },
  methods: {
    onInput(e) {
      this.$emit('input', e);
    },
    onBlur() {
      // some work
    },
    onChange() {
      // some work
    },
    onFocus() {
      // some work
    }
  }
}
