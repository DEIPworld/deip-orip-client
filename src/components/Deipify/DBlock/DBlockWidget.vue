<template>
  <div :class="$style.host">
    <v-divider :class="$style.divider" class="mx-n6 reset-width" />

    <d-block class="pa-6" v-bind="attrs$" compact>
      <template #titleLeft>
        <slot name="titleLeft" />
      </template>
      <template #title>
        <slot name="title" />
      </template>
      <template #title-append>
        <slot name="title-append" />
      </template>
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
