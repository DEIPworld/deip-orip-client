<template>
  <div
    class="d-flex align-center"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <v-avatar :size="size" class="mr-3">
      <img :src="src">
    </v-avatar>
    <div class="spacer">
      <slot />
    </div>
  </div>
</template>

<script>
  import { DAvataredAbstract } from '@/components/Deipify/DAvatared/DAvataredAbstract';

  export default {
    name: 'DAvataredView',
    mixins: [DAvataredAbstract],
  };
</script>

<style scoped>

</style>
