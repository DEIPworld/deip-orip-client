<template>
  <div ref="root">
    <v-tooltip
      v-if="tooltip || $hasSlot('tooltip')"
      bottom
      :max-width="260"
      :open-delay="500"
    >
      <template #activator="{ on }">
        <d-avatared-view :src="src" :size="size" v-on="on">
          <slot />
        </d-avatared-view>
      </template>
      <span v-if="tooltip">{{ tooltip }}</span>
      <slot name="tooltip" />
    </v-tooltip>

    <d-avatared-view v-else :src="src" :size="size">
      <slot />
    </d-avatared-view>
  </div>
</template>

<script>
  import DAvataredView from '@/components/Deipify/DAvatared/DAvataredView';
  import { DAvataredAbstract } from '@/components/Deipify/DAvatared/DAvataredAbstract';
  // import Routable from 'vuetify/lib/mixins/routable';

  export default {
    name: 'DAvatared',

    components: { DAvataredView },

    mixins: [DAvataredAbstract],

    props: {
      tooltip: {
        type: [Boolean, String],
        default: false
      }
    }
  };
</script>

<style scoped>

</style>
