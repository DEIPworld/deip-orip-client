<template>
  <v-list>
    <template v-for="(category, index) of modules">
      <v-subheader :key="`ttl-${index}`">{{ category.name }}</v-subheader>
      <draggable
        :key="`drg-${index}`"
        :list="category.modules"
        :group="{ name: 'g1', pull: 'clone', put: false }"
        :clone="onClone"
      >
        <v-list-item v-for="module of category.modules" :key="module.name">
          <v-list-item-content>
            {{ module.name }}
          </v-list-item-content>
        </v-list-item>
      </draggable>
    </template>
  </v-list>

</template>

<script>
  import draggable from 'vuedraggable';
  import crc32 from 'crc/crc32';

  export default {
    name: 'AdminLayoutsModules',
    components: {
      draggable
    },
    props: {
      modules: {
        type: Object,
        default: () => ({})
      },
    },
    data() {
      return { };
    },
    methods: {
      onClone(item) {
        return {
          ...JSON.parse(JSON.stringify(item)),
          ...{
            id$: crc32(JSON.stringify(module)).toString(32) + crc32(new Date().getTime().toString()).toString(32),
            ...(item.component !== 'AttributesRead' ? { children: item.children || [] } : {})
          }
        };
      }
    }
  };
</script>
