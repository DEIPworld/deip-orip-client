<template>
  <div class="d-inline-flex align-center">
    <v-dialog
      v-if="internalValue.availableProps"
      v-model="settingsOpen"
      :max-width="400"
      scrollable
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          x-small
          class="ml-1"
          v-on="on"
        >
          <v-icon size="14" class="ma-0">
            settings
          </v-icon>
        </v-btn>
      </template>

      <v-card flat>
        <v-card-title class="text-h6">{{ internalValue.name }} settings</v-card-title>
        <v-divider />
        <v-card-text style="max-height: 300px;" class="py-6">
          <d-stack :gap="16">
            <div v-for="(prop, index) of Object.keys(internalValue.availableProps)" :key="index">

              <v-text-field
                v-if="/string|number/.test(getProp(prop).type)"
                v-model="propSettings[prop]"
                outlined
                :label="prop"
                hide-details="auto"
                class="ma-0"
              />

              <v-checkbox
                v-if="getProp(prop).type === 'boolean'"
                v-model="propSettings[prop]"
                :label="prop"
                hide-details="auto"
                class="ma-0"
              />

              <v-select
                v-if="getProp(prop).type === 'array'"
                v-model="propSettings[prop]"
                :items="getProp(prop).value"
                outlined
                :label="prop"
                hide-details="auto"
                class="ma-0"
              />
            </div>
          </d-stack>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="spacer"></div>
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
      v-if="!internalValue.required"
      icon
      x-small
      @click="$emit('click:remove')"
    >
      <v-icon class="ma-0">
        clear
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import kindOf from 'kind-of';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'AdminLayoutsNodeSettings',
    components: { DStack },
    mixins: [Proxyable],
    data() {
      return {
        settingsOpen: false,
        propSettings: {}
      };
    },
    methods: {
      applySettings() {
        this.internalValue.props = {
          ...this.internalValue.props,
          ...this.propSettings
        };
        this.settingsOpen = false;
      },
      getProp(prop) {
        const type = kindOf(this.internalValue.availableProps[prop]);

        if (type === 'array') {
          return {
            type: 'array',
            value: this.internalValue.availableProps[prop]
          };
        }

        return {
          type: this.internalValue.availableProps[prop],
          value: null
        };
      }
    }
  };
</script>
