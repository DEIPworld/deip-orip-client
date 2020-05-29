<template>
  <v-form ref="form" v-model="isValid" @submit="onSubmit">
    <slot />
  </v-form>
</template>

<script>
  export default {
    name: 'DForm',
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
