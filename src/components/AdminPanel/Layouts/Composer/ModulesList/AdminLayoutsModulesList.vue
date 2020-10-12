<template>
  <div
    class="d-flex fill-height"
  >
    <v-navigation-drawer
      mini-variant
      permanent
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group v-model="activeList">
          <v-list-item
            v-for="(category, index) of modules"
            :key="`ttl-${index}`"
          >
            <d-simple-tooltip
              :tooltip="category.name"
              open-delay="0"
              position="right"
              nudge="-20px"
            >
              <v-list-item-icon>
                <v-icon>{{ category.icon }}</v-icon>
              </v-list-item-icon>
            </d-simple-tooltip>


            <v-list-item-content>
              <v-list-item-title>{{ category.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

      </v-list>
    </v-navigation-drawer>
    <v-spacer class="overflow-x-auto fill-height" style="min-width: 0px">

      <template v-for="(category, index) of modules">

<!--        <v-list-->
<!--          v-if="activeList === index"-->
<!--          :key="`ttl-${index}`"-->
<!--          nav-->
<!--          dense-->
<!--        >-->

<!--          <draggable-->
<!--            :key="`drg-${index}`"-->
<!--            :list="category.modules"-->
<!--            :group="{ name: 'nodes', pull: 'clone', put: false }"-->
<!--            :sort="false"-->
<!--            :clone="onClone"-->
<!--            style="max-width: 100%; min-widht: 0px"-->
<!--          >-->
<!--            <v-list-item-->
<!--              v-for="module of category.modules"-->
<!--              :key="module.moduleId"-->
<!--              link-->
<!--            >-->
<!--              <v-list-item-icon class="mr-2">-->
<!--                <v-icon size="20">{{ module.icon }}</v-icon>-->
<!--              </v-list-item-icon>-->
<!--              <v-list-item-content>-->
<!--                <v-list-item-title class="text-truncate text-caption font-weight-medium">-->
<!--                  {{ module.name }}-->
<!--                </v-list-item-title>-->
<!--              </v-list-item-content>-->
<!--              <v-list-item-action-text class="my-0">-->
<!--                <admin-layouts-modules-markers-->
<!--                  :module="module"-->
<!--                />-->
<!--              </v-list-item-action-text>-->
<!--              <v-list-item-action class="my-0">-->
<!--                <admin-layouts-modules-menu-->
<!--                  :module="module"-->
<!--                />-->
<!--              </v-list-item-action>-->
<!--            </v-list-item>-->

<!--          </draggable>-->
<!--        </v-list>-->


        <div v-if="activeList === index" :key="`ttl-${index}`">
          <draggable
            :key="`drg-${index}`"
            :list="category.modules"
            :group="{ name: 'nodes', pull: 'clone', put: false }"
            :sort="false"
            :clone="onClone"
            :class="$style.list"
            class="pa-4"
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
                style="cursor: move"
              >
                <admin-layouts-modules-markers
                  :module="module"

                  class="pos-absolute"
                  style="top: 4px; left: 4px"
                />

                <admin-layouts-modules-menu
                  :module="module"

                  class="pos-absolute"
                  style="top: 0px; right: 0px"
                />

                <v-icon>{{ module.icon }}</v-icon>
                <div
                  class="text-caption text--secondary mt-1 text-truncate"
                  style="line-height: 16px"
                >
                  {{ module.name }}
                </div>
              </v-sheet>
            </v-hover>
          </draggable>
        </div>



      </template>
    </v-spacer>

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
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import AdminLayoutsModulesMarkers
    from '@/components/AdminPanel/Layouts/Composer/ModulesList/AdminLayoutsModulesMarkers';
  import AdminLayoutsModulesMenu from '@/components/AdminPanel/Layouts/Composer/ModulesList/AdminLayoutsModulesMenu';

  export default {
    name: 'AdminLayoutsModulesList',
    components: {
      AdminLayoutsModulesMenu,
      AdminLayoutsModulesMarkers,
      DSimpleTooltip,
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
      return {
        activeList: 0
      };
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
