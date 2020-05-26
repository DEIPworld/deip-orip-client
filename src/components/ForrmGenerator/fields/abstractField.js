export default {
  props: {
    field: {
      type: Object,
      required: true
    },
    value: {
      // type: String,
      default: false,
    },
    scope: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      localValue: this.value || '',
      delay: 600
    };
  },
  mounted() {
    this.onInput();
  },
  watch: {
    value: {
      handler(v) {
        this.localValue = v;
      }
    }
  },
  computed: { },
  methods: {
    onBlur() {
      this.$emit('blur');
    },
    onChange() {
      this.$emit('change');
    },
    onFocus() {
      this.$emit('focus');
    },
    onInput() {
      this.$emit('upd', this.localValue, this.field.name);
    }
  }
};
