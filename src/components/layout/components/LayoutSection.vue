<template>
  <v-container fluid class="pa-3 pa-md-6">
    <v-row no-gutters class="ma-0">
      <v-col class="pa-3 pa-md-6">
        <slot name="default" />
      </v-col>
      <v-col
        v-if="$hasSlot('sidebar')"
        class="pa-3 pa-md-6"
        v-bind="_sidebarCols"
      >
        <slot name="sidebar" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'LayoutSection',
    props: {
      sidebarCols: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      _sidebarCols() {return { ...{ cols: 12, md: 3 }, ...this.sidebarCols }; }
    }
  };
</script>

<style scoped>

</style>
