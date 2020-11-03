<template>
  <div :class="$style.host">
    <v-divider :class="$style.divider" class="mx-n6 reset-width" />

    <d-block class="pa-6" v-bind="attrs$" compact>

      <slot name="titleLeft" />
      <slot name="title" />
      <slot name="title-append" />
      <slot />

    </d-block>
  </div>
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
    &:first-child {
      .divider {
        display: none;
      }
    }
  }
</style>
