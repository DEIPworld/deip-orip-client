<template>
  <div>
    <template v-for="(category, index) of modules">
      <v-list nav dense :key="`ttl-${index}`">
        <v-subheader>{{ category.name }}</v-subheader>
        <draggable
          :key="`drg-${index}`"
          :list="category.modules"
          :group="{ name: 'g1', pull: 'clone', put: false }"
          :clone="onClone"
        >
          <v-list-item link v-for="module of category.modules" :key="module.name">
            <v-list-item-icon class="mr-3 reset-width">
              <v-icon size="12" class="grey--text text--lighten-1">drag_indicator</v-icon>
            </v-list-item-icon>

            <v-list-item-avatar size="24" class="mr-3">
              <v-icon size="18">{{ module.icon }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content class="text-caption font-weight-medium">
              {{ module.name }}
            </v-list-item-content>
          </v-list-item>
        </draggable>
      </v-list>
      <v-divider />

    </template>
  </div>

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
        type: Array,
        default: () => ([])
      },
    },
    data() {
      return { };
    },
    methods: {
      onClone(item) {
        const crc = crc32(JSON.stringify(module)).toString(32) + crc32(new Date().getTime().toString()).toString(32);
        return {
          ..._.cloneDeep(item),
          ...{
            ...(item.id$ ? { originalId: item.id$ } : {}),
            id$: crc,
          }
        };
      }
    }
  };
</script>
