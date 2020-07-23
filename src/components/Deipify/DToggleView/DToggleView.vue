<template>
  <v-sheet :height="36" class="align-center d-flex">
    <v-item-group
      v-model="viewModel"
      color="white"
      mandatory
      dense
      @change="change"
    >
      <v-item :value="VIEW_TYPES.GRID" #default="{ active, toggle }">
        <v-btn icon class="my-n3" @click="toggle">
          <v-icon :color="active ? 'primary' : 'grey'">
            view_module
          </v-icon>
        </v-btn>
      </v-item>
      <v-item :value="VIEW_TYPES.LIST" #default="{ active, toggle }">
        <v-btn icon class="my-n3" @click="toggle">
          <v-icon :color="active ? 'primary' : 'grey'">
            view_list
          </v-icon>
        </v-btn>
      </v-item>
    </v-item-group>
  </v-sheet>
</template>

<script>
  import { VIEW_TYPES } from '@/variables';

  export default {
    name: 'DToggleView',

    props: {
      storageKey: {
        type: String,
        default: undefined
      }
    },

    data() {
      return {
        VIEW_TYPES,
        viewModel: VIEW_TYPES.GRID
      };
    },

    created() {
      if (!this.$ls.get(this.storageKey)) {
        this.$ls.set(this.storageKey, this.viewModel);
      } else {
        this.viewModel = this.$ls.get(this.storageKey);
      }
    },

    methods: {
      change(e) {
        this.$ls.set(this.storageKey, e);
      }
    }
  };
</script>

<style scoped>

</style>
