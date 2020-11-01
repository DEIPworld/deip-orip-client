<template>
  <d-stack
    v-if="module && (module.isRequired || module.isHidden)"
    gap="2"
    horizontal
  >
    <v-avatar
      v-if="module.isHidden"
      size="4"
      color="info"
    />

    <v-avatar
      v-if="module.isRequired"
      size="4"
      color="error"
    />
  </d-stack>
</template>

<script>
  import DStack from '@/components/Deipify/DStack/DStack';
  export default {
    name: 'AdminLayoutsModulesMarkers',
    components: { DStack },
    props: {
      module: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
