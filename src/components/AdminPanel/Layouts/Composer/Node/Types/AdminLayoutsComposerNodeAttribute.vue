<template>
  <v-card
    outlined
    class="dashed d-inline-flex align-center"
    :class="$style.host"
    :height="32"
    min-width="0px"
    max-width="100%"
  >
    <v-icon class="px-2" size="16">
      {{ icon }}
    </v-icon>

    <v-divider vertical class="dashed" />

    <div class="spacer text-caption text--secondary text-truncate px-2">
      <template v-if="title">
        <span class="font-weight-medium mr-1">{{ title }}</span>
        <span style="font-size: 10px">({{ node.name }})</span>
      </template>
      <template v-else>
        <span class="font-weight-medium">{{ node.name }}</span>
      </template>
    </div>

    <template v-if="$hasSlot('settings')">
      <v-divider vertical class="dashed" />

      <v-sheet class="px-1">
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
