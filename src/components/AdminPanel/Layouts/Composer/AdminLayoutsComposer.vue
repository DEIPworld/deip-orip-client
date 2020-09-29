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
    mixins: [ProxyableFactory('nodes')]
  };
</script>
