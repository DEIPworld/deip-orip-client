<template>
  <div class="app-layout__sidebar pa-6 pa-sm-12" :class="classList">
    <slot name="default" />
  </div>
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
