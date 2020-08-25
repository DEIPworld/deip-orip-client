<template>
  <v-sheet outlined rounded>
    <v-item-group
      v-model="viewModel"
      class="d-flex align-stretch"
      style="margin: -1px"
      color="white"
      mandatory
      dense
      @change="change"
    >
      <v-item #default="{ active, toggle }" :value="VIEW_TYPES.GRID">
        <v-btn tile icon small @click="toggle">
          <v-icon :color="active ? 'primary' : 'grey'">
            view_module
          </v-icon>
        </v-btn>
      </v-item>
      <v-divider vertical />
      <v-item #default="{ active, toggle }" :value="VIEW_TYPES.LIST">
        <v-btn tile icon small @click="toggle">
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
