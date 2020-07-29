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
      <span v-if="tooltip">{{ tooltipText }}</span>
      <slot name="tooltip" />
    </v-tooltip>

    <d-avatared-view v-else :src="src" :size="size">
      <slot />
    </d-avatared-view>
  </div>
</template>

<script>
  import DAvataredView from '@/components/Deipify/DAvatared/DAvataredView';
  import kindOf from 'kind-of';
  import { DAvataredAbstract } from '@/components/Deipify/DAvatared/DAvataredAbstract';

  export default {
    name: 'DAvatared',

    components: { DAvataredView },

    mixins: [DAvataredAbstract],

    props: {
      tooltip: {
        type: [Boolean, String],
        default: false
      }
    },

    computed: {
      tooltipText() {
        if (kindOf(this.tooltip) === 'boolean') {
          return this.$slots.default[0].text;
        }

        if (kindOf(this.tooltip) === 'string') {
          return this.tooltip;
        }

        return '';
      }
    }
  };
</script>

<style scoped>

</style>
