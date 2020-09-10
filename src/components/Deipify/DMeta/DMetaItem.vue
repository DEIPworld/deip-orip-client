<template>
  <div class="d-flex text-caption align-center">
    <v-icon v-if="meta.icon || icon" class="mr-1" size="18">
      {{ meta.icon || icon }}
    </v-icon>
    <div>
      <template v-if="meta.label || label">
        {{ meta.label || label }}
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
      },
      icon: {
        type: String,
        default: null
      },
      label: {
        type: String,
        default: null
      }
    }
  };
</script>
