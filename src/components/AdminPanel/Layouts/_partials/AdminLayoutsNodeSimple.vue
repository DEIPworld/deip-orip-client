<template>
  <v-sheet
    class="px-2 d-inline-flex align-center"
    :min-height="32"
    outlined
    rounded
    max-width="100%"
    min-width="0px"
  >
    <v-icon size="12" class="mr-1">
      {{ item.icon }}
    </v-icon>
    <v-sheet class="spacer text-overline text--secondary text-truncate">
      {{ item.name }}
    </v-sheet>

    <admin-layouts-node-settings
      v-model="item"
      @click:remove="onRemoveNode"
    />

  </v-sheet>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import AdminLayoutsNodeSettings from '@/components/AdminPanel/Layouts/_partials/AdminLayoutsNodeSettings';

  export default {
    name: 'AdminLayoutsNodeSimple',
    components: { AdminLayoutsNodeSettings },
    mixins: [Proxyable],
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      onRemoveNode() {
        this.$emit('remove:node', this.item);
      }
    }
  };
</script>
