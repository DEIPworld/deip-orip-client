<template>
  <div class="d-flex text-caption">
    <v-icon v-if="meta.icon" class="mr-1" size="18">
      {{ meta.icon }}
    </v-icon>
    {{ meta.label }}
  </div>
</template>

<script>
  export default {
    name: 'DMetaItem',
    props: {
      meta: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style scoped>

</style>
