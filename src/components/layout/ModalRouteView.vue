<template>
  <v-dialog
    :value="dialog"
    fullscreen
    hide-overlay
    :transition="false"
  >
    <v-card tile>
      <v-toolbar flat>
        <v-btn icon @click="goBack()">
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
    name: 'ModalRouteView',
    data() {
      return {
        dialog: true
      };
    },
    methods: {
      goBack() {
        this.dialog = false;

        setTimeout(() => {
          this.$router.back();
        }, 150);
      }
    }
    // watch: {
    //   dialog(val) {
    //     if (!val) {
    //       setTimeout(() => {
    //         this.$router.back();
    //       }, 150);
    //     }
    //   }
    // }
  };
</script>

<style scoped>

</style>
