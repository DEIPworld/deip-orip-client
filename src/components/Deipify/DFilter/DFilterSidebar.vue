<template>
  <div>
    <v-btn
      outlined
      small
      color="primary"
      class="ml-3"
      @click="toggle"
    >
      <v-icon left>
        filter_alt
      </v-icon>
      Filter
    </v-btn>
    <v-badge
      v-if="filterCount"
      color="warning"
      :content="filterCount"
      offset-y="-12px"
      offset-x="12px"
    />

    <portal to="sidebar">
      <v-navigation-drawer
        ref="sidebar"
        v-mutate="onMutate"
        :width="280"
        right
        app
        clipped
        :value="isActive"
      >
        <template #prepend>
          <v-sheet ref="header" class="px-6 py-4">
            <v-row class="justify-space-between" no-gutters>
              <div class="text-h6">
                Filter
              </div>
              <v-btn icon class="ma-n2" @click="toggle">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-row>
          </v-sheet>
          <v-divider />
        </template>

        <v-sheet max-height="100%" class="d-flex flex-column">
          <div
            ref="content"
            data-x
            class="spacer py-2"
            style="overflow: auto"
          >
            <slot />
          </div>

          <v-divider v-if="bottomDivider" />

          <div ref="actions" class="px-6 py-4 text-right">
            <slot name="actions">
              <v-btn
                v-if="resetVisible"
                text
                color="primary"
                small
                :disabled="loading"
                @click="onReset()"
              >
                Clear
              </v-btn>
              <v-btn
                color="primary"
                small
                :disabled="loading || !filterChanged"
                :loading="loading"
                @click="onApply()"
              >
                Show result
              </v-btn>
            </slot>
          </div>
        </v-sheet>
      </v-navigation-drawer>
    </portal>
  </div>
</template>

<script>
  import { factory as toggleable } from 'vuetify/lib/mixins/toggleable';
  import { Filterable } from './filterable';

  export default {
    name: 'DFilterSidebar',

    mixins: [toggleable('active'), Filterable],

    data() {
      return {
        bottomDivider: false
      };
    },

    created() {
      this.$emit('apply');
    },

    methods: {
      toggle() {
        this.isActive = !this.isActive;
      },

      onMutate() {
        const sidebarHeight = this.$refs.sidebar.$el.clientHeight;
        const headerHeight = this.$refs.header.$el.clientHeight;
        const contentHeight = this.$refs.content.scrollHeight;
        const actionsHeight = this.$refs.actions.clientHeight;

        this.bottomDivider = contentHeight > sidebarHeight - headerHeight - actionsHeight;
      }
    }
  };
</script>
