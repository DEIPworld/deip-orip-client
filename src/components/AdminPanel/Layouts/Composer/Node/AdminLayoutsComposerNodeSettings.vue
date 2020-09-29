<template>
  <div class="d-flex align-center">

    <v-btn
      v-if="/AttributesRead|AttributesSet/.test(node.component)"
      icon
      x-small
      @click="copyAttrId()"
    >
      <v-icon class="ma-0" size="14">
        mdi-clipboard-multiple-outline
      </v-icon>
    </v-btn>

    <v-dialog
      v-if="node.availableProps"
      v-model="settingsOpen"
      :max-width="400"
      scrollable
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          x-small
          v-on="on"
        >
          <v-icon size="14" class="ma-0">
            settings
          </v-icon>
        </v-btn>
      </template>

      <v-card flat>
        <v-card-title class="text-h6">
          {{ node.name }} settings
        </v-card-title>
        <v-divider />
        <v-card-text style="max-height: 80vh;" class="py-6">
          <d-stack :gap="16">
            <div v-for="[key, prop] of Object.entries(node.availableProps)" :key="key">
              <d-autocomplete
                v-if="key === 'icon'"
                v-model="propSettings[key]"
                :items="icons"
                outlined
                hide-details="auto"
                label="Icon"
              >
                <template #item="{ item }">
                  <v-list-item-icon class="mr-4">
                    <v-icon>{{ item.value }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content class="text-body-2">
                    {{ item.text }}
                  </v-list-item-content>
                </template>
              </d-autocomplete>

              <v-text-field
                v-if="/string|number/.test(prop.type) && key !== 'icon'"
                v-model="propSettings[key]"
                :label="key"
                outlined
                hide-details="auto"
                class="ma-0"
              />

              <v-checkbox
                v-if="prop.type === 'boolean'"
                v-model="propSettings[key]"
                :label="key"
                hide-details="auto"
                class="ma-0"
              />

              <v-select
                v-if="prop.type === 'array'"
                v-model="propSettings[key]"
                :items="prop.value"
                :label="key"
                outlined
                hide-details="auto"
                class="ma-0"
              />
            </div>

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
                  v-model="node.if"
                  label="Condition"
                  outlined
                  hide-details="auto"
                  class="ma-0"
                  auto-grow
                  :rows="1"
                />

                <v-textarea
                  v-model="node.class"
                  label="Additional classes"
                  outlined
                  hide-details="auto"
                  class="ma-0"
                  auto-grow
                  :rows="1"
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

    <v-btn
      v-if="!node.required"
      icon
      x-small
      @click="clickRemove()"
    >
      <v-icon class="ma-0">
        clear
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
  import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';
  import * as mdiIcons from '@mdi/js';
  import { paramCase, noCase, capitalCase } from 'change-case';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DAutocomplete from '@/components/Deipify/DAutocomplete/DAutocomplete';

  export default {
    name: 'AdminLayoutsComposerNodeSettings',
    components: {
      DAutocomplete,
      DStack
    },
    mixins: [ProxyableFactory('node')],
    data() {
      return {
        settingsOpen: false,
        advancedOpen: false,
        propSettings: {},
        optionalChildren: false
      };
    },
    computed: {
      icons() {
        return Object.keys(mdiIcons)
          .map((i) => ({
            text: capitalCase(noCase(i.replace('mdi', ''))),
            value: paramCase(i)
          }));
      }
    },
    created() {
      this.propSettings = {
        ...this.propSettings,
        ...this.node.props
      };
    },
    methods: {
      applySettings() {
        this.node.props = {
          ...this.node.props,
          ...this.propSettings
        };
        this.settingsOpen = false;
      },
      copyAttrId() {
        const id = this.node.props.attribute.split('.').slice(-1).pop();
        this.$clipboard(id);
      },
      clickRemove() {
        this.$emit('click:remove', this.node.id$);
      }
    }
  };
</script>
