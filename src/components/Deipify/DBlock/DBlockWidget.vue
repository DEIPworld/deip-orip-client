<template>
  <d-block
    :class="$style.host"
    class="pa-6"
    v-bind="attrs$"
    compact
  >
    <template v-if="$hasSlot('title-prepend')" #title-prepend>
      <slot name="title-prepend" />
    </template>
    <template v-if="$hasSlot('title')" #title>
      <slot name="title" />
    </template>
    <template v-if="$hasSlot('subtitle')" #subtitle>
      <slot name="subtitle" />
    </template>
    <template v-if="$hasSlot('title-append')" #title-append>
      <slot name="title-append" />
    </template>

    <slot />

  </d-block>
</template>

<script>
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';

  export default {
    name: 'DBlockWidget',
    components: { DBlock },
    mixins: [BindsAttrs]
  };
</script>

<style lang="scss" module>
  .host {
    &:not(:first-child) {
      border-top: 1px solid var(--color-divider) !important;

      .divider {
        display: none;
      }
    }
  }
</style>
