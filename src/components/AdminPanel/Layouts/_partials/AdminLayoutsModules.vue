<template>
  <div>
    <template v-for="(category, index) of modules">
      <div
        :key="`ttl-${index}`"
        class="text-overline"
      >
        {{ category.name }}
      </div>

      <div>
        <draggable
          :key="`drg-${index}`"
          :list="category.modules"
          :group="{ name: 'g1', pull: 'clone', put: false }"
          :clone="onClone"
          class="d-flex flex-wrap ma-n1"
        >
          <v-chip v-for="module of category.modules" :key="module.name" class="ma-1" outlined>
            <div class="text-caption">
              {{ module.name }}
            </div>
          </v-chip>
        </draggable>
      </div>
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
        const isAttribute = item.component === 'AttributesRead';
        return {
          ..._.cloneDeep(item),
          ...{
            ...(!isAttribute ? { children: item.children || [] } : {}),
            ...(item.id$ ? { originalId: item.id$ } : {}),
            id$: crc,
          }
        };
      }
    }
  };
</script>
