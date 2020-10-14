<template>
  <div class="d-flex align-center">

    <d-stack horizontal gap-4 class="mr-1">
      <div
        v-for="(item, index) of markers"
        :key="`marker-${index}`"
        class="pos-relative"
      >
        <d-simple-tooltip
          :tooltip="item.tooltip"
          tag="div"
          position="top"
          max-width="160"
        >
          <div>
            <v-icon size="14" class="ma-0 d-flex">
              {{ item.icon }}
            </v-icon>
          </div>

        </d-simple-tooltip>
      </div>
    </d-stack>


    <admin-layouts-modules-markers
      :module="node"
    />

    <v-menu v-model="menuOpen" close-on-content-click>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          x-small
          v-on="on"
        >
          <v-icon size="14" class="ma-0">
            mdi-dots-vertical
          </v-icon>
        </v-btn>
      </template>

      <v-list nav dense>
        <v-dialog
          v-model="settingsOpen"
          :max-width="400"
          scrollable
        >
          <template v-slot:activator="{ on }">
            <v-list-item @click="openSettings()">
              <v-list-item-icon class="mr-1">
                <v-icon size="20">
                  settings
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content class="text-body-2">
                Module settings
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-card flat>
            <v-card-title class="text-h6">
              {{ node.name }} settings
            </v-card-title>
            <v-divider />
            <v-card-text style="max-height: 80vh;" class="py-6">
              <d-stack :gap="16">

                <d-icon-selector
                  v-if="node.component === 'VIcon'"
                  v-model="nodeSettings.text"
                />

                <v-text-field
                  v-if="hasOwnProperty('text', node) && node.component !== 'VIcon'"
                  v-model="nodeSettings.text"
                  label="Text"
                  outlined
                  hide-details="auto"
                  class="ma-0"
                />

                <d-stack v-if="node.availableProps" :gap="16">
                  <div class="text-caption font-weight-medium">
                    Module properties
                  </div>

                  <div v-for="[key, prop] of Object.entries(node.availableProps)" :key="key">
                    <d-icon-selector
                      v-if="key === 'icon'"
                      v-model="nodeSettings.props[key]"
                    />

                    <v-text-field
                      v-if="/string|number/.test(prop.type) && key !== 'icon'"
                      v-model="nodeSettings.props[key]"
                      :label="key"
                      outlined
                      hide-details="auto"
                      class="ma-0"
                    />

                    <v-checkbox
                      v-if="prop.type === 'boolean'"
                      v-model="nodeSettings.props[key]"
                      :label="key"
                      hide-details="auto"
                      class="ma-0"
                    />

                    <v-select
                      v-if="prop.type === 'array'"
                      v-model="nodeSettings.props[key]"
                      :items="prop.value"
                      :label="key"
                      outlined
                      hide-details="auto"
                      class="ma-0"
                    />
                  </div>
                </d-stack>

                <d-stack v-if="node.availableAttrs" :gap="16">
                  <div class="text-caption font-weight-medium">
                    Module attributes
                  </div>
                  <div v-for="[key, attr] of Object.entries(node.availableAttrs)" :key="key">

                    <v-text-field
                      v-if="/string|number/.test(attr.type) && key !== 'icon'"
                      v-model="nodeSettings.attrs[key]"
                      :label="key"
                      outlined
                      hide-details="auto"
                      class="ma-0"
                    />

                    <v-checkbox
                      v-if="attr.type === 'boolean'"
                      v-model="nodeSettings.attrs[key]"
                      :label="key"
                      hide-details="auto"
                      class="ma-0"
                    />

                    <v-select
                      v-if="attr.type === 'array'"
                      v-model="nodeSettings.attrs[key]"
                      :items="attr.value"
                      :label="key"
                      outlined
                      hide-details="auto"
                      class="ma-0"
                    />
                  </div>
                </d-stack>

                <div>
                  <v-btn
                    x-small
                    text
                    class="ml-n1 px-1"
                    @click="advancedOpen = !advancedOpen"
                  >
                    Advanced settings
                    <v-icon right>
                      {{ advancedOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                  </v-btn>

                  <d-stack v-if="advancedOpen" :gap="16" class="mt-4">
                    <v-textarea
                      v-model="nodeSettings.if"
                      label="Condition"
                      outlined
                      hide-details="auto"
                      class="ma-0"
                      auto-grow
                      :rows="1"
                    />

                    <v-textarea
                      v-model="nodeSettings.class"
                      label="Additional classes"
                      outlined
                      hide-details="auto"
                      class="ma-0"
                      auto-grow
                      :rows="1"
                    />

                    <v-text-field
                      v-model="nodeSettings.slot"
                      label="Slot"
                      outlined
                      hide-details="auto"
                      class="ma-0"
                    />
                  </d-stack>
                </div>
              </d-stack>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <div class="spacer" />
              <v-btn
                text
                color="primary"
                @click="settingsOpen = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="applySettings()"
              >
                Apply
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-list-item
          v-if="!node.required"
          @click="clickRemove()"
        >
          <v-list-item-icon class="mr-1">
            <v-icon size="20">
              mdi-delete
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content class="text-body-2">
            Delete module
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DIconSelector from '@/components/Deipify/DIconSelector/DIconSelector';
  import { filterObjectOnKeys } from 'vuetify/lib/util/helpers';
  import { hasOwnProperty } from '@/utils/helpers';
  import AdminLayoutsModulesMarkers
    from '@/components/AdminPanel/Layouts/Composer/ModulesList/AdminLayoutsModulesMarkers';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  export default {
    name: 'AdminLayoutsComposerNodeSettings',
    components: {
      DSimpleTooltip,
      AdminLayoutsModulesMarkers,
      DIconSelector,
      DStack
    },
    mixins: [ProxyableFactory('node')],
    data() {
      return {
        settingsOpen: false,
        advancedOpen: false,
        menuOpen: false,

        nodeSettings: {

          props: {},
          attrs: {},

        }
      };
    },
    computed: {
      markers() {
        return [
          ...(this.node.if
            ? [{
              icon: 'mdi-xml',
              tooltip: 'Component has a condition'
            }] : []),

          ...(this.node.props && this.node.props.background
            ? [{
              icon: 'mdi-image-outline',
              tooltip: 'Component has a background image'
            }] : []),
        ];
      }
    },
    created() {
      const model = _.cloneDeep(filterObjectOnKeys(
        this.node,
        [
          'text',

          'props',
          'attrs',

          'if',
          'class',
          'slot'
        ]
      ));

      this.nodeSettings = {
        ...this.nodeSettings,
        ...model
      };
    },
    methods: {
      hasOwnProperty(prop, obj) {
        return hasOwnProperty(prop, obj)
      },

      openMenu() {
        this.menuOpen = true;
      },
      openSettings() {
        this.settingsOpen = true;
        this.menuOpen = false;
      },
      applySettings() {
        // this.$emit('change', 'ssss');
        this.internalValue = {
          ...this.node,
          ...this.nodeSettings
        };
        this.settingsOpen = false;
      },

      clickRemove() {
        this.$emit('click:remove', this.node.id$);
      }
    }
  };
</script>
