export const FormMixin = {
  data() {
    return {
      isValid: false
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();

      this.$emit('submit', this.$refs.form.validate());
    }
  }
};
