<template>
  <div
    class="d-flex align-center"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    @click="$emit('click')"
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
  import Routable from 'vuetify/lib/mixins/routable';

  export default {
    name: 'DAvataredView',
    mixins: [DAvataredAbstract, Routable],
  };
</script>

<style scoped>

</style>
