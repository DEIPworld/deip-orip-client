<template>
  <div>
    <v-btn
      outlined
      small
      color="primary"
      class="ml-3"
      @click="toggleDrawer"
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
        right
        app
        clipped
        :value="isOpen"
      >
        <template #prepend>
          <v-sheet ref="header" class="pa-4" color="grey lighten-4">
            <v-row class="justify-space-between" no-gutters>
              <div class="text-h6">
                Filter
              </div>
              <v-btn icon class="ma-n2" @click="toggleDrawer">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-row>
          </v-sheet>
        </template>

        <v-sheet max-height="100%" class="d-flex flex-column">
          <div data-x ref="content" class="pa-4 spacer" style="overflow: auto">
            <slot />
          </div>

          <v-divider v-if="bottomDivider" />

          <div ref="actions" class="pa-4 text-right">
            <slot name="actions">
              <v-btn
                text
                color="primary"
                small
                @click="resetFilter()"
              >
                Clear
              </v-btn>
              <v-btn
                color="primary"
                small
                @click="applyFilter"
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
  import Proxyable from 'vuetify/lib/mixins/proxyable';

  export default {
    name: 'DFilter',

    mixins: [Proxyable],

    props: {
      filterCount: {
        type: [String, Number],
        default: undefined
      }
    },

    data() {
      return {
        isOpen: false,
        bottomDivider: false
      };
    },

    computed: {},

    created() {
      this.$emit('apply');
    },

    methods: {
      toggleDrawer() {
        this.isOpen = !this.isOpen;
      },

      resetFilter() {
        this.$emit('reset');
      },

      applyFilter() {
        this.$emit('apply');
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

<style scoped>

</style>
