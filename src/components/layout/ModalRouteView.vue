<template>
  <v-dialog
    :value="dialog"
    fullscreen
    hide-overlay
    :transition="false"
    scrollable
  >
    <v-card tile>
      <v-toolbar flat v-if="!hideToolbar" class="flex-grow-0">
        <v-btn icon @click="goBack()">
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-divider v-if="!hideToolbar" />
      <v-card-text
        class="pb-0 px-0 full-height"
        :class="{
          'd-flex align-center justify-center': centerContent
        }"
      >
        <v-sheet :max-width="maxWidth" class="pa-12 mx-auto full-height">
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
        type: [Number, String],
        default: 800
      },
      goBackTo: {
        type: String,
        default: undefined
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
          if (this.goBackTo) {
            this.$router.push(this.goBackTo);
          } else {
            this.$router.back();
          }
        }, 150);
      }
    }
  };
</script>

<style scoped>

</style>
