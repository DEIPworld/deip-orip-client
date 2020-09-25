<template>
  <v-card
    flat
    :style="hostStyles"
    :class="hostClasses"
    :outlined="!root"
    :data-component-host="item.component"
  >
    <v-system-bar v-if="!(root || isTypography)" color="grey lighten-4">
      <v-icon size="12" class="mr-1">
        {{ item.icon }}
      </v-icon>

      <div v-if="item.name" class="text-overline">
        {{ item.name }}
      </div>

      <div class="spacer"></div>

      <admin-layouts-node-settings
        v-model="item"
        @click:remove="onRemoveNode"
      />

    </v-system-bar>

    <template v-if="!root && isTypography">
      <v-sheet color="grey lighten-4" class="d-flex align-center">
        <v-icon class="pa-3">
          {{ item.icon }}
        </v-icon>
      </v-sheet>

      <v-divider vertical class="dashed" />
    </template>


    <draggable
      ref="inner"
      :list="internalValue"
      :group="{ name: 'g1' }"
      :style="viewStyles"
      :class="viewClasses"
      :data-component="item.component"
      class="spacer"
    >
      <template
        v-for="(node, index) in internalValue"
      >
        <admin-layouts-composer
          v-if="node.children"
          :key="`composer-node-${node.id$}`"
          v-model="node.children"
          :item="node"
          :root="false"
          @remove:node="removeNode"
        />

        <admin-layouts-node-simple
          v-else
          :key="`composer-simple-${node.id$}`"
          :item="node"
          @remove:node="removeNode"
        />
      </template>
    </draggable>

    <template v-if="!root && isTypography">
      <v-divider vertical class="dashed ml-2" />

      <admin-layouts-node-settings
        v-model="item"
        @click:remove="onRemoveNode"
      />
    </template>

  </v-card>
</template>

<script>
  import draggable from 'vuedraggable';
  import { find as deepFind } from 'find-keypath';
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import AdminLayoutsNodeSimple from '@/components/AdminPanel/Layouts/_partials/AdminLayoutsNodeSimple';
  import AdminLayoutsNodeSettings from '@/components/AdminPanel/Layouts/_partials/AdminLayoutsNodeSettings';

  export default {
    name: 'AdminLayoutsComposer',
    components: {
      AdminLayoutsNodeSettings,
      AdminLayoutsNodeSimple,
      draggable
    },
    mixins: [Proxyable],
    props: {
      item: {
        type: Object,
        default: () => ({})
      },
      root: {
        type: Boolean,
        default: true
      }
    },
    computed: {

      isTypography() { return this.item.type === 'typography'; },

      hostStyles() {
        return { };
      },

      hostClasses() {
        return {
          [this.$style.host]: true,
          'd-flex': true,
          'flex-column': !this.isTypography,

          col: this.item.component === 'VCol',

          dashed: !this.root
        };
      },

      viewClasses() {
        return {
          'pa-4': !this.isTypography,
          'pa-2': this.isTypography,

          row: this.item.component === 'VRow'
        };
      },
      viewStyles() {
        return {
          minHeight: '48px',

          ...(this.item.component === 'DLayoutSectionSplit' ? {
            display: 'grid',
            gridGap: '2rem',
            gridAutoFlow: 'column'
          } : {})
        };
      },

      controlClasses() {
        return {
          [this.$style.controls]: true,
          [this.$style['controls--visible']]: this.hoverHost && !this.hoverView
        };
      }
    },
    methods: {
      getNodePath(id) {
        const path = deepFind(this.$parent.internalValue, id);
        path.pop();
        return path;
      },
      onRemoveNode() {
        this.$emit('remove:node', this.item);
      },
      removeNode(item) {
        const index = this.internalValue.indexOf(item);
        if (index >= 0) this.internalValue.splice(index, 1);
      }
    }
  };
</script>

<style lang="scss" module>
  .host {

    [data-component="DLayoutSection"] {
      display: flex;
    }

    [data-component-host="DLayoutSectionMain"] {
      flex: 1;
    }

    [data-component-host="DLayoutSectionSidebar"] {
      flex: 0 0 256px;
      max-width: 256px;
      margin-left: 1rem;
    }

    [data-component="DStack"] {
      display: grid;
      grid-auto-flow: row;
      grid-gap: 1rem;
      //justify-content: left;
    }
  }

  .controls {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    margin-top: -2px;
    opacity: 0;
    pointer-events: none;

    &--visible {
      opacity: 1;
      pointer-events: all;
    }
  }
</style>
