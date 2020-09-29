<template>
  <draggable
    :list="nodes"
    :group="{ name: 'nodes' }"
  >
    <template
      v-for="(node, index) in nodes"
    >
      <admin-layouts-composer-node
        :key="`node-${node.id$}`"
        v-model="nodes[index]"
        @click:remove="removeNode"
      />
    </template>

  </draggable>
</template>

<script>
  import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';
  import draggable from 'vuedraggable';
  import AdminLayoutsComposerNode from '@/components/AdminPanel/Layouts/Composer/Node/AdminLayoutsComposerNode';

  export default {
    name: 'AdminLayoutsComposerNodes',
    components: {
      AdminLayoutsComposerNode,
      draggable
    },
    mixins: [ProxyableFactory('nodes')],
    methods: {
      removeNode(node) {
        const index = this.nodes.indexOf(node);
        if (index >= 0) this.nodes.splice(node, 1);
      }
    }
  };
</script>
