<template>
  <v-card
    outlined
    class="dashed d-flex"
  >
    <v-sheet color="grey lighten-4" class="d-flex align-center">
      <v-icon class="pa-2">
        {{ icon }}
      </v-icon>
    </v-sheet>

    <v-divider vertical class="dashed" />

    <admin-layouts-composer-nodes
      v-if="node.children"
      v-model="node.children"
      class="pa-1 spacer"
    />

    <template v-if="$hasSlot('settings')">
      <v-divider vertical class="dashed" />

      <v-sheet class="pa-2 align-self-center">
        <slot name="settings" />
      </v-sheet>
    </template>
  </v-card>
</template>

<script>
  import { abstractNode } from '@/components/AdminPanel/Layouts/Composer/Node/Types/mixins';

  export default {
    name: 'AdminLayoutsComposerNodeTypography',
    mixins: [abstractNode]
  };
</script>
