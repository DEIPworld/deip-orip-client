<template>
  <v-card
    flat
    :style="hostStyles"
    :class="hostClasses"
    :outlined="!root"
  >
    <div v-if="title" class="px-2 py-1 text-caption">
      {{ title }}
      <v-btn @click="removeNode"></v-btn>
    </div>
    <draggable
      :list="schema"
      :group="{ name: 'g1' }"
      class="pa-2"
      style="min-height: 48px;"
    >
      <template v-for="(item, index) in schema">
        <admin-layouts-composer
          v-if="item.children"
          :key="item.id$"
          :title="item.name"
          :schema="item.children"
          :root="false"
        />
        <div v-else :key="'ss' + item.id$">
          {{ item.name }}
        </div>
      </template>
    </draggable>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable';
  import { find as deepFind } from 'find-keypath';

  export default {
    name: 'AdminLayoutsComposer',
    components: {
      draggable
    },
    props: {
      schema: {
        type: Array,
        default: () => ([])
      },
      title: {
        type: String,
        default: null
      },
      root: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      hostStyles() {
        return {
          ...(!this.root ? {
            backgroundColor: 'rgba(0,0,0,.02'
          } : {})
        };
      },
      hostClasses() {
        return {
          dotted: !this.root,
          [this.$style.host]: true
        };
      }
    },
    methods: {
      getNodePath(id) {
        const path = deepFind(this.schema, id);
        path.pop();
        return path;
      },
      removeNode(id) {
        console.log(this.getNodePath(id))
      }
    }
  };
</script>

<style lang="scss" module>
  .host:not(:last-child) {
    margin-bottom: 8px;
  }
</style>
