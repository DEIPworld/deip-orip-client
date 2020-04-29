<template>
  <div>
    <v-toolbar flat class="px-8">
      <slot name="default" />
    </v-toolbar>
    <v-divider />
  </div>
</template>

<script>
  export default {
    name: 'LayoutToolbar'
  };
</script>

<style scoped>

</style>
