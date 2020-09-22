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
  </v-chip>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'AdminLayoutsNodeSimple',
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
