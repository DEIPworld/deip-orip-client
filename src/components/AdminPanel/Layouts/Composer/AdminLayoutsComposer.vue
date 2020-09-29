<template>
  <v-card flat>
    <v-sheet color="grey lighten-2" class="pa-3 d-flex">
      <v-avatar
        v-for="(x, index) of new Array(3)"
        :key="index"
        size="12"
        color="white"
        class="mr-2"
      />
    </v-sheet>

    <div class="pa-12">
      <admin-layouts-composer-nodes
        v-model="nodes"
        :class="$style.host"
        @click:remove="onClickRemove"
      />
    </div>
  </v-card>
</template>

<script>
  import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';
  import AdminLayoutsComposerNodes from '@/components/AdminPanel/Layouts/Composer/Nodes/AdminLayoutsComposerNodes';

  export default {
    name: 'AdminLayoutsComposer',
    components: { AdminLayoutsComposerNodes },
    mixins: [ProxyableFactory('nodes')],
    methods: {
      onClickRemove(e) {
        this.$emit('click:remove', e)
      },
    }
  };
</script>

<style lang="scss" module>
  .host {
    [data-nodes="DLayoutSectionSplit"] {
      display: grid;
      grid-auto-columns: 1fr;
      grid-auto-flow: column;
      grid-gap: .5rem;
    }

    [data-nodes="DStack"] {
      display: grid;
      grid-auto-flow: row;
      grid-gap: .5rem;
    }

    [data-nodes="DLayoutSection"] {
      display: flex;
    }

    [data-node-host="DLayoutSectionMain"] {
      flex: 1;
    }

    [data-node-host="DLayoutSectionSidebar"] {
      flex: 0 0 380px;
      max-width: 380px;
      margin-left: .5rem;
    }

    [data-nodes="tr"] {
      display: flex;
      margin: 0 -4px;
    }

    [data-node-host="td"] {
      flex: 1;

      margin: 0 4px;
      min-width: 0px;
    }

    [data-nodes="DSimpleTooltip"] {
      display: grid;
      grid-auto-flow: row;
      grid-gap: .5rem;
      justify-items: left;
    }
  }
</style>
