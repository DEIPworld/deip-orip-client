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
    <v-icon class="px-2" size="16" data-addition="icon">
      {{ icon }}
    </v-icon>
    <v-divider vertical class="dashed" data-addition="icon-divider" />

    <div class="spacer text-caption text--secondary text-truncate ml-2">
      <template v-if="title">
        <span class="font-weight-medium mr-1">{{ title }}</span>
        <span style="font-size: 10px">({{ node.name }})</span>
      </template>
      <template v-else>
        <span class="font-weight-medium">{{ node.name }}</span>
      </template>
    </div>

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
    name: 'AdminLayoutsComposerNodeAttribute',
    mixins: [abstractNode]
  };
</script>

<style lang="scss" module>
  .host {
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
</style>
