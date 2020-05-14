<template>
  <v-dialog
    :value="dialog"
    fullscreen
    hide-overlay
    :transition="false"
    scrollable
  >
    <v-card tile>
      <v-toolbar flat v-if="!hideToolbar">
        <v-btn icon @click="goBack()">
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-divider v-if="!hideToolbar" />
      <v-card-text
        :class="{
          'pt-6': hideToolbar,
          'd-flex align-center justify-center': centerContent
        }"
      >
        <v-sheet :max-width="maxWidth" class="pa-12 mx-auto">
          <slot />
        </v-sheet>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ModalRouteView',
    props: {
      hideToolbar: {
        type: Boolean,
        default: false
      },
      centerContent: {
        type: Boolean,
        default: false
      },
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
  };
</script>

<style scoped>

</style>
