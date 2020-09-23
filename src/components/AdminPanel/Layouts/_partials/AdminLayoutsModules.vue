<template>
  <div>
    <template v-for="(category, index) of modules">
      <div :key="`ttl-${index}`">
        <v-subheader>{{ category.name }}</v-subheader>
        <draggable
          :key="`drg-${index}`"
          :list="category.modules"
          :group="{ name: 'g1', pull: 'clone', put: false }"
          :sort="false"
          :clone="onClone"
          :class="$style.list"
          class="px-4 pb-4"
        >
          <v-hover
            v-for="module of category.modules"
            :key="module.moduleId"
            #default="{ hover }"
          >

            <v-sheet
              class="text-center pa-2"
              :color="`grey ${hover ? 'lighten-3' : 'lighten-4'}`"
              rounded
            >
<!--              <v-fade-transition>-->
<!--                -->
<!--              </v-fade-transition>-->

              <v-icon>{{ module.icon }}</v-icon>
              <div class="text-caption text--secondary mt-1 text-truncate" style="line-height: 1.2">
                {{ module.name }}
              </div>
            </v-sheet>
          </v-hover>
        </draggable>
      </div>
      <v-divider />

    </template>
  </div>

</template>

<script>
  import draggable from 'vuedraggable';
  import crc32 from 'crc/crc32';
  import { genObjectId } from '@/utils/helpers';

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
        // const crc = crc32(JSON.stringify(module)).toString(32) + crc32(new Date().getTime().toString()).toString(32);
        const crc = genObjectId({ date: new Date().getTime().toString() })

        return {
          ..._.cloneDeep(item),
          ...{
            id$: crc
          }
        };
      }
    }
  };
</script>

<style lang="scss" module>
  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(33.333% - .5rem), 1fr));
    grid-gap: .5rem;
  }
</style>
