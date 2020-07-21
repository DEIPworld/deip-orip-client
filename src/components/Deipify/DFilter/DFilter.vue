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
      v-if="filtersCount"
      color="warning"
      :content="filtersCount"
      offset-y="-12px"
      offset-x="12px"
    />
    <portal to="sidebar">
      <v-navigation-drawer
        right
        app
        clipped
        :value="isOpen"
      >
        <template #prepend>
          <v-sheet class="pa-4" color="grey lighten-4">
            <v-row class="justify-space-between" no-gutters>
              <div class="text-h6">
                Filter
              </div>
              <v-btn icon class="ma-n2" @click="toggleDrawer">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-row>
          </v-sheet>
<!--          <v-divider />-->
        </template>

        <v-sheet max-height="100%" class="d-flex flex-column">
          <div class="pa-4 spacer" style="overflow: auto">
            <slot />
          </div>
          <v-divider />
          <div class="pa-4 text-right">
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
  export default {
    name: 'DFilter',

    props: {
      value: {
        type: Object,
        default: () => ({})
      },
      storageKey: {
        type: String,
        default: undefined
      }
    },

    data() {
      return {
        isOpen: false,
        filtersCount: 0
      };
    },

    computed: {
      filterModel: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      },
    },

    created() {
      if (this.$ls.get(this.storageKey)) {
        this.filterModel = this.$ls.get(this.storageKey);
      }

      this.setFilterCount();

      this.$emit('applyFilter');
    },
    methods: {
      toggleDrawer() {
        this.isOpen = !this.isOpen;
      },

      setFilterCount() {
        setTimeout(() => {
          this.filtersCount = Object.values(this.filterModel).filter((a) => a.length > 0).length;
        });
      },

      resetFilter() {
        this.$emit('resetFilter');
        this.$ls.set(this.storageKey, this.filterModel);
        this.setFilterCount();
      },

      applyFilter() {
        this.$emit('applyFilter');
        this.$ls.set(this.storageKey, this.filterModel);
        this.setFilterCount();
      }
    }
  };
</script>

<style scoped>

</style>
