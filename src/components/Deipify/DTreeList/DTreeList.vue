<template>
  <v-list
    v-bind="attrs$"
    color="transparent"
  >
    <!--    <v-expand-transition>-->
    <!--      <template v-if="isActive">-->

    <d-tree-list-node
      v-for="(node, index) in items"
      :key="index"
      :node="node"
    >
      <template #itemAction="{ item }">
        <slot name="itemAction" v-bind="{ item }" />
      </template>


    </d-tree-list-node>

    <!--      </template>-->
    <!--    </v-expand-transition>-->
  </v-list>
</template>

<script>
  import BindsAttrs from 'vuetify/lib/mixins/binds-attrs';
  // import Toggleable from 'vuetify/lib/mixins/toggleable';
  import DTreeListNode from '@/components/Deipify/DTreeList/DTreeListNode';

  export default {
    name: 'DTreeList',
    components: { DTreeListNode },
    mixins: [
      BindsAttrs
      // Toggleable
    ],
    props: {
      items: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
