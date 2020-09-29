<template>
  <v-card
    outlined
    class="dashed"
    :class="$style.host"
  >
    <v-system-bar color="grey lighten-4">
      <v-icon size="16" class="mr-1">
        {{ node.icon }}
      </v-icon>

      <div v-if="node.name" class="text-caption">
        <template v-if="title">
          <span class="font-weight-medium mr-1">{{ title }}</span>
          <span style="font-size: 10px">({{ node.name }})</span>
        </template>
        <template v-else>
          <span class="font-weight-medium">{{ node.name }}</span>
        </template>
      </div>

      <div class="spacer"></div>

      <template v-if="$hasSlot('settings')">
        <div class="mr-n1">
          <slot name="settings" />
        </div>
      </template>

    </v-system-bar>

    <admin-layouts-composer-nodes
      v-if="node.children"
      v-model="node.children"
      class="pa-4"
      :data-node="node.component"
    />

  </v-card>
</template>

<script>
  import { abstractNode } from '@/components/AdminPanel/Layouts/Composer/Node/Types/mixins';

  export default {
    name: 'AdminLayoutsComposerNodeDefault',
    mixins: [abstractNode]
  };
</script>

<style lang="scss" module>
  .host {
    [data-node="DLayoutSectionSplit"] {
      display: grid;
      grid-auto-columns: 1fr;
      grid-auto-flow: column;
      grid-gap: 1rem;
    }

    [data-node="DStack"] {
      display: grid;
      grid-auto-flow: row;
      grid-gap: 1rem;
    }
  }
</style>
