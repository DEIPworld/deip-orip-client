<template>
  <v-card
    outlined
    class="dashed d-inline-flex align-center"
    :class="$style.host"
    :height="32"
    :data-node-host="node.component"
    min-width="0px"
    max-width="100%"
  >
    <v-icon class="ml-1" size="24">
      {{ icon }}
    </v-icon>
    <div class="spacer" />
    <template v-if="$hasSlot('settings')">
      <v-sheet class="mr-1">
        <slot name="settings" />
      </v-sheet>
    </template>

  </v-card>
</template>

<script>
  import { abstractNode } from '@/components/AdminPanel/Layouts/Composer/Node/Types/mixins';

  export default {
    name: 'AdminLayoutsComposerNodeIcon',
    mixins: [abstractNode]
  };
</script>

<style lang="scss" module>
  .host {
    //&:not(:last-child) {
    //  margin-right: 8px;
    //}
  }
</style>
