<template>
  <v-sheet color="transparent">
    <v-list-item>

      <v-sheet v-for="index in depth" :key="index" :width="24" />

      <v-sheet
        v-if="node.children && node.children.length"
        class="ml-n6"
      >
        <v-btn
          x-small
          icon
          @click.prevent.stop="isActive = !isActive"
        >
          <v-icon>
            {{ isActive ? 'expand_more' : 'chevron_right' }}
          </v-icon>
        </v-btn>
      </v-sheet>

      <v-list-item-action class="mr-6">
        <slot name="itemAction" v-bind="{ item: node }" />
      </v-list-item-action>

      <v-list-item-content>
        {{ node.label }}
      </v-list-item-content>
    </v-list-item>

    <v-expand-transition>
      <div v-if="node.children && node.children.length && isActive">
        <d-tree-list-node
          v-for="(child, index) in node.children"
          :key="index"
          :node="child"
          :depth="depth + 1"
        >
          <template #itemAction="{ item }">
            <slot name="itemAction" v-bind="{ item }" />
          </template>
        </d-tree-list-node>
      </div>
    </v-expand-transition>
  </v-sheet>
</template>

<script>
  import Toggleable from 'vuetify/lib/mixins/toggleable';

  export default {
    name: 'DTreeListNode',
    mixins: [
      Toggleable
    ],
    props: {
      node: {
        type: Object,
        default: () => ({})
      },
      depth: {
        type: Number,
        default: 0
      }
    }
  };
</script>
