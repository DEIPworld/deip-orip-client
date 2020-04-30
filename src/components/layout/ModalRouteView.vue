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
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-divider />
      <v-sheet :max-width="maxWidth" class="pa-12 mx-auto">
        <slot />
      </v-sheet>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ModalRouteView',
    props: {
      title: {
        type: String,
        default: null
      },
      icon: {
        type: String,
        default: 'arrow_back'
      },
      maxWidth: {
        type: Number,
        default: 800
      }
    },
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
