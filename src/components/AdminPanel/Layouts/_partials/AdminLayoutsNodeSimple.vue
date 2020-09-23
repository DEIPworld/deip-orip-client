<template>
  <v-chip
    class="text-caption"
    label
    outlined
    close
    close-icon="clear"
    @click:close="onRemoveNode"
  >
    {{ item.name }}

    <admin-layouts-node-settings
      v-model="item.props"
      :item="item"
    />

  </v-chip>
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
