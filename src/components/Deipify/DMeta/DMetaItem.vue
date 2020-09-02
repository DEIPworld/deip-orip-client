<template>
  <div class="d-flex text-caption align-center">
    <v-icon v-if="meta.icon" class="mr-1" size="18">
      {{ meta.icon }}
    </v-icon>
    <div>
      <template v-if="meta.label">
        {{ meta.label }}
      </template>
      <slot />
    </div>
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
