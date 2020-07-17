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
              <v-btn icon @click="toggleDrawer" class="ma-n2">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-row>
          </v-sheet>
          <v-divider />
        </template>

        <div class="pa-4">
          <slot :reset="reset"/>
        </div>
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
        defaultModel: {}
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
      filtersCount() {
        return Object.values(this.filterModel).filter((a) => a.length > 0).length;
      }
    },

    watch: {
      filterModel: {
        handler(newVal) {
          this.$ls.set(this.storageKey, newVal);
        },
        deep: true
      }
    },

    created() {
      this.defaultModel = {...this.defaultModel, ...this.filterModel}

      if (this.$ls.get(this.storageKey)) {
        this.filterModel = this.$ls.get(this.storageKey);
      }
    },

    methods: {
      toggleDrawer() {
        this.isOpen = !this.isOpen;
      },
      reset(key) {
        if (key) {
          this.filterModel[key] = this.defaultModel[key];
        } else {
          this.filterModel = this.defaultModel;
        }
      }
    }
  };
</script>

<style scoped>

</style>
