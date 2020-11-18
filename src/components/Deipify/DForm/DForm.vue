<template>
  <v-form
    ref="form"
    v-model="isValid"
    :disabled="disabled"
    @submit="onSubmit"
  >
    <slot />
  </v-form>
</template>

<script>
  export default {
    name: 'DForm',
    props: {
      disabled: {
        type: Boolean,
        default: false
      }
    },
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
</script>
