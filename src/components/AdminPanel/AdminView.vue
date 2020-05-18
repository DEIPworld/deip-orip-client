<template>
  <v-sheet tile>
    <v-toolbar flat>
      <v-toolbar-title class="headline">
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <slot name="toolbarAction" />

      <template v-if="$hasSlot('toolbarExtension')" #extension>
        <slot name="toolbarExtension" />
      </template>
    </v-toolbar>

    <v-divider />

    <v-sheet class="pa-6">
      <slot />
    </v-sheet>
  </v-sheet>
</template>

<script>
  export default {
    name: 'AdminView',
    props: {
      title: {
        default: 'Admin',
        type: String,
        required: true
      }
    }
  };
</script>

<style scoped>

</style>
