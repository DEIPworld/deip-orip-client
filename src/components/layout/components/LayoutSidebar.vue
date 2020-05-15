<template>
  <v-col cols="12" md="3">
    <slot name="default" />
  </v-col>
</template>

<script>
  export default {
    name: 'LayoutSidebar',
    props: {
      simple: {
        type: Boolean,
        default: false,
        required: false
      },
      right: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      classList() {
        return {
          'app-layout__sidebar--simple': this.simple === true,
          'app-layout__sidebar--right': this.right === true,
          'app-layout__sidebar--left': this.right !== true
        };
      }
    }
  };
</script>

<style scoped>

</style>
