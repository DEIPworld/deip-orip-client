<template>
  <v-card
    outlined
    class="dashed d-flex flex-column"
    :data-node-host="node.component"
    min-width="0px"
  >
    <v-system-bar color="grey lighten-4">
      <v-icon size="16" class="mr-1">
        {{ node.icon }}
      </v-icon>

      <div v-if="node.name" class="text-caption text-truncate">
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
      class="pa-2 spacer"
      :data-nodes="node.component"
      :style="{minHeight: '40px'}"
      @click:remove="onClickRemove"
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
