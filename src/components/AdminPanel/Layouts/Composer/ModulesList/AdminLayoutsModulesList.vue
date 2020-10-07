<template>
  <div>
    <template v-for="(category, index) of modules">
      <div :key="`ttl-${index}`">
        <v-subheader class="text-overline">
          {{ category.name }}
        </v-subheader>
        <draggable
          :key="`drg-${index}`"
          :list="category.modules"
          :group="{ name: 'nodes', pull: 'clone', put: false }"
          :sort="false"
          :clone="onClone"
          :class="$style.list"
          class="px-4 pb-4"
        >
          <v-hover
            v-for="module of category.modules"
            :key="module.moduleId"
            v-slot="{ hover }"
          >
            <v-sheet
              class="text-center pa-2 pos-relative"
              :color="`grey ${hover ? 'lighten-3' : 'lighten-4'}`"
              rounded
            >
              <d-stack
                v-if="module.isRequired || module.isHidden"
                gap="2"
                horizontal
                class="pos-absolute"
                style="top: 4px; right: 4px"
              >
                <v-avatar
                  v-if="module.isHidden"
                  size="4"
                  color="info"
                />

                <v-avatar
                  v-if="module.isRequired"
                  size="4"
                  color="error"
                />
              </d-stack>

              <v-icon>{{ module.icon }}</v-icon>
              <div class="text-caption text--secondary mt-1 text-truncate" style="line-height: 16px">
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
  import { genObjectId } from '@/utils/helpers';
  import RecursiveIterator from 'recursive-iterator';
  import kindOf from 'kind-of';
  import { modulesFactory } from '@/components/AdminPanel/Layouts/Composer/ModulesList/modules';
  import { ATTR_TYPES, ATTR_ICONS, LAYOUT_TYPES } from '@/variables';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'AdminLayoutsModulesList',
    components: {
      DStack,
      draggable
    },
    props: {
      layoutType: {
        type: [String, Number],
        default: LAYOUT_TYPES.READ
      }
    },
    data() {
      return { };
    },
    computed: {
      // attrModules() {
      //
      //
      //   const propsForRead = {
      //     [ATTR_TYPES.TEXT]: setComponentProps({
      //       clamped: setAs(Number)
      //     }),
      //     [ATTR_TYPES.TEXTAREA]: setComponentProps({
      //       clamped: setAs(Number)
      //     }),
      //     [ATTR_TYPES.STEPPER]: setComponentProps({
      //       viewType: setAs(Array, ['default', 'small'])
      //     })
      //   };
      //
      //   const extenders = {
      //     [LAYOUT_TYPES.SET]: (attr) => ({
      //       component: 'AttributesSet',
      //       model: `researchRef.attributes.${attr._id}`,
      //       props: {
      //         attribute: `@attributes.${attr._id}`
      //       }
      //     }),
      //
      //     [LAYOUT_TYPES.READ]: (attr) => ({
      //       component: 'AttributesRead',
      //       ...(propsForRead[attr.type] ? _.cloneDeep(propsForRead[attr.type]) : {}),
      //       ...{
      //         props: {
      //           attribute: `@research.researchRef.attributes.${attr._id}`
      //         }
      //       }
      //     })
      //   };
      //
      //   return [
      //     {
      //       component: 'span',
      //       name: 'Creation date',
      //       text: '@research.createdAt',
      //       icon: 'mdi-calendar-text'
      //     },
      //     ...this.$tenantSettings.researchAttributes
      //       .map((attr) => ({
      //         icon: ATTR_ICONS[attr.type],
      //         name: attr.shortTitle || attr.title,
      //         isRequired: attr.isRequired,
      //         isHidden: attr.isHidden,
      //         ...extenders[this.layoutType](attr)
      //       }))
      //   ];
      // },

      modules() {
        return modulesFactory(this);
      }
    },
    methods: {
      onClone(item) {
        const crc = () => genObjectId({ salt: Math.random() + new Date().getTime().toString() });
        const clone = _.cloneDeep(item);

        clone.id$ = crc();

        if (item.children && item.children.length) {
          for (const { node } of new RecursiveIterator(clone)) {
            if (kindOf(node) === 'object' && node.component) {
              node.id$ = crc();
            }
          }
        }

        return clone;
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
