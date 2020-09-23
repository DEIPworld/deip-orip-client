<template>
  <v-hover v-model="hoverHost">
    <v-card
      flat
      :style="hostStyles"
      :class="hostClasses"
      :outlined="!root"
      :data-component-host="item.component"
    >
      <v-sheet v-if="!root" :class="controlClasses" color="transparent">

        <div class="d-flex align-center">
          <v-icon size="12" class="mr-1">
            {{ item.icon }}
          </v-icon>

          <div v-if="item.name" class="text-overline">
            {{ item.name }}
          </div>

          <admin-layouts-node-settings
            v-model="item.props"
            :item="item"
          />

          <v-btn
            v-if="!(root || item.required)"
            icon
            x-small
            class="ml-auto"
            @click="onRemoveNode"
          >
            <v-icon small>clear</v-icon>
          </v-btn>


        </div>

      </v-sheet>

      <draggable
        ref="inner"
        :list="internalValue"
        :group="{ name: 'g1' }"
        :style="viewStyles"
        :class="viewClasses"
        :data-component="item.component"
      >
        <v-hover
          v-for="(node, index) in internalValue"
          v-model="hoverView"
        >
          <admin-layouts-composer
            v-if="node.children"
            :key="node.id$"
            v-model="node.children"
            :item="node"
            :root="false"
            @remove:node="removeNode"
          />

          <admin-layouts-node-simple
            v-else
            :item="node"
            @remove:node="removeNode"
          />
        </v-hover>
      </draggable>

    </v-card>
  </v-hover>
</template>

<script>
  import draggable from 'vuedraggable';
  import { find as deepFind } from 'find-keypath';
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import AdminLayoutsNodeSimple from '@/components/AdminPanel/Layouts/_partials/AdminLayoutsNodeSimple';
  import DStack from '@/components/Deipify/DStack/DStack';
  import AdminLayoutsNodeSettings from '@/components/AdminPanel/Layouts/_partials/AdminLayoutsNodeSettings';

  export default {
    name: 'AdminLayoutsComposer',
    components: {
      AdminLayoutsNodeSettings,
      DStack,
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
    data() {
      return {
        hoverHost: false,
        hoverView: false
      };
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
          [this.$style.host]: true,
          'pa-4': true,
          'd-flex': true,
          'flex-column': true,

          col: this.item.component === 'VCol',

          dashed: !this.root
        };
      },


      viewClasses() {
        return {
          'flex-shrink-1': true,
          'flex-grow-1': true,

          'pa-4': true,
          'ma-n4': true,

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
    //&:not(:last-child) {
    //  margin-bottom: 12px;
    //
    //  [data-component="DLayoutSection"] &,
    //  [data-component="DLayoutSectionSplit"] &,
    //  [data-component="VRow"] & {
    //    margin-bottom: 0;
    //  }
    //}
    //
    //[data-component="VRow"] {
    //  margin: 0;
    //}

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
