<template>
  <v-dialog
    :value="dialog"
    fullscreen
    hide-overlay
    :transition="'dialog-bottom-transition'"
    @input="methodToExecuteWhenClosed()"
  >
    <v-card tile>
      <v-toolbar flat>
        <v-btn icon @click="dialog = false">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>Add new member</v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <v-sheet max-width="800" class="pa-12 mx-auto">
        <slot />
      </v-sheet>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'PseudoModal',
    data() {
      return {
        dialog: true
      };
    },
    watch: {
      dialog(val) {
        if (!val) {
          setTimeout(() => {
            this.$router.back();
          }, 150);
        }
      }
    }
  };
</script>

<style scoped>

</style>
